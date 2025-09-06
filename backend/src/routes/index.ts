import { Router } from "express";
import produtosRouter from "../modules/produto/routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "mini-erp-backend", ts: new Date().toISOString() });
});

router.use("/produtos", produtosRouter);

export default router;
