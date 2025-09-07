import { Router } from "express";
import { ClienteController } from "./controller/ClienteController";

const router = Router();

router.get("/", ClienteController.list);
router.get("/:id", ClienteController.get);
router.post("/", ClienteController.create);
router.put("/:id", ClienteController.update);
router.delete("/:id", ClienteController.remove);

export default router;
