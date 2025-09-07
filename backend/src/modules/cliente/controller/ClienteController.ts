import { Request, Response } from "express";
import { ClienteService } from "../service/ClienteService";

const service = new ClienteService();

export const ClienteController = {
  list: async (_req: Request, res: Response) => {
    const data = await service.list();
    res.json(data);
  },

  get: async (req: Request, res: Response) => {
    const item = await service.get(req.params.id);
    if (!item) return res.status(404).json({ error: "Cliente não encontrado" });
    res.json(item);
  },

  create: async (req: Request, res: Response) => {
    try {
      const created = await service.create(req.body);
      res.status(201).json(created);
    } catch (e: any) {
      if (e?.issues) return res.status(400).json({ error: "Validação", details: e.issues });
      if (e?.code === "P2002") return res.status(409).json({ error: "Email ou CPF já cadastrado" });
      res.status(400).json({ error: e?.message || "Erro ao criar cliente" });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const updated = await service.update(req.params.id, req.body);
      res.json(updated);
    } catch (e: any) {
      if (e?.issues) return res.status(400).json({ error: "Validação", details: e.issues });
      if (e?.code === "P2025") return res.status(404).json({ error: "Cliente não encontrado" });
      if (e?.code === "P2002") return res.status(409).json({ error: "Email ou CPF já cadastrado" });
      res.status(400).json({ error: e?.message || "Erro ao atualizar cliente" });
    }
  },

  remove: async (req: Request, res: Response) => {
    try {
      await service.remove(req.params.id);
      res.status(204).send();
    } catch (e: any) {
      if (e?.code === "P2025") return res.status(404).json({ error: "Cliente não encontrado" });
      if (e?.code === "P2003") return res.status(400).json({ error: "Há compras vinculadas a este cliente" });
      res.status(400).json({ error: e?.message || "Erro ao remover cliente" });
    }
  },
};
