import { createClient } from "@supabase/supabase-js";

/**
 * Sanitize env var: remove ALL invisible/whitespace/BOM/zero-width chars.
 */
function cleanKey(raw: string | undefined): string {
  if (!raw) return "";
  // Remove BOM, zero-width spaces, all whitespace, carriage returns, quotes
  return raw
    .replace(/[\s\r\n\t\u200B\u200C\u200D\uFEFF\u00A0]/g, "")
    .replace(/^["']|["']$/g, "");
}

/**
 * Supabase client with service role key — server-side only.
 * Bypasses RLS. Used for admin operations (user management, storage).
 */
export function getSupabaseAdmin() {
  const supabaseUrl = cleanKey(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = cleanKey(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

export const DESIGNS_BUCKET = "designs";

/**
 * Upload a file to Supabase Storage using the REST API directly.
 */
export async function storageUpload(
  bucket: string,
  path: string,
  body: Uint8Array,
  contentType: string
): Promise<{ error: string | null }> {
  const supabaseUrl = cleanKey(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = cleanKey(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!supabaseUrl || !serviceRoleKey) {
    return { error: "Supabase env vars not set" };
  }

  const url = `${supabaseUrl}/storage/v1/object/${bucket}/${path}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      "Content-Type": contentType,
      "x-upsert": "false",
    },
    body: body as unknown as BodyInit,
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.error("[storageUpload] error:", res.status, errBody);
    return { error: `Storage error ${res.status}: ${errBody}` };
  }

  return { error: null };
}

/**
 * Delete files from Supabase Storage using the REST API directly.
 */
export async function storageDelete(
  bucket: string,
  paths: string[]
): Promise<void> {
  const supabaseUrl = cleanKey(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = cleanKey(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!supabaseUrl || !serviceRoleKey) return;

  const url = `${supabaseUrl}/storage/v1/object/${bucket}`;

  await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefixes: paths }),
  });
}

/**
 * Get public URL for a file in Supabase Storage.
 */
export function storagePublicUrl(bucket: string, path: string): string {
  const supabaseUrl = cleanKey(process.env.NEXT_PUBLIC_SUPABASE_URL);
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}
