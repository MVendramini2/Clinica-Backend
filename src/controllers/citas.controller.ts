import type { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { sendEmailCita } from "../services/email.services"; 

// Crear cita
export const crearCita = async (req: Request, res: Response) => {
  try {
    const { pacienteId, fechaHora } = req.body;

    if (!pacienteId || !fechaHora) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    
    const paciente = await prisma.pacientes.findUnique({
      where: { id: Number(pacienteId) },
    });

    if (!paciente) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    const nuevaCita = await prisma.citas.create({
      data: {
        paciente_id: paciente.id,
        obra_social_id: paciente.obra_social_id,
        fecha_hora: new Date(fechaHora),
        estado: "SOLICITADA",
      },
    });

    
    if (paciente.email) {
      void sendEmailCita(paciente.email, 'creada', {
        fecha: nuevaCita.fecha_hora,
        nombrePaciente: paciente.nombre 
      });
    }

    return res.status(201).json(nuevaCita);
  } catch (error) {
    console.error("Error al crear cita:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Listado de Citas 
export const obtenerCitas = async (_req: Request, res: Response) => {
  try {
    const citas = await prisma.citas.findMany({
      orderBy: { fecha_hora: "asc" },
      include: {
        pacientes: true,
        obras_sociales: true
      }
    });

    const citasFormateadas = citas.map((cita: any) => ({
      id: cita.id,
      paciente: `${cita.pacientes.nombre} ${cita.pacientes.apellido}`,
      email: cita.pacientes.email,
      telefono: cita.pacientes.telefono,
      fechaISO: cita.fecha_hora.toISOString(),
      obraSocial: cita.obras_sociales.nombre,
      estado: cita.estado
    }));

    return res.json(citasFormateadas);
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Confirmar cita 
export const confirmarCita = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const citaActualizada = await prisma.citas.update({
      where: { id },
      data: {
        estado: "CONFIRMADA",
        fecha_confirmacion: new Date()
      }
    });

    return res.json(citaActualizada);
  } catch (error) {
    console.error("Error al confirmar cita:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Eliminar cita
export const eliminarCita = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    
    const cita = await prisma.citas.findUnique({
      where: { id: Number(id) },
      include: { pacientes: true } 
    });

    if (!cita) {
      return res.status(404).json({ message: "La cita no existe" });
    }

    await prisma.citas.delete({
      where: { id: Number(id) },
    });


    if (cita.pacientes && cita.pacientes.email) {
      void sendEmailCita(cita.pacientes.email, 'eliminada', {
        fecha: cita.fecha_hora,
        nombrePaciente: cita.pacientes.nombre
      });
    }

    return res.json({ message: "Cita eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar cita:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};