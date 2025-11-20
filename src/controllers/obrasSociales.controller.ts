import { Request, Response } from "express";
import { prisma } from "../config/prisma";


export const getObrasSociales = async (req: Request, res: Response) => {
  try {
    const obras = await prisma.obras_sociales.findMany({
      where: { activa: true },
      orderBy: { nombre: "asc" },
    });

    return res.json(obras);
  } catch (error) {
    console.error("Error al obtener obras sociales:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const createObraSocial = async (req: Request, res: Response) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    
    const existente = await prisma.obras_sociales.findUnique({
      where: { nombre },
    });

    if (existente) {
      
      if (!existente.activa) {
        const reactivada = await prisma.obras_sociales.update({
          where: { id: existente.id },
          data: { activa: true },
        });

        return res
          .status(200)
          .json(reactivada); 
      }

      
      return res
        .status(400)
        .json({ message: "Ya existe una obra social con ese nombre" });
    }

    
    const obra = await prisma.obras_sociales.create({
      data: { nombre, activa: true },
    });

    return res.status(201).json(obra);
  } catch (error) {
    console.error("Error al crear obra social:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updateObraSocial = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nombre } = req.body;

    const obra = await prisma.obras_sociales.update({
      where: { id },
      data: { nombre },
    });

    return res.json(obra);
  } catch (error) {
    console.error("Error al actualizar obra social:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const deleteObraSocial = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const obra = await prisma.obras_sociales.update({
      where: { id },
      data: { activa: false },
    });

    return res.json({
      message: "Obra social desactivada correctamente",
      obra,
    });
  } catch (error) {
    console.error("Error al eliminar obra social:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};