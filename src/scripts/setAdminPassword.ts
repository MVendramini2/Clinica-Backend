import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";

dotenv.config();

async function main() {
  const plainPassword = "admin123"; // la que quieras usar
  const hash = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.usuarios_admin.update({
    where: { usuario: "admin" },
    data: { password_hash: hash },
  });

  console.log("Password actualizada para:", user.usuario);
}

main()
  .then(() => {
    console.log("Listo");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
