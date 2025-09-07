import { Request, Response } from "express";
import { MovimentoEstoqueService } from "../service/MovimentoEstoqueService";

const service = new MovimentoEstoqueService();

export const MovimentoEstoqueController = {
  list: async (_req: Request, res: Response) => {
    const data = await service.list();
    res.json(data);
  },

  listByProduto: async (req: Request, res: Response) => {
    const data = await service.listByProduto(req.params.produtoId);
    res.json(data);
  },

  create: async (req: Request, res: Response) => {
    try {
      const created = await service.create(req.body);
      res.status(201).json(created);
    } catch (e: any) {
      // Zod error
      if (e?.issues) {
        return res.status(400).json({ error: "Validação", details: e.issues });
      }
      // Produto não encontrado
      if (e?.code === "P2025" || e?.message === "PRODUTO_NAO_ENCONTRADO") {
        return res.status(404).json({ error: "Produto não encontrado" });
      }
      // Estoque insuficiente
      if (e?.message === "ESTOQUE_INSUFICIENTE") {
        return res.status(400).json({ error: "Estoque insuficiente" });
      }
      return res.status(400).json({ error: e?.message || "Erro ao criar movimento" });
    }
  },
};