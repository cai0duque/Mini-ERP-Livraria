import { Prisma, TipoProduto } from "@prisma/client";
import { prisma } from "../../../shared/prisma";

export class ProdutoRepository {
  async findAll() {
    return prisma.produto.findMany({
      orderBy: { nome: "asc" },
      include: { detalhes: true },
    });
  }

  async findById(id: string) {
    return prisma.produto.findUnique({
      where: { id },
      include: { detalhes: true },
    });
  }

  async create(data: {
    sku: string;
    nome: string;
    tipo: TipoProduto;
    preco: number;
    estoque: number;
    detalhes?: { isbn?: string; autor?: string; editora?: string };
  }) {
    const precoDecimal = new Prisma.Decimal(String(data.preco));
    return prisma.produto.create({
      data: {
        sku: data.sku,
        nome: data.nome,
        tipo: data.tipo,
        preco: precoDecimal,
        estoque: data.estoque ?? 0,
        detalhes:
          data.tipo === "LIVRO" && data.detalhes
            ? {
                create: {
                  isbn: data.detalhes.isbn,
                  autor: data.detalhes.autor,
                  editora: data.detalhes.editora,
                },
              }
            : undefined,
      },
      include: { detalhes: true },
    });
  }

  async update(id: string, data: Partial<{
    sku: string;
    nome: string;
    tipo: TipoProduto;
    preco: number;
    estoque: number;
    detalhes: { isbn?: string; autor?: string; editora?: string };
  }>) {
    const toUpdate: Prisma.ProdutoUpdateInput = {};

    if (data.sku) toUpdate.sku = data.sku;
    if (data.nome) toUpdate.nome = data.nome;
    if (data.tipo) toUpdate.tipo = data.tipo;
    if (typeof data.preco === "number") {
      toUpdate.preco = new Prisma.Decimal(String(data.preco));
    }
    if (typeof data.estoque === "number") toUpdate.estoque = data.estoque;

    //Atualiza/gera detalhes apenas se for LIVRO
    if (data.tipo === "LIVRO" && data.detalhes) {
      toUpdate.detalhes = {
        upsert: {
          update: {
            isbn: data.detalhes.isbn,
            autor: data.detalhes.autor,
            editora: data.detalhes.editora,
          },
          create: {
            isbn: data.detalhes.isbn,
            autor: data.detalhes.autor,
            editora: data.detalhes.editora,
          },
        },
      };
    }

    return prisma.produto.update({
      where: { id },
      data: toUpdate,
      include: { detalhes: true },
    });
  }

  async delete(id: string) {
    return prisma.produto.delete({ where: { id } });
  }
}
