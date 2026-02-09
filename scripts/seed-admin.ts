/**
 * Seed script: Crea/actualiza el usuario Admin en Supabase Auth + Profile.
 *
 * Uso:
 *   npx tsx scripts/seed-admin.ts
 *
 * Prerequisitos:
 *   - Variables de entorno configuradas en .env:
 *     NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const databaseUrl = process.env.DATABASE_URL!;

if (!supabaseUrl || !serviceRoleKey || !databaseUrl) {
  console.error("❌ Faltan variables de entorno. Revisá tu .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

// ─── Configuración del admin ──────────────────────────────────
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";
const ADMIN_NAME = "Administrador";
const ADMIN_EMAIL = `${ADMIN_USERNAME}@roia.app`;

async function main() {
  console.log("🔧 Configurando usuario admin...\n");

  // 1. Check if profile already exists with this username
  const existing = await prisma.profile.findFirst({
    where: { username: ADMIN_USERNAME },
  });

  if (existing) {
    console.log(`✅ Ya existe un perfil con usuario "${ADMIN_USERNAME}"`);
    console.log(`   ID: ${existing.id}`);
    console.log(`   Rol: ${existing.role}`);

    // Update the Supabase Auth email if it's the old format
    if (existing.email !== ADMIN_EMAIL) {
      console.log(`\n   Actualizando email en Supabase Auth...`);
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existing.authUserId,
        { email: ADMIN_EMAIL, email_confirm: true }
      );
      if (updateError) {
        console.log(`   ⚠️  No se pudo actualizar email: ${updateError.message}`);
      } else {
        await prisma.profile.update({
          where: { id: existing.id },
          data: { email: ADMIN_EMAIL },
        });
        console.log(`   ✅ Email actualizado a ${ADMIN_EMAIL}`);
      }
    }

    // Reset password to make sure it works
    console.log(`\n   Reseteando contraseña...`);
    const { error: pwError } = await supabase.auth.admin.updateUserById(
      existing.authUserId,
      { password: ADMIN_PASSWORD }
    );
    if (pwError) {
      console.log(`   ⚠️  No se pudo resetear: ${pwError.message}`);
    } else {
      console.log(`   ✅ Contraseña reseteada`);
    }

    console.log(`\n   👤 Usuario:     ${ADMIN_USERNAME}`);
    console.log(`   🔑 Contraseña:  ${ADMIN_PASSWORD}`);
    await prisma.$disconnect();
    process.exit(0);
  }

  // 2. Clean up any old admin profiles with different email format
  const oldAdmin = await prisma.profile.findFirst({
    where: { role: "admin" },
  });

  if (oldAdmin) {
    console.log(`   Limpiando perfil admin anterior (${oldAdmin.email})...`);
    try {
      await supabase.auth.admin.deleteUser(oldAdmin.authUserId);
      console.log("   ✅ Usuario auth anterior eliminado");
    } catch {
      console.log("   ⚠️  No se pudo eliminar usuario auth anterior");
    }
    await prisma.profile.delete({ where: { id: oldAdmin.id } });
    console.log("   ✅ Perfil anterior eliminado\n");
  }

  // 3. Create Supabase Auth user
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });

  if (authError) {
    if (authError.message.includes("already been registered")) {
      console.log("⚠️  El email ya existe en Supabase Auth. Buscando...");

      const { data: listData } = await supabase.auth.admin.listUsers();
      const authUser = listData?.users.find((u) => u.email === ADMIN_EMAIL);

      if (!authUser) {
        console.error("❌ No se pudo encontrar el usuario en Auth");
        process.exit(1);
      }

      await supabase.auth.admin.updateUserById(authUser.id, {
        password: ADMIN_PASSWORD,
      });

      await prisma.profile.create({
        data: {
          authUserId: authUser.id,
          username: ADMIN_USERNAME,
          email: ADMIN_EMAIL,
          fullName: ADMIN_NAME,
          role: "admin",
        },
      });

      console.log("✅ Perfil admin creado (usuario auth ya existía)");
    } else {
      console.error("❌ Error creando usuario:", authError.message);
      process.exit(1);
    }
  } else if (authData.user) {
    await prisma.profile.create({
      data: {
        authUserId: authData.user.id,
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        fullName: ADMIN_NAME,
        role: "admin",
      },
    });

    console.log("✅ Usuario admin creado exitosamente!\n");
  }

  console.log(`   👤 Usuario:     ${ADMIN_USERNAME}`);
  console.log(`   🔑 Contraseña:  ${ADMIN_PASSWORD}`);
  console.log(`   🏷️  Rol:         admin`);
  console.log(`\n   ⚠️  Cambiá la contraseña después del primer login.`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
