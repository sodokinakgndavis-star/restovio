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
      name: "Chambre Venezia",
      slug: "chambre-venezia",
      description:
        "Une chambre confortable et lumineuse aux tons chauds, idéale pour un séjour en solo ou en couple au cœur de Florence.",
      price: 8900,
      capacity: 2,
      category: RoomCategory.STANDARD,
      amenities: ["Wi-Fi gratuit", "Climatisation", "TV écran plat", "Salle de bain privée"],
      images: standardImages,
    },
    {
      name: "Chambre Firenze",
      slug: "chambre-firenze",
      description:
        "Chambre spacieuse avec balcon privé offrant une vue dégagée sur les toits de Florence, parfaite pour profiter du calme toscan.",
      price: 12900,
      capacity: 3,
      category: RoomCategory.SUPERIEURE,
      amenities: ["Wi-Fi gratuit", "Climatisation", "Balcon privé", "Minibar", "Coffre-fort"],
      images: superieureImages,
    },
    {
      name: "Suite Bellagio",
      slug: "suite-bellagio",
      description:
        "Notre suite la plus raffinée, avec salon séparé, literie premium et vue panoramique, inspirée de l'élégance du lac de Côme.",
      price: 24900,
      capacity: 2,
      category: RoomCategory.SUITE,
      amenities: ["Wi-Fi gratuit", "Salon séparé", "Baignoire", "Service en chambre", "Vue panoramique"],
      images: suiteImages,
    },
    {
      name: "Suite Toscana",
      slug: "suite-toscana",
      description:
        "Grand espace chaleureux inspiré de la campagne toscane, pensé pour les familles avec literie modulable et coin salon pour les enfants.",
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
          authorName: "Giulia M.",
          content:
            "Séjour romantique||Un week-end absolument parfait pour notre anniversaire. La chambre était magnifique, le petit-déjeuner délicieux et le personnel aux petits soins du début à la fin.",
          rating: 5,
          createdAt: new Date("2026-06-14"),
        },
        {
          authorName: "Marco R.",
          content:
            "Voyage d'affaires||Idéal pour un déplacement professionnel : Wi-Fi rapide, calme absolu pour travailler et un emplacement à deux pas du centre-ville. J'y retournerai sans hésiter.",
          rating: 5,
          createdAt: new Date("2026-05-22"),
        },
        {
          authorName: "Sofia L.",
          content:
            "Séjour en famille||Nos enfants ont adoré la piscine et nous avons passé une excellente soirée au restaurant. Une adresse chaleureuse, parfaite pour des vacances en famille à Florence.",
          rating: 5,
          createdAt: new Date("2026-04-09"),
        },
      ],
    });
  }

  const menuItemsData = [
    {
      name: "Burrata des Pouilles",
      description: "Burrata crémeuse, tomates confites, huile d'olive extra vierge, basilic frais.",
      price: 1600,
      category: MenuCategory.ENTREE,
    },
    {
      name: "Carpaccio de bœuf à la toscane",
      description: "Fines tranches de bœuf, roquette, copeaux de parmesan, huile d'olive.",
      price: 1800,
      category: MenuCategory.ENTREE,
    },
    {
      name: "Bruschetta al pomodoro",
      description: "Pain grillé, tomates fraîches, ail, basilic, huile d'olive des Pouilles.",
      price: 900,
      category: MenuCategory.ENTREE,
    },
    {
      name: "Vitello tonnato",
      description: "Veau rosé finement tranché, sauce onctueuse au thon et aux câpres.",
      price: 1700,
      category: MenuCategory.ENTREE,
    },
    {
      name: "Risotto au safran",
      description: "Riz carnaroli crémeux, safran de qualité, copeaux de parmesan.",
      price: 2100,
      category: MenuCategory.PLAT,
    },
    {
      name: "Pappardelle au ragù toscan",
      description: "Pâtes fraîches larges, ragù de bœuf mijoté longuement à la toscane.",
      price: 1900,
      category: MenuCategory.PLAT,
    },
    {
      name: "Branzino rôti",
      description: "Bar rôti entier, légumes de saison, huile d'olive et citron de Sicile.",
      price: 2600,
      category: MenuCategory.PLAT,
    },
    {
      name: "Osso buco alla milanese",
      description: "Jarret de veau braisé, gremolata, risotto au safran en accompagnement.",
      price: 2800,
      category: MenuCategory.PLAT,
    },
    {
      name: "Gnocchi al pesto",
      description: "Gnocchi maison, pesto genovese, pignons de pin, parmesan.",
      price: 1800,
      category: MenuCategory.PLAT,
    },
    {
      name: "Tiramisù Restovio",
      description: "Notre recette maison : mascarpone, café espresso, cacao amer.",
      price: 900,
      category: MenuCategory.DESSERT,
    },
    {
      name: "Panna cotta ai frutti di bosco",
      description: "Panna cotta vanille, coulis de fruits rouges de saison.",
      price: 850,
      category: MenuCategory.DESSERT,
    },
    {
      name: "Cannoli siciliani",
      description: "Cannoli croustillants garnis de ricotta sucrée et éclats de pistache.",
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
      name: "Vin toscan (rouge ou blanc)",
      description: "Sélection de vins locaux, servi au verre.",
      price: 800,
      category: MenuCategory.BOISSON,
    },
    {
      name: "Café espresso",
      description: "Café italien préparé à la demande.",
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
