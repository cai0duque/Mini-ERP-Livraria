import { Router } from "express";
import produtosRouter from "../modules/produto/routes";
import movimentosRouter from "../modules/movimentoEstoque/routes";
import clientesRouter from "../modules/cliente/routes";
import funcionariosRouter from "../modules/funcionario/routes";
import comprasRouter from "../modules/compra/routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "mini-erp-backend", ts: new Date().toISOString() });
});

router.use("/produtos", produtosRouter);
router.use("/movimentos", movimentosRouter);
router.use("/clientes", clientesRouter);
router.use("/funcionarios", funcionariosRouter);
router.use("/compras", comprasRouter);

export default router;
