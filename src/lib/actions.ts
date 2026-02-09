"use server";

import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin, DESIGNS_BUCKET, storageUpload, storageDelete, storagePublicUrl } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ═══════════════════════════════════════════════════════════════
// CLIENTES
// ═══════════════════════════════════════════════════════════════

const clientSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export async function createClient(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = clientSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = parsed.data;
  await prisma.client.create({
    data: {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address || null,
      city: data.city || null,
      notes: data.notes || null,
    },
  });

  revalidatePath("/clients");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateClient(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return { error: { id: ["ID requerido"] } };

  const raw = Object.fromEntries(formData.entries());
  const parsed = clientSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = parsed.data;
  await prisma.client.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address || null,
      city: data.city || null,
      notes: data.notes || null,
    },
  });

  revalidatePath("/clients");
  revalidatePath("/orders");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleClientActive(id: string) {
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) return { error: "Cliente no encontrado" };

  await prisma.client.update({
    where: { id },
    data: { isActive: !client.isActive },
  });

  revalidatePath("/clients");
  revalidatePath("/dashboard");
  return { success: true };
}

// ═══════════════════════════════════════════════════════════════
// ARTÍCULOS
// ═══════════════════════════════════════════════════════════════

const articleSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  basePrice: z.string().min(1, "El precio es obligatorio"),
  category: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

