export interface OperationType {
  id: string;
  label: string;
}

export interface LeafCategory {
  id: string;
  label: string;
  icon?: string;
  operations?: OperationType[]; // only immobilier leaves use operations
}

export interface CategoryGroup {
  id: string;
  label: string;
  icon: string;
  children: LeafCategory[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: "market",
    label: "Avito Market",
    icon: "🛒",
    children: [
      { id: "informatique", label: "Informatique, Multimédia et Gadgets", icon: "💻" },
      { id: "bebe", label: "Equipement pour Bébé et Enfant", icon: "🧸" },
      { id: "maison_jardin", label: "Maison et Jardin", icon: "🪴" },
      { id: "animalerie", label: "Animalerie", icon: "🐾" },
      { id: "musique", label: "Instruments de musique", icon: "🎸" },
      { id: "loisirs", label: "Loisirs et Divertissements", icon: "🎮" },
      { id: "mode", label: "Habillement et Mode", icon: "👕" },
      { id: "sport", label: "Bien être et Sport", icon: "🏃" },
      { id: "pro", label: "Matériels Professionnels", icon: "🧰" },
      { id: "stocks", label: "Stocks et Vente en gros", icon: "📦" },
      { id: "encheres", label: "Enchères Publiques", icon: "📣" },
    ],
  },
  {
    id: "vehicles",
    label: "Avito Véhicules",
    icon: "🚗",
    children: [
      { id: "voitures", label: "Voitures", icon: "🚗" },
      { id: "motos", label: "Motos", icon: "🏍️" },
      { id: "velos", label: "Vélos", icon: "🚲" },
      { id: "pieces", label: "Pièces et Accessoires pour véhicules", icon: "🧩" },
      { id: "camions", label: "Camions et Engins", icon: "🚚" },
      { id: "bateaux", label: "Bateaux", icon: "⛵" },
      { id: "autres_vehicules", label: "Autres Véhicules", icon: "🚙" },
    ],
  },
  {
    id: "immobilier",
    label: "Avito Immobilier",
    icon: "🏠",
    children: [
      {
        id: "appartement",
        label: "Appartements",
        icon: "🏢",
        operations: [
          { id: "vente", label: "À vendre" },
          { id: "location", label: "À louer" },
        ],
      },
      {
        id: "maison",
        label: "Maisons",
        icon: "🏡",
        operations: [
          { id: "vente", label: "À vendre" },
          { id: "location", label: "À louer" },
        ],
      },
      {
        id: "villa_riad",
        label: "Villas-Riad",
        icon: "🏡",
        operations: [
          { id: "vente", label: "À vendre" },
          { id: "location", label: "À louer" },
        ],
      },
      {
        id: "bureaux",
        label: "Bureaux et Plateaux",
        icon: "🏢",
        operations: [
          { id: "vente", label: "À vendre" },
          { id: "location", label: "À louer" },
        ],
      },
      {
        id: "magasins",
        label: "Magasins, Commerces et Locaux industriels",
        icon: "🏪",
        operations: [
          { id: "vente", label: "À vendre" },
          { id: "location", label: "À louer" },
        ],
      },
      {
        id: "terrains",
        label: "Terrains, Fermes et Equipement Professionnels",
        icon: "🗺️",
        operations: [{ id: "vente", label: "À vendre" }],
      },
      {
        id: "autre_immobilier",
        label: "Autre Immobilier",
        icon: "🏠",
        operations: [
          { id: "vente", label: "À vendre" },
          { id: "location", label: "À louer" },
          { id: "autre", label: "Autre" },
        ],
      },
    ],
  },
  {
    id: "enterprise",
    label: "Avito Entreprise",
    icon: "👤",
    children: [
      { id: "emploi", label: "Emploi", icon: "💼" },
      { id: "services", label: "Services", icon: "🛠️" },
      { id: "stages", label: "Stages, Cours et Formations", icon: "📚" },
      { id: "business", label: "Business et Affaires commerciales", icon: "📈" },
      { id: "evenements", label: "Événements", icon: "🎫" },
    ],
  },
];
