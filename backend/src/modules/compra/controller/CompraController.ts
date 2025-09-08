import { Request, Response } from "express";
import { CompraService } from "../service/CompraService";

const service = new CompraService();

export const CompraController = {
  list: async (_req: Request, res: Response) => {
    const data = await service.list();
    res.json(data);
  },

  get: async (req: Request, res: Response) => {
    const item = await service.get(req.params.id);
    if (!item) return res.status(404).json({ error: "Compra não encontrada" });
    res.json(item);
  },

  create: async (req: Request, res: Response) => {
    try {
      const created = await service.create(req.body);
      res.status(201).json(created);
    } catch (e: any) {
      if (e?.issues) return res.status(400).json({ error: "Validação", details: e.issues });
      if (e?.code === "P2025") {
        // funcionário/cliente/produto inexistente
        return res.status(404).json({ error: e.message || "Relacionado não encontrado" });
      }
      if (e?.message?.startsWith?.("ESTOQUE_INSUFICIENTE")) {
        return res.status(400).json({ error: "Estoque insuficiente para um dos itens" });
      }
      return res.status(400).json({ error: e?.message || "Erro ao criar compra" });
    }
  },
};