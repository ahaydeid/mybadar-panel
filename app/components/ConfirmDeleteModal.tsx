"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  open: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({ open, title = "Konfirmasi Hapus", message = "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.", onCancel, onConfirm }: ConfirmDeleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-sm text-center">
        <DialogHeader>
          <div className="flex flex-col items-center space-y-3">
            <Trash2 className="w-12 h-12 text-rose-600" />
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          </div>
        </DialogHeader>

        <p className="text-gray-600">{message}</p>

        <DialogFooter className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={onCancel} className="px-6">
            Batal
          </Button>

          <Button onClick={onConfirm} className="px-6 bg-rose-600 hover:bg-rose-700 text-white">
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
