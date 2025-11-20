import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecreto";

interface JwtPayload {
  id: number;
  usuario: string;
  rol?: string;
  iat: number;
  exp: number;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Formato de token inválido" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Podés guardar info del usuario en req para usar en controladores
    (req as any).user = {
      id: decoded.id,
      usuario: decoded.usuario,
      rol: decoded.rol,
    };

    next();
  } catch (error) {
    console.error("Error en authMiddleware:", error);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};