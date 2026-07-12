import { PrismaClient, RoomCategory, BookingStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin1234!", 10);
  const clientPassword = await bcrypt.hash("Client1234!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@reservia.app" },
    update: {},
    create: {
      name: "Admin Reservia",
      email: "admin@reservia.app",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const client = await prisma.user.upsert({
    where: { email: "client@reservia.app" },
    update: {},
    create: {
      name: "Client Demo",
      email: "client@reservia.app",
      password: clientPassword,
      role: "CLIENT",
    },
  });

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
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200",
      ],
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
      images: [
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200",
      ],
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
      images: [
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200",
      ],
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
      images: [
        "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200",
      ],
    },
  ];

  const rooms = [];
  for (const data of roomsData) {
    const room = await prisma.room.upsert({
      where: { slug: data.slug },
      update: {},
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
    await prisma.booking.create({
      data: {
        userId: client.id,
        roomId: rooms[0].id,
        checkIn: inFiveDays,
        checkOut: inEightDays,
        guests: 2,
        status: BookingStatus.CONFIRMED,
        totalPrice: rooms[0].price * 3,
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
