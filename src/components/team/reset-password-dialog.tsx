"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { KeyRound } from "lucide-react";
import { resetUserPassword } from "@/lib/auth-actions";

interface ResetPasswordDialogProps {
  authUserId: string;
  userName: string;
}

export function ResetPasswordDialog({
  authUserId,
  userName,
}: ResetPasswordDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const result = await resetUserPassword(formData);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => setOpen(false), 1500);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        setError(null);
        setSuccess(false);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <KeyRound className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resetear Contraseña</DialogTitle>
          <DialogDescription>
            Asigná una nueva contraseña para {userName}.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="authUserId" value={authUserId} />
          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-700">
              Contraseña actualizada correctamente.
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva contraseña *</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || success}>
              {loading ? "Reseteando..." : "Resetear contraseña"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
