import { Prisma, TipoMovimento } from "@prisma/client";
import { prisma } from "../../../shared/prisma";

export class MovimentoEstoqueRepository {
  async listAll() {
    return prisma.movimentoEstoque.findMany({
      orderBy: { data: "desc" },
      include: {
        produto: { select: { id: true, sku: true, nome: true, estoque: true } },
        compra: { select: { id: true } },
      },
    });
  }

  async listByProduto(produtoId: string) {
    return prisma.movimentoEstoque.findMany({
      where: { produtoId },
      orderBy: { data: "desc" },
      include: {
        produto: { select: { id: true, sku: true, nome: true, estoque: true } },
      },
    });
  }

  // Usado dentro de transação
  async createTx(
    tx: Prisma.TransactionClient,
    data: {
      produtoId: string;
      tipo: TipoMovimento;
      quantidade: number;
      data?: Date;
      compraId?: string | null;
    }
  ) {
    return tx.movimentoEstoque.create({
      data: {
        produtoId: data.produtoId,
        tipo: data.tipo,
        quantidade: data.quantidade,
        data: data.data ?? new Date(),
        compraId: data.compraId ?? null,
      },
    });
  }
}