export async function createArticle(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = articleSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = parsed.data;
  const price = parseFloat(data.basePrice);
  if (isNaN(price) || price < 0) {
    return { error: { basePrice: ["El precio debe ser un número válido"] } };
  }

  await prisma.article.create({
    data: {
      name: data.name,
      basePrice: price,
      category: data.category || null,
      description: data.description || null,
    },
  });

  revalidatePath("/articles");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateArticle(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return { error: { id: ["ID requerido"] } };

  const raw = Object.fromEntries(formData.entries());
  const parsed = articleSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = parsed.data;
  const price = parseFloat(data.basePrice);
  if (isNaN(price) || price < 0) {
    return { error: { basePrice: ["El precio debe ser un número válido"] } };
  }

  await prisma.article.update({
    where: { id },
    data: {
      name: data.name,
      basePrice: price,
      category: data.category || null,
      description: data.description || null,
    },
  });

  revalidatePath("/articles");
  revalidatePath("/orders");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleArticleActive(id: string) {
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return { error: "Artículo no encontrado" };

  await prisma.article.update({
    where: { id },
    data: { isActive: !article.isActive },
  });

  revalidatePath("/articles");
  revalidatePath("/dashboard");
  return { success: true };
}

// ═══════════════════════════════════════════════════════════════
// COMPRAS
// ═══════════════════════════════════════════════════════════════

const purchaseSchema = z.object({
  supplier: z.string().min(1, "El proveedor es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  amount: z.string().min(1, "El monto es obligatorio"),
  category: z.string().optional().or(z.literal("")),
  date: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export async function createPurchase(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = purchaseSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = parsed.data;
  const amount = parseFloat(data.amount);
  if (isNaN(amount) || amount < 0) {
    return { error: { amount: ["El monto debe ser un número válido"] } };
  }

  await prisma.purchase.create({
    data: {
      supplier: data.supplier,
      description: data.description,
      amount,
      category: data.category || null,
      date: data.date ? new Date(data.date) : new Date(),
      notes: data.notes || null,
    },
  });

  revalidatePath("/purchases");
  revalidatePath("/finances");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updatePurchase(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return { error: { id: ["ID requerido"] } };

  const raw = Object.fromEntries(formData.entries());
  const parsed = purchaseSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = parsed.data;
  const amount = parseFloat(data.amount);
  if (isNaN(amount) || amount < 0) {
    return { error: { amount: ["El monto debe ser un número válido"] } };
  }

  await prisma.purchase.update({
    where: { id },
    data: {
      supplier: data.supplier,
      description: data.description,
      amount,
      category: data.category || null,
      date: data.date ? new Date(data.date) : new Date(),
      notes: data.notes || null,
    },
  });

  revalidatePath("/purchases");
  revalidatePath("/finances");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deletePurchase(id: string) {
  await prisma.purchase.delete({ where: { id } });
  revalidatePath("/purchases");
  revalidatePath("/finances");
  revalidatePath("/dashboard");
  return { success: true };
}

// ═══════════════════════════════════════════════════════════════
// GASTOS
// ═══════════════════════════════════════════════════════════════

const expenseSchema = z.object({
  description: z.string().min(1, "La descripción es obligatoria"),
  amount: z.string().min(1, "El monto es obligatorio"),
  category: z.string().optional().or(z.literal("")),
  date: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

export async function createExpense(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = expenseSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = parsed.data;
  const amount = parseFloat(data.amount);
  if (isNaN(amount) || amount < 0) {
    return { error: { amount: ["El monto debe ser un número válido"] } };
  }

  await prisma.expense.create({
    data: {
      description: data.description,
      amount,
      category: data.category || null,
      date: data.date ? new Date(data.date) : new Date(),
      notes: data.notes || null,
    },
  });

  revalidatePath("/expenses");
  revalidatePath("/finances");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateExpense(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return { error: { id: ["ID requerido"] } };

  const raw = Object.fromEntries(formData.entries());
  const parsed = expenseSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = parsed.data;
  const amount = parseFloat(data.amount);
  if (isNaN(amount) || amount < 0) {
    return { error: { amount: ["El monto debe ser un número válido"] } };
  }

  await prisma.expense.update({
    where: { id },
    data: {
      description: data.description,
      amount,
      category: data.category || null,
      date: data.date ? new Date(data.date) : new Date(),
      notes: data.notes || null,
    },
  });

  revalidatePath("/expenses");
  revalidatePath("/finances");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteExpense(id: string) {
  await prisma.expense.delete({ where: { id } });
  revalidatePath("/expenses");
  revalidatePath("/finances");
  revalidatePath("/dashboard");
  return { success: true };
}

// ═══════════════════════════════════════════════════════════════
// ÓRDENES DE PRODUCCIÓN
// ═══════════════════════════════════════════════════════════════

const orderSchema = z.object({
  clientId: z.string().min(1, "Seleccioná un cliente"),
  statusId: z.string().min(1, "Seleccioná un estado"),
  deliveryDate: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  items: z.string().min(1, "Agregá al menos un artículo"),
});

export async function createOrder(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = orderSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const data = parsed.data;

  let items: { articleId: string; quantity: number; unitPrice: number; size?: string; color?: string }[];
  try {
    items = JSON.parse(data.items);
  } catch {
    return { error: { items: ["Error al procesar los artículos"] } };
  }

  if (items.length === 0) {
    return { error: { items: ["Agregá al menos un artículo"] } };
  }

  const totalPrice = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  await prisma.order.create({
    data: {
      clientId: data.clientId,
      statusId: data.statusId,
      totalPrice,
      deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
      notes: data.notes || null,
      items: {
        create: items.map((item) => ({
          articleId: item.articleId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          size: item.size || null,
          color: item.color || null,
        })),
      },
    },
  });

  revalidatePath("/orders");
  revalidatePath("/finances");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateOrder(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  if (!orderId) return { error: { orderId: ["ID de orden requerido"] } };

  const statusId = formData.get("statusId") as string;
  const deliveryDate = formData.get("deliveryDate") as string;
  const notes = formData.get("notes") as string;

  await prisma.order.update({
    where: { id: orderId },
    data: {
      ...(statusId && { statusId }),
      deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
      notes: notes || null,
    },
  });

  revalidatePath("/orders");
  revalidatePath("/dashboard");
  revalidatePath("/finances");
  return { success: true };
}

export async function deleteOrder(id: string) {
  // Primero borrar las imágenes del Storage
  const images = await prisma.orderImage.findMany({ where: { orderId: id } });
  if (images.length > 0) {
    try {
      await storageDelete(DESIGNS_BUCKET, images.map((img) => img.storagePath));
    } catch {
      // Si falla el borrado de Storage, igual borramos de DB
    }
  }

  await prisma.order.delete({ where: { id } });
  revalidatePath("/orders");
  revalidatePath("/dashboard");
  revalidatePath("/finances");
  return { success: true };
}

// ═══════════════════════════════════════════════════════════════
// IMÁGENES DE DISEÑO
// ═══════════════════════════════════════════════════════════════

export async function uploadOrderImage(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const file = formData.get("file") as File;

  if (!orderId) return { error: "ID de orden requerido" };
  if (!file || file.size === 0) return { error: "Seleccioná una imagen" };

  // Validar tipo
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!validTypes.includes(file.type)) {
    return { error: "Formato no soportado. Usá JPG, PNG, WebP o GIF." };
  }

  // Validar tamaño (10MB)
  if (file.size > 10 * 1024 * 1024) {
    return { error: "La imagen no puede superar los 10MB." };
  }

  try {
    // Generar path único: orders/{orderId}/{timestamp}-{filename}
    const safeName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .substring(0, 50);
    const storagePath = `orders/${orderId}/${Date.now()}-${safeName}`;

    // Convertir File a Uint8Array para el upload server-side
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await storageUpload(
      DESIGNS_BUCKET,
      storagePath,
      bytes,
      file.type
    );

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: `Error al subir: ${uploadError}` };
    }

    // Obtener URL pública
    const publicUrl = storagePublicUrl(DESIGNS_BUCKET, storagePath);

    // Guardar en DB
    const image = await prisma.orderImage.create({
      data: {
        orderId,
        url: publicUrl,
        fileName: file.name,
        storagePath,
      },
    });

    revalidatePath("/orders");
    return {
      success: true,
      image: {
        id: image.id,
        url: image.url,
        fileName: image.fileName,
      },
    };
  } catch (err) {
    console.error("Upload error:", err);
    return { error: "Error inesperado al subir la imagen." };
  }
}

export async function deleteOrderImage(imageId: string) {
  const image = await prisma.orderImage.findUnique({ where: { id: imageId } });
  if (!image) return { error: "Imagen no encontrada" };

  try {
    await storageDelete(DESIGNS_BUCKET, [image.storagePath]);
  } catch {
    // Si falla el borrado de Storage, igual borramos de DB
  }

  await prisma.orderImage.delete({ where: { id: imageId } });
  revalidatePath("/orders");
  return { success: true };
}
