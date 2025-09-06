import { Request, Response } from "express";
import { ProdutoService } from "../service/ProdutoService";

const service = new ProdutoService();

export const ProdutoController = {
  list: async (_req: Request, res: Response) => {
    const data = await service.list();
    res.json(data);
  },

  get: async (req: Request, res: Response) => {
    const item = await service.get(req.params.id);
    if (!item) return res.status(404).json({ error: "Produto não encontrado" });
    res.json(item);
  },

  create: async (req: Request, res: Response) => {
    try {
      const created = await service.create(req.body);
      res.status(201).json(created);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const updated = await service.update(req.params.id, req.body);
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },

  remove: async (req: Request, res: Response) => {
    await service.remove(req.params.id);
    res.status(204).send();
  },
};
