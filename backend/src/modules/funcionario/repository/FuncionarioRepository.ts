import { Prisma, PapelFuncionario } from "@prisma/client";
import { prisma } from "../../../shared/prisma";

export class FuncionarioRepository {
  findAll() {
    return prisma.funcionario.findMany({ orderBy: { nome: "asc" } });
  }

  findById(id: string) {
    return prisma.funcionario.findUnique({ where: { id } });
  }

  create(data: { nome: string; email: string; senhaHash: string; papel: PapelFuncionario }) {
    return prisma.funcionario.create({ data });
  }

  update(id: string, data: Partial<{ nome: string; email: string; senhaHash: string; papel: PapelFuncionario }>) {
    return prisma.funcionario.update({ where: { id }, data });
  }

  delete(id: string) {
    return prisma.funcionario.delete({ where: { id } });
  }
}
