import { Router } from "express";
import { getDisponibilidad } from "../controllers/disponibilidad.controller";

const router = Router();


router.get("/", getDisponibilidad);

export default router;