import { Router } from "express";
import { CompraController } from "./controller/CompraController";

const router = Router();

router.get("/", CompraController.list);
router.get("/:id", CompraController.get);
router.post("/", CompraController.create);

export default router;