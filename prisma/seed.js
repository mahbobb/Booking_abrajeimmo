// seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Nettoyage
  await prisma.reservation.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.adImage.deleteMany();
  await prisma.ad.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.sector.deleteMany();
  await prisma.city.deleteMany();
  await prisma.otp.deleteMany();
  await prisma.user.deleteMany();

  // 1. Créer un utilisateur admin
  console.log("👤 Creating admin user...");
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      phone: "+212600000000",
      passwordHash: "$2b$10$yourhashedpasswordhere", // À remplacer par un vrai hash
      role: "ADMIN",
      phoneVerified: true,
      active: true,
    },
  });

  // 2. Villes et secteurs
  console.log("🏙️ Seeding cities & sectors...");
  
  const cities = [
    {
      name: "Casablanca",
      sectors: ["Maarif", "Anfa", "Ain Diab", "Gauthier", "Sidi Maarouf", "Al Qods", "Al Fida"],
    },
    {
      name: "Rabat",
      sectors: ["Agdal", "Hassan", "Hay Riad", "Souissi", "Youssoufia", "Touarga"],
    },
    {
      name: "Marrakech",
      sectors: ["Gueliz", "Hivernage", "Palmeraie", "Medina", "Daoudiate", "Massira"],
    },
    {
      name: "Agadir",
      sectors: ["Talborjt", "Dakhla", "Anza", "Hay Mohammadi", "Founty"],
    },
    {
      name: "Tanger",
      sectors: ["Malabata", "Marshan", "Iberia", "Centre Ville", "Beni Makada"],
    },
  ];

  for (const cityData of cities) {
    const city = await prisma.city.create({
      data: {
        name: cityData.name,
        sectors: {
          create: cityData.sectors.map(sectorName => ({
            name: sectorName,
          })),
        },
      },
    });
    console.log(`✅ ${city.name} - ${cityData.sectors.length} secteurs`);
  }

  // 3. Catégories et sous-catégories
  console.log("\n📁 Seeding categories & subcategories...");
  
  const categories = [
    {
      name: "Immobilier",
      slug: "immobilier",
      icon: "🏠",
      subcategories: [
        { name: "Appartements", slug: "appartements" },
        { name: "Villas", slug: "villas" },
        { name: "Maisons", slug: "maisons" },
        { name: "Bureaux", slug: "bureaux" },
        { name: "Terrains", slug: "terrains" },
      ],
    },
    {
      name: "Véhicules",
      slug: "vehicules",
      icon: "🚗",
      subcategories: [
        { name: "Voitures", slug: "voitures" },
        { name: "Motos", slug: "motos" },
        { name: "Camions", slug: "camions" },
        { name: "Pièces détachées", slug: "pieces-detachees" },
      ],
    },
    {
      name: "Vacances",
      slug: "vacances",
      icon: "🏖️",
      subcategories: [
        { name: "Appartements de vacances", slug: "appartements-vacances" },
        { name: "Villas de vacances", slug: "villas-vacances" },
        { name: "Riads", slug: "riads" },
        { name: "Maisons d'hôtes", slug: "maisons-hotess" },
      ],
    },
    {
      name: "Électronique",
      slug: "electronique",
      icon: "📱",
      subcategories: [
        { name: "Téléphones", slug: "telephones" },
        { name: "Ordinateurs", slug: "ordinateurs" },
        { name: "Télévisions", slug: "televisions" },
        { name: "Électroménager", slug: "electromenager" },
      ],
    },
  ];

  for (const categoryData of categories) {
    const category = await prisma.category.create({
      data: {
        name: categoryData.name,
        slug: categoryData.slug,
        icon: categoryData.icon,
        subcategories: {
          create: categoryData.subcategories.map(sub => ({
            name: sub.name,
            slug: sub.slug,
          })),
        },
      },
    });
    console.log(`✅ ${category.icon} ${category.name}`);
  }

  // 4. Créer quelques produits (hébergements)
  console.log("\n🏡 Creating sample products...");
  
  const allCities = await prisma.city.findMany({
    include: { sectors: true },
  });
  
  const allCategories = await prisma.category.findMany({
    include: { subcategories: true },
  });
  
  const vacationCategory = allCategories.find(c => c.slug === "vacances");
  const vacationSubCategories = vacationCategory?.subcategories || [];
  
  const sampleProducts = [
    {
      title: "Villa de luxe à Marrakech avec piscine",
      description: "Magnifique villa traditionnelle marocaine avec piscine privée, 5 chambres, jardin et terrasse. Idéale pour familles ou groupes.",
      price: 2500,
      pricePer: "night",
      maxGuests: 10,
      bedrooms: 5,
      bathrooms: 4,
      address: "Palmeraie, Marrakech",
      latitude: 31.6295,
      longitude: -7.9811,
      userId: adminUser.id,
      cityId: allCities.find(c => c.name === "Marrakech")?.id || 1,
      sectorId: allCities.find(c => c.name === "Marrakech")?.sectors[0]?.id,
      categoryId: vacationCategory?.id || 1,
      subCategoryId: vacationSubCategories.find(s => s.slug === "villas-vacances")?.id,
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
      ],
    },
    {
      title: "Appartement moderne centre Casablanca",
      description: "Appartement neuf au cœur de Casablanca, entièrement équipé, vue mer, proche de tous les commodités.",
      price: 800,
      pricePer: "night",
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 1,
      address: "Maarif, Casablanca",
      latitude: 33.5731,
      longitude: -7.5898,
      userId: adminUser.id,
      cityId: allCities.find(c => c.name === "Casablanca")?.id || 1,
      sectorId: allCities.find(c => c.name === "Casablanca")?.sectors[0]?.id,
      categoryId: vacationCategory?.id || 1,
      subCategoryId: vacationSubCategories.find(s => s.slug === "appartements-vacances")?.id,
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
      ],
    },
    {
      title: "Riad typique dans la médina de Fès",
      description: "Authentique riad restauré au cœur de la médina, patio central, 3 chambres, décoration traditionnelle.",
      price: 1200,
      pricePer: "night",
      maxGuests: 6,
      bedrooms: 3,
      bathrooms: 2,
      address: "Fès El Bali, Fès",
      latitude: 34.0181,
      longitude: -5.0078,
      userId: adminUser.id,
      cityId: allCities.find(c => c.name === "Fès")?.id || 1,
      sectorId: allCities.find(c => c.name === "Fès")?.sectors[0]?.id,
      categoryId: vacationCategory?.id || 1,
      subCategoryId: vacationSubCategories.find(s => s.slug === "riads")?.id,
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      ],
    },
  ];

  for (const productData of sampleProducts) {
    const product = await prisma.product.create({
      data: {
        title: productData.title,
        description: productData.description,
        price: productData.price,
        pricePer: productData.pricePer,
        maxGuests: productData.maxGuests,
        bedrooms: productData.bedrooms,
        bathrooms: productData.bathrooms,
        address: productData.address,
        latitude: productData.latitude,
        longitude: productData.longitude,
        status: "active",
        isFeatured: true,
        mainImage: productData.images[0],
        userId: productData.userId,
        cityId: productData.cityId,
        sectorId: productData.sectorId,
        categoryId: productData.categoryId,
        subCategoryId: productData.subCategoryId,
        images: {
          create: productData.images.map((url, index) => ({
            url,
          })),
        },
      },
    });
    console.log(`✅ Product: ${product.title}`);
  }

  // 5. Créer quelques annonces (ads)
  console.log("\n📢 Creating sample ads...");
  
  const realEstateCategory = allCategories.find(c => c.slug === "immobilier");
  const vehiclesCategory = allCategories.find(c => c.slug === "vehicules");
  
  const sampleAds = [
    {
      title: "Appartement 3 pièces à vendre à Rabat",
      description: "Bel appartement de 3 pièces au centre de Rabat, vue mer, parking, 100m².",
      price: 1800000,
      surface: 100,
      rooms: 3,
      address: "Agdal, Rabat",
      hidePhone: false,
      userId: adminUser.id,
      cityId: allCities.find(c => c.name === "Rabat")?.id || 1,
      sectorId: allCities.find(c => c.name === "Rabat")?.sectors[0]?.id,
      categoryId: realEstateCategory?.id || 1,
      subcategoryId: realEstateCategory?.subcategories[0]?.id,
      images: [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00",
      ],
    },
    {
      title: "Toyota Corolla 2020",
      description: "Voiture en excellent état, 50000 km, entretien chez concessionnaire.",
      price: 180000,
      address: "Casablanca",
      hidePhone: true,
      userId: adminUser.id,
      cityId: allCities.find(c => c.name === "Casablanca")?.id || 1,
      sectorId: allCities.find(c => c.name === "Casablanca")?.sectors[1]?.id,
      categoryId: vehiclesCategory?.id || 1,
      subcategoryId: vehiclesCategory?.subcategories[0]?.id,
      images: [
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
      ],
    },
  ];

  for (const adData of sampleAds) {
    const ad = await prisma.ad.create({
      data: {
        title: adData.title,
        description: adData.description,
        price: adData.price,
        surface: adData.surface,
        rooms: adData.rooms,
        address: adData.address,
        hidePhone: adData.hidePhone,
        status: "approved",
        isPremium: true,
        image: adData.images[0],
        userId: adData.userId,
        cityId: adData.cityId,
        sectorId: adData.sectorId,
        categoryId: adData.categoryId,
        subcategoryId: adData.subcategoryId,
        images: {
          create: adData.images.map(url => ({
            url,
          })),
        },
      },
    });
    console.log(`✅ Ad: ${ad.title}`);
  }

  console.log("\n🎉 Database seeded successfully!");
  console.log("📊 Summary:");
  console.log(`   • Cities: ${allCities.length}`);
  console.log(`   • Categories: ${allCategories.length}`);
  console.log(`   • Products: ${sampleProducts.length}`);
  console.log(`   • Ads: ${sampleAds.length}`);
  console.log(`   • Admin user: ${adminUser.email}`);
}

main()
  .catch((error) => {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
