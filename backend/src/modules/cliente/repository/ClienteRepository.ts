import { prisma } from "../../../shared/prisma";

export class ClienteRepository {
  findAll() {
    return prisma.cliente.findMany({ orderBy: { nome: "asc" } });
  }

  findById(id: string) {
    return prisma.cliente.findUnique({ where: { id } });
  }

  create(data: { nome: string; email?: string; cpf?: string }) {
    return prisma.cliente.create({ data });
  }

  update(id: string, data: Partial<{ nome: string; email?: string | null; cpf?: string | null }>) {
    return prisma.cliente.update({ where: { id }, data });
  }

  delete(id: string) {
    return prisma.cliente.delete({ where: { id } });
  }
}
