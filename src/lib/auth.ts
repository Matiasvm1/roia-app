import { createSupabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export type UserRole = "admin" | "employee";

export interface SessionUser {
  id: string; // Profile id
  authUserId: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl: string | null;
}

/**
 * Get the current authenticated user with their profile.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await prisma.profile.findUnique({
    where: { authUserId: user.id },
  });

  if (!profile || !profile.isActive) return null;

  return {
    id: profile.id,
    authUserId: profile.authUserId,
    username: profile.username,
    email: profile.email,
    fullName: profile.fullName,
    role: profile.role as UserRole,
    avatarUrl: profile.avatarUrl,
  };
}

/**
 * Require authentication. Redirects to login if not authenticated.
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  return user;
}

/**
 * Require admin role. Redirects to orders (employee home) if not admin.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.role !== "admin") redirect("/orders");
  return user;
}
