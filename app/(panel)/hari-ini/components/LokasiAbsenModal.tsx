// app/(panel)/hari-ini/components/LokasiAbsenModal.tsx

"use client";

interface LokasiAbsenModalProps {
  open: boolean;
  onClose: () => void;
  lat: number | null;
  lng: number | null;
}

export default function LokasiAbsenModal({ open, onClose, lat, lng }: LokasiAbsenModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-80 space-y-4">
        <h3 className="text-lg font-semibold">Lokasi Guru</h3>

        {lat && lng ? (
          <div className="space-y-1">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Lat:</span> {lat}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Lng:</span> {lng}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-600">Tidak ada data lokasi.</p>
        )}

        <button onClick={onClose} className="w-full bg-gray-800 text-white py-2 rounded-md">
          Tutup
        </button>
      </div>
    </div>
  );
}
