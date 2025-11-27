import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "supersecreto";

export const login = async (req: Request, res: Response) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ message: "Usuario y contraseña son obligatorios" });
    }

    // Busca el usuario en la tabla usuarios_admin
    const user = await prisma.usuarios_admin.findFirst({
      where: { usuario },
    });

    if (!user) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    // Compara la contraseña ingresada con el hash guardado
    const passwordOk = await bcrypt.compare(password, user.password_hash);

    if (!passwordOk) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    // Genera token JWT
    const token = jwt.sign(
      {
        id: user.id,
        usuario: user.usuario,
        rol: user.rol,
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      token,
      usuario: user.usuario,
      rol: user.rol,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error interno en el servidor" });
  }
};