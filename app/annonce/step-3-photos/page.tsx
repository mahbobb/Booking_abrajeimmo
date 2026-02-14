'use client';

import { useEffect, useState } from "react";
import PhotoUploader from "@/components/PhotoUploader";
import { useRouter } from "next/navigation";

function getDraft(): any {
  try { return JSON.parse(localStorage.getItem("annonce_draft") || "{}"); } catch { return {}; }
}

export default function Step3Photos() {
  const router = useRouter();
  const [photos, setPhotos] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<any>({});

  useEffect(() => {
    setDraft(getDraft());
  }, []);

  // demo saves immobilier only
  const canSave = Boolean(draft?.propertyType && draft?.operationType && draft?.phone);

  async function publish() {
    setSaving(true);
    try {
      const payload = {
        ...getDraft(),
        photos: photos.map((f) => ({ name: f.name, size: f.size, type: f.type })),
      };

      const res = await fetch("/api/annonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Erreur API");
      }

      const annonce = await res.json();
      localStorage.removeItem("annonce_draft");

      alert("Annonce créée (id=" + annonce.id + ")");
      router.push("/annonces");
    } catch (e: any) {
      alert(e?.message || "Erreur lors de la création de l'annonce");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 space-y-6">
        <h2 className="text-xl font-semibold">Photos de l&apos;annonce</h2>
        <PhotoUploader photos={photos} setPhotos={setPhotos} />

        <div className="pt-2 flex justify-end gap-3">
          <button
            onClick={() => router.push("/annonce/step-2-address")}
            className="rounded-md border px-6 py-3 hover:bg-gray-50"
          >
            Retour
          </button>
          <button
            onClick={publish}
            disabled={!canSave || saving}
            className="rounded-md bg-blue-600 text-white px-6 py-3 disabled:opacity-50 hover:bg-blue-700"
          >
            {saving ? "Enregistrement..." : "Continuer"}
          </button>
        </div>
      </div>

      <aside className="bg-white rounded-xl shadow p-6">
        <div className="font-semibold flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">💡</span>
          Comment joindre la photo et la vidéo sur mon annonce.
        </div>
        <div className="mt-4 text-sm text-blue-900 bg-blue-50 border border-blue-100 rounded-lg p-4">
          Fournir de bonnes photos du produit est également important, cela peut aider à donner à l’acheteur potentiel
          une idée claire de l’état et de l’apparence du produit.
        </div>
        <a className="mt-4 inline-block text-sm underline text-gray-700" href="#">
          Termes et conditions d&apos;annonce
        </a>
      </aside>
    </main>
  );
}
