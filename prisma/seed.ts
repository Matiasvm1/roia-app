import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Estados de Producción (escalables) ─────────────────────
  const statuses = [
    { name: "En Espera", orderIndex: 1, colorHex: "#F59E0B" },      // Amarillo
    { name: "En Producción", orderIndex: 2, colorHex: "#3B82F6" },   // Azul
    { name: "Finalizado", orderIndex: 3, colorHex: "#10B981" },      // Verde
    { name: "Entregado", orderIndex: 4, colorHex: "#6B7280" },       // Gris
    { name: "Cancelado", orderIndex: 5, colorHex: "#EF4444" },       // Rojo
  ];

  for (const status of statuses) {
    await prisma.productionStatus.upsert({
      where: { name: status.name },
      update: {},
      create: status,
    });
  }

  console.log(`✅ ${statuses.length} estados de producción creados`);

  // ─── NOTA: El perfil admin se crea con scripts/seed-admin.ts ──
  // Ya no se puede crear aquí porque requiere authUserId de Supabase Auth.

  // ─── Artículos de ejemplo ───────────────────────────────────
  const articles = [
    { name: "Remera Básica", basePrice: 5500, category: "Remeras" },
    { name: "Pantalón Cargo", basePrice: 12000, category: "Pantalones" },
    { name: "Campera Rompeviento", basePrice: 18000, category: "Camperas" },
    { name: "Buzo Oversize", basePrice: 14000, category: "Buzos" },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { id: article.name }, // fallback, will create
      update: {},
      create: article,
    });
  }

  console.log(`✅ ${articles.length} artículos de ejemplo creados`);

  console.log("🎉 Seed completado!");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
