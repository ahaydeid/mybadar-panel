"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface SuccessSaveModalProps {
  open: boolean;
  message?: string;
  onClose: () => void;
}

export default function SuccessSaveModal({ open, message = "Data berhasil disimpan.", onClose }: SuccessSaveModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm text-center">
        <DialogHeader>
          <div className="flex flex-col items-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            <DialogTitle className="text-xl font-semibold">Berhasil</DialogTitle>
          </div>
        </DialogHeader>

        <p className="text-gray-600">{message}</p>

        <DialogFooter className="mt-4 flex justify-center">
          <Button className="bg-sky-600 hover:bg-sky-700 text-white px-6" onClick={onClose}>
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
