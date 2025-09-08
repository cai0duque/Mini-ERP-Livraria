import { Prisma } from "@prisma/client";
import { prisma } from "../../../shared/prisma";

export class CompraRepository {
  async findAll() {
    return prisma.compra.findMany({
      orderBy: { data: "desc" },
      include: {
        cliente: { select: { id: true, nome: true } },
        funcionario: { select: { id: true, nome: true, email: true } },
        itens: {
          include: {
            produto: { select: { id: true, sku: true, nome: true, tipo: true } },
          },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.compra.findUnique({
      where: { id },
      include: {
        cliente: { select: { id: true, nome: true } },
        funcionario: { select: { id: true, nome: true, email: true } },
        itens: {
          include: {
            produto: { select: { id: true, sku: true, nome: true, tipo: true } },
          },
        },
        movimentos: true,
      },
    });
  }

  // As operações de criação são feitas no service dentro de transaction (tx)
  createTx(
    tx: Prisma.TransactionClient,
    data: { clienteId?: string | null; funcionarioId: string; total: Prisma.Decimal }
  ) {
    return tx.compra.create({
      data: {
        clienteId: data.clienteId ?? null,
        funcionarioId: data.funcionarioId,
        total: data.total,
      },
    });
  }
}