import { Prisma } from "@prisma/client";
import { prisma } from "../../../shared/prisma";
import { CompraRepository } from "../repository/CompraRepository";
import { compraCreateSchema, CompraCreateDTO } from "../dto";

const repo = new CompraRepository();

export class CompraService {
  list() {
    return repo.findAll();
  }

  get(id: string) {
    return repo.findById(id);
  }

  async create(payload: CompraCreateDTO) {
    const data = compraCreateSchema.parse(payload);

    return prisma.$transaction(async (tx) => {
      // valida funcionario
      const func = await tx.funcionario.findUnique({ where: { id: data.funcionarioId }, select: { id: true } });
      if (!func) {
        const e = new Error("FUNCIONARIO_NAO_ENCONTRADO"); // 404
        // @ts-ignore
        e.code = "P2025";
        throw e;
      }

      // valida cliente (se vier)
      if (data.clienteId) {
        const cli = await tx.cliente.findUnique({ where: { id: data.clienteId }, select: { id: true } });
        if (!cli) {
          const e = new Error("CLIENTE_NAO_ENCONTRADO"); // 404
          // @ts-ignore
          e.code = "P2025";
          throw e;
        }
      }

      // carrega produtos e checa estoque
      const itemsPrepared: Array<{
        produtoId: string;
        quantidade: number;
        precoUnit: Prisma.Decimal;
      }> = [];

      let total = new Prisma.Decimal(0);

      for (const it of data.itens) {
        const prod = await tx.produto.findUnique({
          where: { id: it.produtoId },
          select: { id: true, preco: true, estoque: true },
        });
        if (!prod) {
          const e = new Error("PRODUTO_NAO_ENCONTRADO"); // 404
          // @ts-ignore
          e.code = "P2025";
          throw e;
        }

        const precoUnit = typeof it.precoUnit === "number"
          ? new Prisma.Decimal(String(it.precoUnit))
          : new Prisma.Decimal(prod.preco); // usa preço atual do produto

        // checa estoque
        if (prod.estoque - it.quantidade < 0) {
          const e = new Error(`ESTOQUE_INSUFICIENTE_${prod.id}`);
          // @ts-ignore
          e.status = 400;
          throw e;
        }

        const subtotal = precoUnit.mul(it.quantidade);
        total = total.plus(subtotal);

        itemsPrepared.push({
          produtoId: prod.id,
          quantidade: it.quantidade,
          precoUnit,
        });
      }

      // cria compra
      const compra = await repo.createTx(tx, {
        clienteId: data.clienteId ?? null,
        funcionarioId: data.funcionarioId,
        total,
      });

      // cria itens + movimentos + atualiza estoque
      for (const it of itemsPrepared) {
        await tx.itemCompra.create({
          data: {
            compraId: compra.id,
            produtoId: it.produtoId,
            quantidade: it.quantidade,
            precoUnit: it.precoUnit,
          },
        });

        // movimento (saída por venda)
        await tx.movimentoEstoque.create({
          data: {
            produtoId: it.produtoId,
            tipo: "SAIDA_VENDA",
            quantidade: it.quantidade,
            compraId: compra.id,
          },
        });

        // baixa estoque
        await tx.produto.update({
          where: { id: it.produtoId },
          data: { estoque: { decrement: it.quantidade } },
        });
      }

      // retorna compra completa
      const complete = await tx.compra.findUnique({
        where: { id: compra.id },
        include: {
          cliente: { select: { id: true, nome: true } },
          funcionario: { select: { id: true, nome: true, email: true } },
          itens: {
            include: { produto: { select: { id: true, sku: true, nome: true, tipo: true } } },
          },
          movimentos: true,
        },
      });

      return complete!;
    });
  }
}