import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  crearCita,
  obtenerCitas,
  confirmarCita,
  eliminarCita
} from "../controllers/citas.controller";

const router = Router();

// Crear cita (público)
// 👉 la ruta correcta es "/"
router.post("/", crearCita);

// PROTEGER TODO LO DEMÁS
router.use(authMiddleware);

// Listar citas (panel admin)
router.get("/", obtenerCitas);

// Confirmar cita
router.patch("/:id/confirmar", confirmarCita);

// Eliminar cita
router.delete("/:id", eliminarCita);

export default router;