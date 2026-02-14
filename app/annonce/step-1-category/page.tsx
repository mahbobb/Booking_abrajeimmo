'use client';

import { useEffect, useState } from "react";
import CategoryModal, { CategorySelection } from "@/components/CategoryModal";
import { useRouter } from "next/navigation";

function setDraft(payload: any) {
  localStorage.setItem("annonce_draft", JSON.stringify(payload));
}
function getDraft(): any {
  try { return JSON.parse(localStorage.getItem("annonce_draft") || "{}"); } catch { return {}; }
}

export default function Step1Category() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState<string>("");

  useEffect(() => {
    const d = getDraft();
    if (d?.categoryLabel) setLabel(d.categoryLabel);
  }, []);

  const onSelect = (sel: CategorySelection) => {
    const next = {
      ...getDraft(),
      groupId: sel.groupId,
      groupLabel: sel.groupLabel,
      categoryId: sel.leafId,
      categoryLabel: sel.label,
      propertyType: sel.groupId === "immobilier" ? sel.leafId : null,
      operationType: sel.groupId === "immobilier" ? sel.operationId ?? null : null,
    };
    setDraft(next);
    setLabel(sel.label);
    router.push("/annonce/step-2-address");
  };

  return (
    <main className="mx-auto max-w-6xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Qu&apos;annoncez-vous aujourd&apos;hui ?</h2>
          <p className="text-sm text-gray-500">
            Grâce à ces informations les acheteurs peuvent trouver votre annonce plus facilement
          </p>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">
            Catégorie <span className="text-red-500">*</span>
          </label>

          <button
            onClick={() => setOpen(true)}
            className="w-full border rounded-md px-4 py-3 text-left hover:border-blue-500 flex items-center justify-between"
          >
            <span className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">📁</span>
              <span>{label || "Sélectionner"}</span>
            </span>
            <span className="text-gray-500">▾</span>
          </button>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => router.push("/annonce/step-2-address")}
            disabled={!label}
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
          Choisir la bonne catégorie lors de l’insertion d’une annonce peut aider à augmenter la visibilité,
          la pertinence et l’efficacité, et éviter tout potentiel refus.
        </div>
        <a className="mt-4 inline-block text-sm underline text-gray-700" href="#">
          Termes et conditions d&apos;annonce
        </a>
      </aside>

      <CategoryModal open={open} onClose={() => setOpen(false)} onSelect={onSelect} />
    </main>
  );
}
