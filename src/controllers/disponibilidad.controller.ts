import type { Request, Response } from "express";
import { prisma } from "../config/prisma";

// Helper: clave local "YYYY-MM-DDTHH:MM"
const toLocalKey = (d: Date): string => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
};

export const getDisponibilidad = async (req: Request, res: Response) => {
  try {
    // Rango de fechas 
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const defaultHasta = new Date(hoy);
    defaultHasta.setDate(defaultHasta.getDate() + 14);
    defaultHasta.setHours(23, 59, 59, 999);

    const { desde, hasta } = req.query;

    const start = desde
      ? new Date(String(desde) + "T00:00:00")
      : hoy;

    const end = hasta
      ? new Date(String(hasta) + "T23:59:59")
      : defaultHasta;

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Parámetros de fecha inválidos" });
    }

    if (end < start) {
      return res.status(400).json({ message: "El rango de fechas es inválido" });
    }

    // 2) Traer citas en ese rango de fechas
    const citas = await prisma.citas.findMany({
      where: {
        fecha_hora: {
          gte: start,
          lte: end,
        },
      },
      select: {
        fecha_hora: true,
      },
    });

    // Claves ocupadas en horario local
    const ocupados = new Set(
      citas.map((c: any) => toLocalKey(c.fecha_hora))
    );

    // 3) Generar slots posibles (lun–vie, 08–12 y 14–18 cada 30 min)
    const slots: { fechaHora: string }[] = [];

    const cursor = new Date(start);
    cursor.setHours(0, 0, 0, 0);

    while (cursor <= end) {
      const diaSemana = cursor.getDay(); 

      
      if (diaSemana >= 1 && diaSemana <= 5) {
        const bloques = [
          { desde: 8, hasta: 12 },  
          { desde: 14, hasta: 18 }, 
        ];

        for (const bloque of bloques) {
          for (let h = bloque.desde; h < bloque.hasta; h++) {
            for (const min of [0, 30]) {
              const slotDate = new Date(
                cursor.getFullYear(),
                cursor.getMonth(),
                cursor.getDate(),
                h,
                min,
                0,
                0
              );

              const key = toLocalKey(slotDate);

              // si ya hay cita en ese horario, NO se ofrece
              if (!ocupados.has(key)) {
                slots.push({ fechaHora: slotDate.toISOString() });
              }
            }
          }
        }
      }

      // siguiente día
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(0, 0, 0, 0);
    }

    return res.json({ slots });
  } catch (error) {
    console.error("Error al obtener disponibilidad:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};