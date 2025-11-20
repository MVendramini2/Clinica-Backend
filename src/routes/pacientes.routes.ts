import { Router } from "express";
import { crearPaciente } from "../controllers/pacientes.controller";

const router = Router();

router.post("/", crearPaciente);

export default router;