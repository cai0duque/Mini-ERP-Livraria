import { Router } from "express";
import { FuncionarioController } from "./controller/FuncionarioController";

const router = Router();

router.get("/", FuncionarioController.list);
router.get("/:id", FuncionarioController.get);
router.post("/", FuncionarioController.create);
router.put("/:id", FuncionarioController.update);
router.delete("/:id", FuncionarioController.remove);

export default router;
