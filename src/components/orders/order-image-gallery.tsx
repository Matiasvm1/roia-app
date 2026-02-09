"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, ImageIcon, Loader2, ZoomIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { uploadOrderImage, deleteOrderImage } from "@/lib/actions";

export type ImageData = {
  id: string;
  url: string;
  fileName: string;
};

interface OrderImageGalleryProps {
  orderId: string;
  images: ImageData[];
  editable?: boolean;
}

export function OrderImageGallery({ orderId, images: initialImages, editable = false }: OrderImageGalleryProps) {
  const [images, setImages] = useState<ImageData[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setUploading(true);

    // Subir cada archivo
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.set("orderId", orderId);
      formData.set("file", file);

      const result = await uploadOrderImage(formData);

      if (result.error) {
        setError(typeof result.error === "string" ? result.error : "Error al subir imagen");
      } else if (result.image) {
        setImages((prev) => [...prev, result.image!]);
      }
    }

    setUploading(false);
    // Limpiar el input para permitir subir el mismo archivo
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleDelete(imageId: string) {
    if (!confirm("¿Eliminar esta imagen?")) return;
    setDeletingId(imageId);
    const result = await deleteOrderImage(imageId);
    if (!result.error) {
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    }
    setDeletingId(null);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm flex items-center gap-1">
          <ImageIcon className="h-3.5 w-3.5" />
          Imágenes de Diseño ({images.length})
        </Label>
        {editable && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleUpload}
              className="hidden"
              id={`upload-${orderId}`}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="mr-1 h-3.5 w-3.5" />
                  Subir Imágenes
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">{error}</p>
      )}

      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground border border-dashed rounded-lg">
          <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
          <p className="text-sm">Sin imágenes de diseño.</p>
          {editable && (
            <p className="text-xs mt-1">
              Hacé click en &quot;Subir Imágenes&quot; para agregar.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative border rounded-lg overflow-hidden bg-muted/30"
            >
              {/* Imagen con lightbox */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="w-full aspect-square relative cursor-pointer">
                    <img
                      src={image.url}
                      alt={image.fileName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-2">
                  <img
                    src={image.url}
                    alt={image.fileName}
                    className="w-full h-auto max-h-[85vh] object-contain rounded"
                  />
                  <p className="text-xs text-center text-muted-foreground mt-1">
                    {image.fileName}
                  </p>
                </DialogContent>
              </Dialog>

              {/* Nombre del archivo */}
              <div className="p-2">
                <p className="text-xs text-muted-foreground truncate" title={image.fileName}>
                  {image.fileName}
                </p>
              </div>

              {/* Botón eliminar */}
              {editable && (
                <button
                  onClick={() => handleDelete(image.id)}
                  disabled={deletingId === image.id}
                  className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  title="Eliminar imagen"
                >
                  {deletingId === image.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
