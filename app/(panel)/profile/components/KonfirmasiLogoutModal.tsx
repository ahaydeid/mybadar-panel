"use client";

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export default function KonfirmasiLogoutModal({ open, onClose }: ModalProps) {
  if (!open) return null;

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-80 p-6 shadow">
        <h2 className="font-semibold text-lg mb-4">Konfirmasi Logout</h2>
        <p className="text-sm text-gray-600 mb-6">Apakah Anda yakin ingin logout?</p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition">
            Batal
          </button>

          <button onClick={handleLogout} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
