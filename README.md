# Avito Wizard (Demo) — Next.js + Tailwind + Prisma + MySQL (v2)

✅ Catégories en accordéon (comme la capture) : Market / Véhicules / Immobilier / Entreprise  
✅ Immobilier: sous-catégorie + opération (À vendre / À louer)  
✅ Wizard: catégorie → adresse → photos → POST MySQL  
✅ API: GET/POST `/api/annonce`

---

## 1) Installer
```bash
npm install
```

## 2) Configurer MySQL
Crée une base `avito_immobilier` puis copie `.env.example` -> `.env` et mets ton `DATABASE_URL`.

Ex:
DATABASE_URL="mysql://root:password@localhost:3306/avito_immobilier"

## 3) Migrer Prisma
```bash
npm run prisma:migrate -- --name init
```

## 4) Lancer
```bash
npm run dev
```

---

## Pages
- Wizard: `/annonce/step-1-category`
- Liste annonces: `/annonces`

> Photos: UI placeholder (stocke les noms). Pour upload réel (Cloudinary/S3), je peux te l’ajouter.
