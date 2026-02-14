// app/products/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Step1BasicInfo from "@/components/products/new/Step1BasicInfo";
import Step2Details from "@/components/products/new/Step2Details";
import Step3Images from "@/components/products/new/Step3Images";

/* ================= TYPES ================= */
interface Sector {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
  sectors: Sector[];
}

interface SubCategory {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  subcategories: SubCategory[];
}

/* ================= PAGE ================= */
export default function NewProductPage() {
  const router = useRouter();

  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    pricePer: "night",
    cityId: "",
    sectorId: "",
    categoryId: "",
    subCategoryId: "",
    address: "",

    maxGuests: "2",
    bedrooms: "1",
    bathrooms: "1",
    latitude: "",
    longitude: "",
    status: "active",
    isFeatured: false,

    mainImage: null as File | null,
    gallery: [] as File[],
  });

  /* ================= LOAD DATA ================= */
  // app/products/new/page.tsx - partie mise à jour
useEffect(() => {
  async function loadData() {
    try {
      console.log("🔄 Chargement des villes et catégories...");
      
      // Appeler les API en parallèle
      const [citiesRes, categoriesRes] = await Promise.all([
        fetch("/api/cities"),
        fetch("/api/categories")
      ]);

      // Vérifier les réponses
      console.log("📊 Réponse villes:", citiesRes.status, citiesRes.ok);
      console.log("📊 Réponse catégories:", categoriesRes.status, categoriesRes.ok);

      if (citiesRes.ok) {
        const citiesData = await citiesRes.json();
        console.log("🏙️ Données villes brutes:", citiesData);
        
        // Vérifier la structure des données
        if (citiesData.success && Array.isArray(citiesData.data)) {
          setCities(citiesData.data);
          console.log(`✅ ${citiesData.data.length} villes chargées`);
        } else if (Array.isArray(citiesData)) {
          // Si l'API retourne directement un tableau
          setCities(citiesData);
          console.log(`✅ ${citiesData.length} villes chargées (format tableau direct)`);
        } else {
          console.error("❌ Structure de données invalide pour les villes:", citiesData);
          // Données par défaut en cas d'erreur
          setCities(getDefaultCities());
        }
      } else {
        const errorText = await citiesRes.text();
        console.error("❌ Erreur API villes:", errorText);
        setCities(getDefaultCities());
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        console.log("📁 Données catégories brutes:", categoriesData);
        
        // Vérifier la structure des données
        if (categoriesData.success && Array.isArray(categoriesData.data)) {
          setCategories(categoriesData.data);
          console.log(`✅ ${categoriesData.data.length} catégories chargées`);
        } else if (Array.isArray(categoriesData)) {
          // Si l'API retourne directement un tableau
          setCategories(categoriesData);
          console.log(`✅ ${categoriesData.length} catégories chargées (format tableau direct)`);
        } else {
          console.error("❌ Structure de données invalide pour les catégories:", categoriesData);
          // Données par défaut en cas d'erreur
          setCategories(getDefaultCategories());
        }
      } else {
        const errorText = await categoriesRes.text();
        console.error("❌ Erreur API catégories:", errorText);
        setCategories(getDefaultCategories());
      }
      
    } catch (error) {
      console.error("💥 Erreur fatale chargement données:", error);
      setError("Erreur de chargement des données");
      // Données par défaut en cas d'erreur
      setCities(getDefaultCities());
      setCategories(getDefaultCategories());
    } finally {
      setLoadingData(false);
      console.log("🏁 Chargement terminé");
    }
  }

  loadData();
}, []);

// Fonctions de données par défaut
const getDefaultCities = () => [
  { 
    id: 1, 
    name: "Casablanca", 
    sectors: [
      { id: 1, name: "Maarif" }, 
      { id: 2, name: "Anfa" }
    ] 
  },
  { 
    id: 2, 
    name: "Rabat", 
    sectors: [
      { id: 3, name: "Agdal" }, 
      { id: 4, name: "Hassan" }
    ] 
  },
];

const getDefaultCategories = () => [
  { 
    id: 1, 
    name: "Immobilier", 
    subcategories: [
      { id: 1, name: "Appartements" },
      { id: 2, name: "Villas" }
    ] 
  },
  { 
    id: 2, 
    name: "Vacances", 
    subcategories: [
      { id: 3, name: "Appartements de vacances" },
      { id: 4, name: "Villas de vacances" }
    ] 
  },
];

  /* ================= UPDATE FORM ================= */
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "cityId") {
      setFormData((prev) => ({ ...prev, sectorId: "" }));
    }
    if (field === "categoryId") {
      setFormData((prev) => ({ ...prev, subCategoryId: "" }));
    }
  };

  /* ================= VALIDATION ================= */
  const validateStep1 = () => {
    if (!formData.title.trim()) return setError("Titre requis"), false;
    if (!formData.description.trim()) return setError("Description requise"), false;
    if (!formData.price || Number(formData.price) <= 0)
      return setError("Prix invalide"), false;
    if (!formData.cityId) return setError("Ville requise"), false;
    if (!formData.categoryId) return setError("Catégorie requise"), false;
    return true;
  };

  const validateStep3 = () => {
    if (!formData.mainImage) {
      setError("Image principale requise");
      return false;
    }
    return true;
  };

  /* ================= NAV ================= */
  const goToNextStep = () => {
    let valid = false;
    if (currentStep === 1) valid = validateStep1();
    if (currentStep === 2) valid = true;
    if (currentStep === 3) valid = validateStep3();

    if (!valid) return;

    setError(null);
    currentStep < 3 ? setCurrentStep(currentStep + 1) : handleSubmit();
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const fd = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (!value || key === "gallery" || key === "mainImage") return;
        if (typeof value === "boolean") {
          fd.append(key, String(value));
        } else if (typeof value === "string" || typeof value === "number") {
          fd.append(key, String(value));
        }
      });

      if (formData.mainImage) fd.append("mainImage", formData.mainImage);
      formData.gallery.forEach((file) => fd.append("gallery", file));

      const res = await fetch("/api/products", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erreur création");

      // ✅ CORRIGÉ
      router.push(`/products/${data.id}`);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return <div className="p-10 text-center">Chargement...</div>;

  const progressPercentage = (currentStep / 3) * 100;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {error && (
          <div className="mb-4 bg-red-50 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg p-6 shadow-sm">
          {currentStep === 1 && (
            <Step1BasicInfo
              formData={formData}
              updateFormData={updateFormData}
              cities={cities}
              categories={categories}
            />
          )}

          {currentStep === 2 && (
            <Step2Details formData={formData} updateFormData={updateFormData} />
          )}

          {currentStep === 3 && (
            <Step3Images
              formData={formData}
              updateFormData={updateFormData}
              handleMainImageChange={(f) => updateFormData("mainImage", f)}
              handleGalleryChange={(f) => updateFormData("gallery", f)}
              removeGalleryImage={(i) =>
                updateFormData(
                  "gallery",
                  formData.gallery.filter((_, idx) => idx !== i)
                )
              }
            />
          )}
        </div>

        <div className="flex justify-between mt-6">
          <button onClick={goToPreviousStep} disabled={currentStep === 1}>
            ← Précédent
          </button>
          <button onClick={goToNextStep} disabled={loading}>
            {currentStep === 3 ? "Publier" : "Suivant →"}
          </button>
        </div>
      </div>
    </div>
  );
}
