import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Slet eksisterende data
  await prisma.review.deleteMany();
  await prisma.restaurant.deleteMany();

  // Tilføj restaurants
  const torvets = await prisma.restaurant.create({
    data: {
      name: "Torvets Kebab",
      description: "The best kebab in town with fresh ingredients and homemade bread.",
      address: "Torvet 1, København",
      slug: "torvets",
      phone: "+45 12 34 56 78",
      website: "https://torvets-kebab.dk",
    },
  });

  const norrebro = await prisma.restaurant.create({
    data: {
      name: "Nørrebro Shawarma",
      description: "Authentic Middle Eastern flavors in the heart of Nørrebro.",
      address: "Nørrebrogade 123, København",
      slug: "norrebro-shawarma",
      phone: "+45 98 76 54 32",
    },
  });

  // Tilføj reviews
  await prisma.review.createMany({
    data: [
      {
        restaurantId: torvets.id,
        authorName: "Lars Nielsen",
        rating: 5,
        comment: "Fantastisk kebab! Bedste jeg har smagt i København.",
      },
      {
        restaurantId: torvets.id,
        authorName: "Maria Andersen",
        rating: 4,
        comment: "Rigtig god mad, men lidt lang ventetid.",
      },
      {
        restaurantId: norrebro.id,
        authorName: "Ahmed Hassan",
        rating: 5,
        comment: "Autentisk smag, føler mig hjemme!",
      },
    ],
  });

  console.log("Database seeded! 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
