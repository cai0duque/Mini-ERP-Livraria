import { Router } from "express";
import produtosRouter from "../modules/produto/routes";
import movimentosRouter from "../modules/movimentoEstoque/routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "mini-erp-backend", ts: new Date().toISOString() });
});

router.use("/produtos", produtosRouter);
router.use("/movimentos", movimentosRouter);

export default router;