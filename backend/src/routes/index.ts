import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "mini-erp-backend", ts: new Date().toISOString() });
});

export default router;
