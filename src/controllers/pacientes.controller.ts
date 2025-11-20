import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const crearPaciente = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, email, telefono, obraSocialId } = req.body;

    if (!nombre || !apellido || !email || !telefono || !obraSocialId) {
      return res.status(400).json({ message: "Datos de paciente incompletos" });
    }

    const paciente = await prisma.pacientes.create({
      data: {
        nombre,
        apellido,
        email,
        telefono,
        obra_social_id: obraSocialId,
      },
    });

    return res.status(201).json(paciente);
  } catch (error) {
    console.error("Error al crear paciente:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};