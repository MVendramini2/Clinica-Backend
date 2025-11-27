import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  crearCita,
  obtenerCitas,
  confirmarCita,
  eliminarCita
} from "../controllers/citas.controller";

const router = Router();

// Crear cita 
router.post("/", crearCita);

// PROTEGER TODO 
router.use(authMiddleware);

// Listar citas 
router.get("/", obtenerCitas);

// Confirmar cita
router.patch("/:id/confirmar", confirmarCita);

// Eliminar cita
router.delete("/:id", eliminarCita);

export default router;