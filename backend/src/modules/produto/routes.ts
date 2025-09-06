import { Router } from "express";
import { ProdutoController } from "./controller/ProdutoController";

const router = Router();

router.get("/", ProdutoController.list);
router.get("/:id", ProdutoController.get);
router.post("/", ProdutoController.create);
router.put("/:id", ProdutoController.update);
router.delete("/:id", ProdutoController.remove);

export default router;
