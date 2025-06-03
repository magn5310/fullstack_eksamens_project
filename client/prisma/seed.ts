import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.restaurant.deleteMany();

  // Real kebab places in Nørrebro
  const kebabShops = [
    "Torvets Kebab",
    "Noerrebro Shawarma",
    "Shawarma Grill House",
    "Kebabistan",
    "Kebab Spot",
    "Al Diwan",
    "Liban Kebab",
    "Den Fede Kebab",
    "Noerrebro Kebab House",
    "Café Kebabish",
    "Ali Baba Kebab",
    "King of Kebab",
    "Turkis Kebab",
    "Sultan Kebab",
    "Damascus Kebab",
    "Mellemøstens Kebab",
    "Saray Kebab",
    "Shawarma Express",
    "Kebab Corner",
    "Baba Kebab",
  ];

  // Create restaurants
  const createdRestaurants = await Promise.all(
    kebabShops.map((name, i) =>
      prisma.restaurant.create({
        data: {
          name,
          description: "Delicious kebab and shawarma in the heart of Nørrebro.",
          address: `Nørrebrogade ${100 + i}, København`,
          slug: name.toLowerCase().replace(/ /g, "-"),
          phone: `+45 12 34 56 ${i < 10 ? "0" + i : i}`,
          website: `https://${name.toLowerCase().replace(/ /g, "-")}.dk`,// Assuming you have 5 different kebab images 
        },
      })
    )
  );

  // Add 1-3 reviews for each restaurant
  for (const restaurant of createdRestaurants) {
    const reviewsData = [
      {
        restaurantId: restaurant.id,
        authorName: "Lars Nielsen",
        rating: 4 + (Math.random() > 0.5 ? 1 : 0),
        comment: "God kebab og hurtig service!",
      },
      {
        restaurantId: restaurant.id,
        authorName: "Maria Andersen",
        rating: 3 + (Math.random() > 0.5 ? 1 : 0),
        comment: "Lækker smag og hyggeligt sted.",
      },
      {
        restaurantId: restaurant.id,
        authorName: "Ahmed Hassan",
        rating: 5,
        comment: "Elsker deres kebab, kommer helt sikkert igen!",
      },
    ].slice(0, Math.floor(Math.random() * 10) + 1); // 1-3 reviews

    await prisma.review.createMany({
      data: reviewsData,
    });
  }

  console.log("✅ Seeded 20 real Nørrebro kebab places with reviews!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
