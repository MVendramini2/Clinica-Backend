import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getObrasSociales,
  createObraSocial,
  updateObraSocial,
  deleteObraSocial
} from "../controllers/obrasSociales.controller";

const router = Router();

// GET público — para el formulario del paciente
router.get("/", getObrasSociales);

// Rutas protegidas — para el panel admin
router.post("/", authMiddleware, createObraSocial);
router.put("/:id", authMiddleware, updateObraSocial);
router.delete("/:id", authMiddleware, deleteObraSocial);

export default router;