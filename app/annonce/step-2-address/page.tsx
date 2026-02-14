'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const CITIES: Record<string, string[]> = {
  Marrakech: ["Afaq", "Agdal", "Ain Mezouar", "Ancienne Médina", "Annakhil", "Arset Ben Chebli"],
  Tanger: ["Centre", "Malabata", "Marshan", "Boukhalef"],
  Casablanca: ["Maarif", "Sidi Maarouf", "Ain Diab", "Hay Hassani"],
  Rabat: ["Agdal", "Hassan", "Hay Riad", "Souissi"],
};

function setDraft(payload: any) {
  localStorage.setItem("annonce_draft", JSON.stringify(payload));
}
function getDraft(): any {
  try { return JSON.parse(localStorage.getItem("annonce_draft") || "{}"); } catch { return {}; }
}

function Panel({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
      <div className="h-full w-full max-w-sm bg-white shadow-xl flex flex-col">
        <div className="px-4 py-4 border-b flex items-center justify-between">
          <div className="font-semibold">{title}</div>
          <button onClick={onClose} className="text-xl leading-none">✕</button>
        </div>
        <div className="p-4 border-b">
          <input className="w-full border rounded-full px-4 py-2" placeholder="Rechercher" />
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

export default function Step2Address() {
  const router = useRouter();
  const [draft, setDraftState] = useState<any>({});
  const [openCity, setOpenCity] = useState(false);
  const [openSector, setOpenSector] = useState(false);

  useEffect(() => {
    setDraftState(getDraft());
  }, []);

  const sectors = useMemo(() => {
    if (!draft?.city) return [];
    return CITIES[draft.city] || [];
  }, [draft?.city]);

  const save = (next: any) => {
    const merged = { ...getDraft(), ...next };
    setDraftState(merged);
    setDraft(merged);
  };

  const canContinue = Boolean(draft?.categoryLabel && draft?.city && draft?.phone);

  return (
    <main className="mx-auto max-w-6xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 space-y-6">
        <h2 className="text-xl font-semibold">Votre Adresse</h2>

        <div>
          <label className="text-sm font-medium block mb-2">
            Ville - Secteur <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => setOpenCity(true)}
              className="border rounded-md px-4 py-3 text-left hover:border-blue-500 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">📍</span>
                <span>{draft.city || "Sélectionner"}</span>
              </span>
              <span className="text-gray-500">▾</span>
            </button>

            <button
              onClick={() => setOpenSector(true)}
              disabled={!draft.city}
              className="border rounded-md px-4 py-3 text-left hover:border-blue-500 flex items-center justify-between disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">🧭</span>
                <span>{draft.sector || "Sélectionner"}</span>
              </span>
              <span className="text-gray-500">▾</span>
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Adresse du bien</label>
          <input
            className="w-full border rounded-md px-4 py-3"
            placeholder="Adresse du bien"
            value={draft.address || ""}
            onChange={(e) => save({ address: e.target.value })}
          />
        </div>

        <div className="pt-2">
          <h3 className="font-semibold">Vos coordonnées</h3>
          <p className="text-sm text-gray-500 mt-1">
            Les acheteurs peuvent vous contacter directement sur votre numéro de téléphone.
          </p>

          <label className="text-sm font-medium block mt-4 mb-2">
            Numéro de téléphone <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border rounded-md px-4 py-3"
            placeholder="06XXXXXXXX"
            value={draft.phone || ""}
            onChange={(e) => save({ phone: e.target.value })}
          />
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <button
            onClick={() => router.push("/annonce/step-1-category")}
            className="rounded-md border px-6 py-3 hover:bg-gray-50"
          >
            Retour
          </button>
          <button
            onClick={() => router.push("/annonce/step-3-photos")}
            disabled={!canContinue}
            className="rounded-md bg-blue-600 text-white px-6 py-3 disabled:opacity-50 hover:bg-blue-700"
          >
            Continuer
          </button>
        </div>
      </div>

      <aside className="bg-white rounded-xl shadow p-6">
        <div className="font-semibold flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">💡</span>
          Comment définir mon annonce
        </div>
        <div className="mt-4 text-sm text-blue-900 bg-blue-50 border border-blue-100 rounded-lg p-4">
          Il est important d’inclure une adresse postale claire et précise pour que les clients potentiels puissent
          facilement vous trouver.
        </div>
        <a className="mt-4 inline-block text-sm underline text-gray-700" href="#">
          Termes et conditions d&apos;annonce
        </a>
      </aside>

      {openCity && (
        <Panel title="Ville - Secteur" onClose={() => setOpenCity(false)}>
          <div className="divide-y">
            {Object.keys(CITIES).map((c) => (
              <button
                key={c}
                onClick={() => {
                  save({ city: c, sector: "" });
                  setOpenCity(false);
                }}
                className="w-full px-4 py-4 flex justify-between hover:bg-gray-50"
              >
                <span>{c}</span>
                <span className="text-gray-500">›</span>
              </button>
            ))}
          </div>
        </Panel>
      )}

      {openSector && (
        <Panel title="Secteur" onClose={() => setOpenSector(false)}>
          <div className="px-4 py-3">
            <button className="text-sm text-blue-600 hover:underline" onClick={() => setOpenSector(false)}>
              ← Retour
            </button>
          </div>
          <div className="divide-y">
            {sectors.map((s) => (
              <button
                key={s}
                onClick={() => {
                  save({ sector: s });
                  setOpenSector(false);
                }}
                className="w-full px-4 py-4 flex justify-between hover:bg-gray-50"
              >
                <span>{s}</span>
                <span className="text-gray-500">›</span>
              </button>
            ))}
            {sectors.length === 0 && (
              <div className="px-4 py-6 text-sm text-gray-500">Choisissez une ville d&apos;abord.</div>
            )}
          </div>
        </Panel>
      )}
    </main>
  );
}
