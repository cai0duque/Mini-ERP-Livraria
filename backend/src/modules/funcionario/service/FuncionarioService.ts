import bcrypt from "bcrypt";
import { FuncionarioRepository } from "../repository/FuncionarioRepository";
import {
  funcionarioCreateSchema,
  funcionarioUpdateSchema,
  FuncionarioCreateDTO,
  FuncionarioUpdateDTO,
} from "../dto";

const repo = new FuncionarioRepository();

export class FuncionarioService {
  list() { return repo.findAll(); }
  get(id: string) { return repo.findById(id); }

  async create(payload: FuncionarioCreateDTO) {
    const data = funcionarioCreateSchema.parse(payload);
    const senhaHash = await bcrypt.hash(data.senha, 10);
    return repo.create({
      nome: data.nome,
      email: data.email,
      senhaHash,
      papel: data.papel,
    });
  }

  async update(id: string, payload: FuncionarioUpdateDTO) {
    const data = funcionarioUpdateSchema.parse(payload);
    const updateData: any = { ...data };
    if (data.senha) {
      updateData.senhaHash = await bcrypt.hash(data.senha, 10);
      delete updateData.senha;
    }
    return repo.update(id, updateData);
  }

  remove(id: string) { return repo.delete(id); }
}
