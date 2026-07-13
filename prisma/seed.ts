import { PrismaClient, RoomCategory, BookingStatus, MenuCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin1234!", 10);
  const clientPassword = await bcrypt.hash("Client1234!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@restovio.app" },
    update: {},
    create: {
      name: "Admin Restovio",
      email: "admin@restovio.app",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const client = await prisma.user.upsert({
    where: { email: "client@restovio.app" },
    update: {},
    create: {
      name: "Client Demo",
      email: "client@restovio.app",
      password: clientPassword,
      role: "CLIENT",
    },
  });

  const standardImages = [
    "photo-1618773928121-c32242e63f39",
    "photo-1629140727571-9b5c6f6267b4",
    "photo-1631049307264-da0ec9d70304",
    "photo-1566665797739-1674de7a421a",
    "photo-1711059985570-4c32ed12a12c",
    "photo-1568495248636-6432b97bd949",
    "photo-1631049552057-403cdb8f0658",
  ].map((id) => `https://images.unsplash.com/${id}?w=1200`);

  const superieureImages = [
    "photo-1719266084633-24981ecdc417",
    "photo-1496945589647-8784b8d04934",
    "photo-1645587593689-e7cde7c5d9db",
    "photo-1585311746214-764246524f52",
    "photo-1702830499141-a0634d87d6af",
    "photo-1696854649609-1fd6e5abf87f",
    "photo-1558553066-933ef54720a9",
  ].map((id) => `https://images.unsplash.com/${id}?w=1200`);

  const suiteImages = [
    "photo-1731336478850-6bce7235e320",
    "photo-1685592437742-3b56edb46b15",
    "photo-1777169794972-12095816073b",
    "photo-1777180249046-abf7d640e0d9",
    "photo-1776763018821-8feeaeeee0a5",
    "photo-1776763018970-9fdf66bd4666",
    "photo-1775866914882-9f0d58aa3372",
  ].map((id) => `https://images.unsplash.com/${id}?w=1200`);

  const familialeImages = [
    "photo-1721222203415-69033eaf3bd1",
    "photo-1721989516956-a9b06801038f",
    "photo-1721989522157-0e73fa635637",
    "photo-1654243397456-73da481a623e",
    "photo-1662841540530-2f04bb3291e8",
    "photo-1741506131058-533fcf894483",
    "photo-1662990782404-a5d704ea323a",
  ].map((id) => `https://images.unsplash.com/${id}?w=1200`);

  const roomsData = [
    {
      name: "Chambre Standard Vue Jardin",
      slug: "chambre-standard-vue-jardin",
      description:
        "Une chambre confortable et lumineuse donnant sur le jardin de l'hôtel, idéale pour un séjour en solo ou en couple.",
      price: 8900,
      capacity: 2,
      category: RoomCategory.STANDARD,
      amenities: ["Wi-Fi gratuit", "Climatisation", "TV écran plat", "Salle de bain privée"],
      images: standardImages,
    },
    {
      name: "Chambre Supérieure Balcon",
      slug: "chambre-superieure-balcon",
      description:
        "Chambre spacieuse avec balcon privé offrant une vue dégagée, parfaite pour profiter du calme en journée comme en soirée.",
      price: 12900,
      capacity: 3,
      category: RoomCategory.SUPERIEURE,
      amenities: ["Wi-Fi gratuit", "Climatisation", "Balcon privé", "Minibar", "Coffre-fort"],
      images: superieureImages,
    },
    {
      name: "Suite Prestige",
      slug: "suite-prestige",
      description:
        "Notre suite la plus raffinée, avec salon séparé, literie premium et vue panoramique sur la ville.",
      price: 24900,
      capacity: 2,
      category: RoomCategory.SUITE,
      amenities: ["Wi-Fi gratuit", "Salon séparé", "Baignoire", "Service en chambre", "Vue panoramique"],
      images: suiteImages,
    },
    {
      name: "Chambre Familiale",
      slug: "chambre-familiale",
      description:
        "Grand espace pensé pour les familles, avec literie modulable et coin salon pour les enfants.",
      price: 15900,
      capacity: 5,
      category: RoomCategory.FAMILIALE,
      amenities: ["Wi-Fi gratuit", "Lits superposés", "Climatisation", "TV écran plat", "Kitchenette"],
      images: familialeImages,
    },
  ];

  const rooms = [];
  for (const data of roomsData) {
    const room = await prisma.room.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    });
    rooms.push(room);
  }

  const now = new Date();
  const inFiveDays = new Date(now);
  inFiveDays.setDate(now.getDate() + 5);
  const inEightDays = new Date(now);
  inEightDays.setDate(now.getDate() + 8);

  const existingBooking = await prisma.booking.findFirst({
    where: { userId: client.id, roomId: rooms[0].id },
  });

  if (!existingBooking) {
    const totalPrice = rooms[0].price * 3;
    await prisma.booking.create({
      data: {
        userId: client.id,
        roomId: rooms[0].id,
        checkIn: inFiveDays,
        checkOut: inEightDays,
        guests: 2,
        status: BookingStatus.CONFIRMED,
        totalPrice,
        depositAmount: Math.round(totalPrice * 0.5),
      },
    });
  }

  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          userId: client.id,
          authorName: "Client Demo",
          content: "Séjour impeccable, personnel très accueillant et chambre irréprochable.",
          rating: 5,
        },
        {
          authorName: "Marie D.",
          content: "Excellent rapport qualité-prix, je recommande vivement cet établissement.",
          rating: 4,
        },
        {
          authorName: "Karim B.",
          content: "Emplacement idéal et petit-déjeuner délicieux. Nous reviendrons.",
          rating: 5,
        },
      ],
    });
  }

  const menuItemsData = [
    {
      name: "Salade César",
      description: "Romaine, poulet grillé, copeaux de parmesan, croûtons, sauce César maison.",
      price: 1200,
      category: MenuCategory.ENTREE,
    },
    {
      name: "Velouté de légumes de saison",
      description: "Préparé chaque jour à partir de légumes frais du marché.",
      price: 900,
      category: MenuCategory.ENTREE,
    },
    {
      name: "Carpaccio de bœuf",
      description: "Fines tranches de bœuf, huile d'olive, copeaux de parmesan, roquette.",
      price: 1400,
      category: MenuCategory.ENTREE,
    },
    {
      name: "Assiette de charcuterie et fromages",
      description: "Sélection de charcuteries fines et fromages affinés, pain grillé.",
      price: 1600,
      category: MenuCategory.ENTREE,
    },
    {
      name: "Filet de dorade grillée",
      description: "Servi avec légumes de saison et sauce citronnée.",
      price: 2200,
      category: MenuCategory.PLAT,
    },
    {
      name: "Risotto aux champignons",
      description: "Riz arborio crémeux, champignons de saison, parmesan.",
      price: 1900,
      category: MenuCategory.PLAT,
    },
    {
      name: "Entrecôte grillée sauce poivre",
      description: "Bœuf grillé à la demande, frites maison, sauce au poivre.",
      price: 2600,
      category: MenuCategory.PLAT,
    },
    {
      name: "Poulet rôti aux herbes",
      description: "Poulet fermier rôti, pommes de terre rissolées, jus corsé.",
      price: 2100,
      category: MenuCategory.PLAT,
    },
    {
      name: "Pâtes aux fruits de mer",
      description: "Linguine, fruits de mer frais, sauce tomate légèrement relevée.",
      price: 2300,
      category: MenuCategory.PLAT,
    },
    {
      name: "Burger maison et frites",
      description: "Bœuf haché, cheddar affiné, oignons confits, frites fraîches.",
      price: 1800,
      category: MenuCategory.PLAT,
    },
    {
      name: "Tiramisu",
      description: "Recette traditionnelle italienne, mascarpone et café.",
      price: 900,
      category: MenuCategory.DESSERT,
    },
    {
      name: "Tarte au citron meringuée",
      description: "Pâte sablée, crème citron, meringue légèrement dorée.",
      price: 950,
      category: MenuCategory.DESSERT,
    },
    {
      name: "Fondant au chocolat",
      description: "Cœur coulant, servi tiède avec une boule de glace vanille.",
      price: 1000,
      category: MenuCategory.DESSERT,
    },
    {
      name: "Salade de fruits frais",
      description: "Fruits de saison coupés minute.",
      price: 800,
      category: MenuCategory.DESSERT,
    },
    {
      name: "Eau minérale",
      description: "Plate ou gazeuse, 50 cl.",
      price: 400,
      category: MenuCategory.BOISSON,
    },
    {
      name: "Jus de fruits pressés",
      description: "Orange, pomme ou ananas, pressé minute.",
      price: 600,
      category: MenuCategory.BOISSON,
    },
    {
      name: "Verre de vin (rouge ou blanc)",
      description: "Sélection de vins locaux, servi au verre.",
      price: 700,
      category: MenuCategory.BOISSON,
    },
    {
      name: "Café ou thé",
      description: "Café expresso ou thé infusé à la demande.",
      price: 350,
      category: MenuCategory.BOISSON,
    },
    {
      name: "Cocktail sans alcool",
      description: "Mocktail fruité préparé par notre bar.",
      price: 750,
      category: MenuCategory.BOISSON,
    },
  ];

  const menuItemCount = await prisma.menuItem.count();
  if (menuItemCount === 0) {
    await prisma.menuItem.createMany({ data: menuItemsData });
  }

  console.log("Seed terminé :", { admin: admin.email, client: client.email, rooms: rooms.length });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
