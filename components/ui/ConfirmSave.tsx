"use client";

export default function ConfirmSave({ isOpen, onClose, onConfirm, title, description }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; description: string }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-sm text-center">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <div className="flex justify-center gap-4">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
            Batal
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
