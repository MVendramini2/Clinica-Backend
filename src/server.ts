import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import { authMiddleware } from "./middlewares/auth.middleware";
import obrasSocialesRoutes from "./routes/obrasSociales.routes";
import citasRoutes from "./routes/citas.routes";
import disponibilidadRoutes from "./routes/disponibilidad.routes";
import pacientesRoutes from "./routes/pacientes.routes";



dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/obras-sociales", obrasSocialesRoutes);
app.use("/api/citas", citasRoutes);
app.use("/api/disponibilidad", disponibilidadRoutes);
app.use("/api/pacientes", pacientesRoutes);


app.get("/", (req, res) => {
  res.send("API Clínica funcionando correctamente");
});

app.get("/api/admin/me", authMiddleware, (req, res) => {
  const user = (req as any).user;
  return res.json({
    message: "Acceso permitido al área administrativa",
    user,
  });
});


app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});