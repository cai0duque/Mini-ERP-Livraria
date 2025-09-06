import { ProdutoRepository } from "../repository/ProdutoRepository";
import { produtoCreateSchema, produtoUpdateSchema, ProdutoCreateDTO, ProdutoUpdateDTO } from "../dto";

const repo = new ProdutoRepository();

export class ProdutoService {
  list() {
    return repo.findAll();
  }

  get(id: string) {
    return repo.findById(id);
  }

  async create(payload: ProdutoCreateDTO) {
    const data = produtoCreateSchema.parse(payload);
    return repo.create(data);
  }

  async update(id: string, payload: ProdutoUpdateDTO) {
    const data = produtoUpdateSchema.parse(payload);
    return repo.update(id, data);
  }

  remove(id: string) {
    return repo.delete(id);
  }
}
