import { clienteCreateSchema, clienteUpdateSchema, ClienteCreateDTO, ClienteUpdateDTO } from "../dto";
import { ClienteRepository } from "../repository/ClienteRepository";

const repo = new ClienteRepository();

export class ClienteService {
  list() { return repo.findAll(); }
  get(id: string) { return repo.findById(id); }

  async create(payload: ClienteCreateDTO) {
    const data = clienteCreateSchema.parse(payload);
    return repo.create(data);
  }

  async update(id: string, payload: ClienteUpdateDTO) {
    const data = clienteUpdateSchema.parse(payload);
    return repo.update(id, data);
  }

  remove(id: string) { return repo.delete(id); }
}
