import { Router } from "express";
import { MovimentoEstoqueController } from "./controller/MovimentoEstoqueController";

const router = Router();

router.get("/", MovimentoEstoqueController.list);
router.get("/produto/:produtoId", MovimentoEstoqueController.listByProduto);
router.post("/", MovimentoEstoqueController.create);

export default router;