"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ─── LOGIN ───────────────────────────────────────────────────

export async function login(formData: FormData) {
  const username = (formData.get("username") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Usuario y contraseña son requeridos" };
  }

  let profile;
  try {
    // Look up profile by username to get the email for Supabase Auth
    profile = await prisma.profile.findUnique({
      where: { username },
    });
  } catch (err) {
    console.error("[login] Database error:", err);
    return { error: "Error de conexión con la base de datos. Intentá de nuevo." };
  }

  if (!profile) {
    return { error: "Usuario o contraseña incorrectos" };
  }

  if (!profile.isActive) {
    return { error: "Tu cuenta está desactivada. Contactá al administrador." };
  }

  // Sign in with Supabase using the email linked to this username
  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password,
  });

  if (error) {
    console.error("[login] Supabase auth error:", error.message);
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Usuario o contraseña incorrectos" };
    }
    return { error: error.message };
  }

  revalidatePath("/", "layout");

  if (profile.role === "employee") {
    redirect("/orders");
  }

  redirect("/dashboard");
}

// ─── LOGOUT ──────────────────────────────────────────────────

export async function logout() {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth/login");
}

// ─── REGISTER USER (Admin only) ─────────────────────────────

export async function registerUser(formData: FormData) {
  const username = (formData.get("username") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const role = (formData.get("role") as string) || "employee";

  if (!username || !password || !fullName) {
    return { error: "Todos los campos son requeridos" };
  }

  // Validate username format (alphanumeric, dots, underscores)
  if (!/^[a-z0-9._]+$/.test(username)) {
    return { error: "El usuario solo puede contener letras minúsculas, números, puntos y guiones bajos" };
  }

  if (username.length < 3) {
    return { error: "El usuario debe tener al menos 3 caracteres" };
  }

  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres" };
  }

  if (!["admin", "employee"].includes(role)) {
    return { error: "Rol inválido" };
  }

  // Check username availability
  const existing = await prisma.profile.findUnique({ where: { username } });
  if (existing) {
    return { error: "Ese nombre de usuario ya está en uso" };
  }

  // Generate internal email for Supabase Auth
  const email = `${username}@roia.app`;

  // Use service role to create user (bypasses email confirmation)
  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  const adminClient = getSupabaseAdmin();

  const { data: authData, error: authError } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError) {
    if (authError.message.includes("already been registered")) {
      return { error: "Error al crear el usuario. Intentá con otro nombre." };
    }
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "Error al crear el usuario" };
  }

  // Create profile in our DB
  await prisma.profile.create({
    data: {
      authUserId: authData.user.id,
      username,
      email,
      fullName,
      role,
    },
  });

  revalidatePath("/team");
  return { success: true };
}

// ─── UPDATE USER (Admin only) ────────────────────────────────

export async function updateUser(formData: FormData) {
  const profileId = formData.get("profileId") as string;
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as string;
  const isActive = formData.get("isActive") === "true";

  if (!profileId || !fullName || !role) {
    return { error: "Campos requeridos faltantes" };
  }

  await prisma.profile.update({
    where: { id: profileId },
    data: { fullName, role, isActive },
  });

  revalidatePath("/team");
  return { success: true };
}

// ─── RESET PASSWORD (Admin only) ────────────────────────────

export async function resetUserPassword(formData: FormData) {
  const authUserId = formData.get("authUserId") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!authUserId || !newPassword) {
    return { error: "Campos requeridos faltantes" };
  }

  if (newPassword.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres" };
  }

  const { getSupabaseAdmin } = await import("@/lib/supabase-admin");
  const adminClient = getSupabaseAdmin();

  const { error } = await adminClient.auth.admin.updateUserById(authUserId, {
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
