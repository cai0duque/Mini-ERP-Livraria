import { Prisma } from "@prisma/client";
import { prisma } from "../../../shared/prisma";
import { movimentoCreateSchema, MovimentoCreateDTO } from "../dto";
import { MovimentoEstoqueRepository } from "../repository/MovimentoEstoqueRepository";

const repo = new MovimentoEstoqueRepository();

export class MovimentoEstoqueService {
  list() {
    return repo.listAll();
  }

  listByProduto(produtoId: string) {
    return repo.listByProduto(produtoId);
  }

  async create(payload: MovimentoCreateDTO) {
    const data = movimentoCreateSchema.parse(payload);

    return prisma.$transaction(async (tx) => {
      const produto = await tx.produto.findUnique({
        where: { id: data.produtoId },
        select: { id: true, estoque: true },
      });
      if (!produto) {
        // vai ser tratado como 404 pelo controller
        const err = new Error("PRODUTO_NAO_ENCONTRADO");
        // @ts-ignore
        err.code = "P2025";
        throw err;
      }

      const delta = data.tipo === "ENTRADA_AJUSTE" ? data.quantidade : -data.quantidade;
      const novoEstoque = produto.estoque + delta;

      if (novoEstoque < 0) {
        const err = new Error("ESTOQUE_INSUFICIENTE");
        // @ts-ignore
        err.status = 400;
        throw err;
      }

      // Atualiza estoque do produto
      await tx.produto.update({
        where: { id: produto.id },
        data: { estoque: novoEstoque },
      });

      // Registra movimento
      const mov = await repo.createTx(tx, {
        produtoId: produto.id,
        tipo: data.tipo,
        quantidade: data.quantidade,
        data: data.data,
      });

      return { ...mov, estoqueAtual: novoEstoque };
    });
  }
}