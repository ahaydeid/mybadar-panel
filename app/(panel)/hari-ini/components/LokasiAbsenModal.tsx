"use client";

interface LokasiAbsenModalProps {
  open: boolean;
  onClose: () => void;
  lat: number | null;
  lng: number | null;
  nama: string | null;
  jamMasuk: string | null;
}

export default function LokasiAbsenModal({ open, onClose, lat, lng, nama, jamMasuk }: LokasiAbsenModalProps) {
  if (!open) return null;

  const hasLocation = lat !== null && lng !== null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white pb-6 px-5 rounded shadow-xl w-[95%] max-w-3xl space-y-5">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold mt-4">Detail Lokasi Guru</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-4xl leading-none">
            ×
          </button>
        </div>

        {/* Maps */}
        {hasLocation ? (
          <div className="space-y-4">
            {/* MAPS */}
            <div className="w-full h-[450px] overflow-hidden border">
              <iframe width="100%" height="100%" loading="lazy" allowFullScreen src={`https://www.google.com/maps?q=${lat},${lng}&hl=es;z=16&output=embed`}></iframe>
            </div>

            {/* Info */}
            <div className="pt-4 border-t space-y-2 text-sm text-gray-800">
              <p>
                <span className="font-semibold">Nama:</span> {nama}
              </p>

              <p>
                <span className="font-semibold">Jam Masuk:</span> {jamMasuk ?? "-"}
              </p>

              <p>
                <span className="font-semibold">Koordinat:</span> {lat}, {lng}
              </p>

              {/* Status Lokasi */}
              <div className="mt-3">
                <span className={`px-4 py-2 text-sm font-semibold ${hasLocation ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{hasLocation ? "Absen diterima" : "Absen ditolak"}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">Tidak ada data lokasi.</div>
        )}
      </div>
    </div>
  );
}
