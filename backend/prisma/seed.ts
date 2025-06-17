// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/lib/auth";

const prisma = new PrismaClient();

const unsplashImages = ["https://images.unsplash.com/photo-1633321702518-7feccafb94d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80", "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80", "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80", "https://images.unsplash.com/photo-1684864115205-242c064363e6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1583060095186-852adde6b819?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80", "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80", "https://images.unsplash.com/photo-1638537125835-82acb38d3531?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGtlYmFifGVufDB8fDB8fHww", "https://images.unsplash.com/photo-1633436375795-12b3b339712f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"];

let imageIndex = 0;
const getNextImage = () => unsplashImages[imageIndex++ % unsplashImages.length];

async function main() {
  console.log("🌱 Starting database seed...");

  // Slet eksisterende data (i rigtig rækkefølge pga. relations)
  await prisma.review.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  console.log("🗑️  Cleared existing data");

  // Opret roller
  const adminRole = await prisma.role.create({
    data: {
      name: "Admin",
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: "User",
    },
  });

  const ownerRole = await prisma.role.create({
    data: {
      name: "restaurant owner",
    },
  });

  console.log("👥 Created roles");

  // Opret brugere
  const admin = await prisma.user.create({
    data: {
      email: "admin@kebab.dk",
      firstName: "Admin",
      lastName: "Andersen",
      password: await hashPassword("Password_1"),
      roleId: adminRole.id,
    },
  });

  const lars = await prisma.user.create({
    data: {
      email: "lars@example.dk",
      firstName: "Lars",
      lastName: "Nielsen",
      password: await hashPassword("Password_1"),
      roleId: userRole.id,
    },
  });

  const maria = await prisma.user.create({
    data: {
      email: "maria@example.dk",
      firstName: "Maria",
      lastName: "Andersen",
      password: await hashPassword("Password_1"),
      roleId: userRole.id,
    },
  });

  const ahmed = await prisma.user.create({
    data: {
      email: "ahmed@example.dk",
      firstName: "Ahmed",
      lastName: "Hassan",
      password: await hashPassword("Password_1"),
      roleId: userRole.id,
    },
  });

  // Opret restaurant ejere
  const sofie = await prisma.user.create({
    data: {
      email: "sofie@example.dk",
      firstName: "Sofie",
      lastName: "Larsen",
      password: await hashPassword("Password_1"),
      roleId: ownerRole.id, // Rettet fra moderatorRole til ownerRole
    },
  });

  const mikkel = await prisma.user.create({
    data: {
      email: "mikkel@example.dk",
      firstName: "Mikkel",
      lastName: "Jensen",
      password: await hashPassword("Password_1"),
      roleId: userRole.id,
    },
  });

  const anna = await prisma.user.create({
    data: {
      email: "anna@example.dk",
      firstName: "Anna",
      lastName: "Christensen",
      password: await hashPassword("Password_1"),
      roleId: userRole.id,
    },
  });

  const peter = await prisma.user.create({
    data: {
      email: "peter@example.dk",
      firstName: "Peter",
      lastName: "Rasmussen",
      password: await hashPassword("Password_1"),
      roleId: userRole.id,
    },
  });

  const mette = await prisma.user.create({
    data: {
      email: "mette@example.dk",
      firstName: "Mette",
      lastName: "Sørensen",
      password: await hashPassword("Password_1"),
      roleId: userRole.id,
    },
  });

  const kasper = await prisma.user.create({
    data: {
      email: "kasper@example.dk",
      firstName: "Kasper",
      lastName: "Pedersen",
      password: await hashPassword("Password_1"),
      roleId: userRole.id,
    },
  });

  const lise = await prisma.user.create({
    data: {
      email: "lise@example.dk",
      firstName: "Lise",
      lastName: "Hansen",
      password: await hashPassword("Password_1"),
      roleId: ownerRole.id, // Rettet fra moderatorRole til ownerRole
    },
  });

  const thomas = await prisma.user.create({
    data: {
      email: "thomas@example.dk",
      firstName: "Thomas",
      lastName: "Mortensen",
      password: await hashPassword("Password_1"),
      roleId: userRole.id,
    },
  });

  console.log("👤 Created users");

  // Opret restauranter - nu med ownerId påkrævet

  const torvets = await prisma.restaurant.create({
    data: {
      name: "Torvets Kebab",
      address: "Torvet 1, 1208 København K",
      slug: "torvets-kebab",
      description: "Den bedste kebab i København! Vi har serveret autentisk mellemøstlig mad siden 1998. Vores hemmelige sauce og hjemmelavede brød gør os unikke.",
      openHours: "Man-Søn: 11:00-23:00",
      phone: "+45 33 12 34 56",
      website: "https://torvets-kebab.dk",
      ownerId: sofie.id, // Tilføjet påkrævet ownerId
      imageUrl: getNextImage(), // Tilføjet billede
    },
  });

  const norrebro = await prisma.restaurant.create({
    data: {
      name: "Nørrebro Shawarma",
      address: "Nørrebrogade 123, 2200 København N",
      slug: "norrebro-shawarma",
      description: "Autentisk mellemøstlige smagsoplevelser i hjertet af Nørrebro. Familie-drevet restaurant med 25 års erfaring.",
      openHours: "Man-Tors: 12:00-22:00, Fre-Søn: 12:00-24:00",
      phone: "+45 35 87 65 43",
      website: "https://norrebro-shawarma.dk",
      ownerId: lise.id, // Tilføjet påkrævet ownerId
      imageUrl: getNextImage(),
    },
  });

  const istanbul = await prisma.restaurant.create({
    data: {
      name: "Istanbul Grill",
      address: "Vesterbrogade 45, 1620 København V",
      slug: "istanbul-grill",
      description: "Traditionel tyrkisk cuisine med moderne twist. Vores grill-specialiteter tilberedes med friske ingredienser dagligt.",
      openHours: "Tir-Søn: 16:00-23:00 (Lukket mandag)",
      phone: "+45 33 45 67 89",
      website: "https://istanbul-grill.dk",
      ownerId: admin.id,
      imageUrl: getNextImage(),
    },
  });

  const aleppo = await prisma.restaurant.create({
    data: {
      name: "Aleppo Kitchen",
      address: "Amager Landevej 77, 2770 Kastrup",
      slug: "aleppo-kitchen",
      description: "Syrisk familierestaurant der bringer smagen af Aleppo til Danmark. Hjemmelavet falafel og shawarma hver dag.",
      openHours: "Man-Søn: 11:30-22:30",
      phone: "+45 32 98 76 54",
      website: "https://aleppo-kitchen.dk",
      ownerId: sofie.id,
      imageUrl: getNextImage(),
    },
  });

  const beirut = await prisma.restaurant.create({
    data: {
      name: "Beirut Express",
      address: "Frederiksberg Allé 12, 1820 Frederiksberg",
      slug: "beirut-express",
      description: "Hurtig og lækker libanesisk mad. Perfekt til frokost eller en hurtig middag. Vegetarvenlige muligheder.",
      openHours: "Man-Søn: 10:00-21:00",
      phone: "+45 38 12 34 67",
      website: "https://beirut-express.dk",
      ownerId: lise.id,
      imageUrl: getNextImage(),
    },
  });

  const sultan = await prisma.restaurant.create({
    data: {
      name: "Sultan Kebab",
      address: "Strøget 88, 1160 København K",
      slug: "sultan-kebab",
      description: "Centralt beliggende kebab restaurant med stor portion og gode priser. Populær blandt turister og lokale.",
      openHours: "Man-Søn: 10:00-02:00",
      phone: "+45 33 91 23 45",
      website: "https://sultan-kebab.dk",
      ownerId: admin.id,
      imageUrl: getNextImage(),
    },
  });

  const babylon = await prisma.restaurant.create({
    data: {
      name: "Babylon Shawarma",
      address: "Istedgade 77, 1650 København V",
      slug: "babylon-shawarma",
      description: "Irakisk shawarma i autentiske omgivelser. Hjemmebagt fladbrød og marineret kød gør forskellen.",
      openHours: "Ons-Søn: 15:00-22:00 (Lukket man-tir)",
      phone: "+45 33 22 66 88",
      website: "https://babylon-shawarma.dk",
      ownerId: sofie.id,
      imageUrl: getNextImage(),
    },
  });

  const damascus = await prisma.restaurant.create({
    data: {
      name: "Damascus Grill",
      address: "Jagtvej 156, 2200 København N",
      slug: "damascus-grill",
      description: "Syrisk grill restaurant med specialitet i lammekebab. Familiær atmosfære og hjemmelavet hummus.",
      openHours: "Man-Søn: 12:00-23:00",
      phone: "+45 35 36 74 12",
      website: "https://damascus-grill.dk",
      ownerId: lise.id,
      imageUrl: getNextImage(),
    },
  });

  const antalya = await prisma.restaurant.create({
    data: {
      name: "Antalya Kitchen",
      address: "Amagerbrogade 45, 2300 København S",
      slug: "antalya-kitchen",
      description: "Tyrkisk køkken med fokus på grillretter og pizza. Stor menu med noget for enhver smag.",
      openHours: "Man-Søn: 11:00-24:00",
      phone: "+45 32 54 87 96",
      website: "https://antalya-kitchen.dk",
      ownerId: admin.id,
      imageUrl: getNextImage(),
    },
  });

  const palmyra = await prisma.restaurant.create({
    data: {
      name: "Palmyra Palace",
      address: "Sankt Hans Torv 3, 2200 København N",
      slug: "palmyra-palace",
      description: "Elegant syrisk restaurant med traditionelle retter og moderne tilberedning. Perfekt til både frokost og middag.",
      openHours: "Tir-Søn: 11:30-22:30 (Lukket mandag)",
      phone: "+45 35 37 19 28",
      website: "https://palmyra-palace.dk",
      ownerId: sofie.id,
      imageUrl: getNextImage(),
    },
  });

  const marrakech = await prisma.restaurant.create({
    data: {
      name: "Marrakech Grill",
      address: "Gothersgade 21, 1123 København K",
      slug: "marrakech-grill",
      description: "Marokkansk inspireret grill restaurant. Krydret kød, frisk salat og varm fladbrød serveret i hyggelige omgivelser.",
      openHours: "Man-Søn: 12:00-22:00",
      phone: "+45 33 14 56 78",
      website: "https://marrakech-grill.dk",
      ownerId: lise.id,
      imageUrl: getNextImage(),
    },
  });

  console.log("🏪 Created restaurants");

  // Opret reviews - nu med comment felt tilføjet
  const reviews = [];

  reviews.push(
    await prisma.review.create({
      data: {
        restaurantId: torvets.id,
        authorId: lars.id,
        tasteScore: 5,
        serviceScore: 5,
        priceScore: 4,
        title: "Fantastisk oplevelse!",
        comment: "Maden var lækker, og personalet var meget venlige. Kan varmt anbefales!",
      },
    })
  );

  reviews.push(
    await prisma.review.create({
      data: {
        restaurantId: torvets.id,
        authorId: maria.id,
        tasteScore: 4,
        serviceScore: 3,
        priceScore: 4,
        title: "Rigtig god kebab",
        comment: "Kødet var mørt, og saucen var perfekt krydret. Dog ventede vi lidt længe på maden.",
      },
    })
  );

  reviews.push(
    await prisma.review.create({
      data: {
        restaurantId: norrebro.id,
        authorId: ahmed.id,
        tasteScore: 5,
        serviceScore: 5,
        priceScore: 5,
        title: "Føler mig hjemme",
        comment: "Elsker at komme her! Maden smager som i hjemlandet, og personalet er altid venlige.",
      },
    })
  );

  reviews.push(
    await prisma.review.create({
      data: {
        restaurantId: istanbul.id,
        authorId: sofie.id,
        tasteScore: 3,
        serviceScore: 3,
        priceScore: 3,
        title: "Okay mad",
        comment: "Maden var gennemsnitlig. Ikke noget særlig",
      },
    })
  );

  reviews.push(
    await prisma.review.create({
      data: {
        restaurantId: aleppo.id,
        authorId: mikkel.id,
        tasteScore: 5,
        serviceScore: 4,
        priceScore: 4,
        title: "Autentisk syrisk mad",
        comment: "Elsker deres falafel og hummus! Virkelig autentisk smag. Mah drillah!",
      },
    })
  );

  reviews.push(
    await prisma.review.create({
      data: {
        restaurantId: beirut.id,
        authorId: anna.id,
        tasteScore: 5,
        serviceScore: 5,
        priceScore: 5,
        title: "Perfekt frokoststed",
        comment: "Hurtig service og lækker mad. Deres shawarma er fantastisk!",
      },
    })
  );

  reviews.push(
    await prisma.review.create({
      data: {
        restaurantId: sultan.id,
        authorId: peter.id,
        tasteScore: 2,
        serviceScore: 3,
        priceScore: 4,
        title: "Store portioner, okay smag",
        comment: "Maden var ikke så god som forventet. Portionerne var dog store, så det var fint til prisen.",
      },
    })
  );

  reviews.push(
    await prisma.review.create({
      data: {
        restaurantId: babylon.id,
        authorId: mette.id,
        tasteScore: 5,
        serviceScore: 4,
        priceScore: 4,
        title: "Bedste shawarma i København!",
        comment: "Elsker deres krydderier og den hjemmelavede sauce. Atmosfæren er også rigtig hyggelig.",
      },
    })
  );

  reviews.push(
    await prisma.review.create({
      data: {
        restaurantId: damascus.id,
        authorId: kasper.id,
        tasteScore: 4,
        serviceScore: 4,
        priceScore: 3,
        title: "Excellent lammekebab",
        comment: "Lammekebab'en var virkelig lækker",
      },
    })
  );

  reviews.push(
    await prisma.review.create({
      data: {
        restaurantId: antalya.id,
        authorId: lise.id,
        tasteScore: 2,
        serviceScore: 2,
        priceScore: 3,
        title: "Skuffende besøg",
        comment: "Maden var ikke særlig god, og servicen var langsom. Forventede mere baseret på anmeldelserne.",
      },
    })
  );

  reviews.push(
    await prisma.review.create({
      data: {
        restaurantId: palmyra.id,
        authorId: thomas.id,
        tasteScore: 5,
        serviceScore: 5,
        priceScore: 3,
        title: "Fantastisk atmosfære og mad",
        comment: "Elsker stemningen her! Maden er altid frisk og velsmagende. Perfekt til en date night.",
      },
    })
  );

  reviews.push(
    await prisma.review.create({
      data: {
        restaurantId: marrakech.id,
        authorId: lars.id,
        tasteScore: 4,
        serviceScore: 4,
        priceScore: 4,
        title: "Spændende smagsoplevelse",
        comment: "Krydderierne i maden var fantastiske! Elskede deres couscous og tagine. Vil helt sikkert komme igen.",
      },
    })
  );

  reviews.push(
    await prisma.review.create({
      data: {
        restaurantId: torvets.id,
        authorId: ahmed.id,
        tasteScore: 5,
        serviceScore: 5,
        priceScore: 4,
        title: "Kommer igen og igen",
        comment: "Elsker Torvets Kebab! Maden er altid lækker, og personalet er super venlige. Min favorit kebab-sted i København.",
      },
    })
  );

  reviews.push(
    await prisma.review.create({
      data: {
        restaurantId: norrebro.id,
        authorId: anna.id,
        tasteScore: 4,
        serviceScore: 4,
        priceScore: 5,
        title: "Solid valg i Nørrebro",
        comment: "God mad til en rimelig pris. Elsker deres vegetariske shawarma. Atmosfæren er også rigtig hyggelig.",
      },
    })
  );

  reviews.push(
    await prisma.review.create({
      data: {
        restaurantId: istanbul.id,
        authorId: mikkel.id,
        tasteScore: 4,
        serviceScore: 4,
        priceScore: 4,
        title: "God tyrkisk mad",
        comment: "Maden var lækker, og portionerne var store. Servicen kunne dog være bedre. Alt i alt en god oplevelse.",
      },
    })
  );

  reviews.push(
    await prisma.review.create({
      data: {
        restaurantId: babylon.id,
        authorId: peter.id,
        tasteScore: 5,
        serviceScore: 4,
        priceScore: 4,
        title: "Autentisk irakisk oplevelse",
        comment: "Elsker deres shawarma! Smagen minder mig om hjemlandet. Personalet er også meget venlige.",
      },
    })
  );

  reviews.push(
    await prisma.review.create({
      data: {
        restaurantId: damascus.id,
        authorId: maria.id,
        tasteScore: 3,
        serviceScore: 4,
        priceScore: 2,
        title: "Fin mad, men lidt dyrt",
        comment: "Maden var i orden morten skrrt brr brr patapim",
      },
    })
  );

  reviews.push(
    await prisma.review.create({
      data: {
        restaurantId: palmyra.id,
        authorId: sofie.id,
        tasteScore: 5,
        serviceScore: 5,
        priceScore: 3,
        title: "Bedste restaurant på Nørrebro",
        comment: "Elsker Palmyra! Maden (tung tung? s-s-sahur??) er altid lækker, og personalet er super venlige. Atmosfæren er også rigtig hyggelig.",
      },
    })
  );

  reviews.push(
    await prisma.review.create({
      data: {
        restaurantId: marrakech.id,
        authorId: mette.id,
        tasteScore: 4,
        serviceScore: 3,
        priceScore: 4,
        title: "Lækre krydderier",
        comment: "Maden var virkelig lækker, især deres tagine. Dog ventede vi lidt længe på maden.",
      },
    })
  );

  reviews.push(
    await prisma.review.create({
      data: {
        restaurantId: sultan.id,
        authorId: kasper.id,
        tasteScore: 2,
        serviceScore: 2,
        priceScore: 4,
        title: "For meget turist-fokus",
        comment: "Maden var ikke så god som forventet. Det føltes mere som en turistfælde end en ægte kebab-oplevelse.",
      },
    })
  );

  console.log("⭐ Created reviews");

  // Vis statistikker
  const userCount = await prisma.user.count();
  const restaurantCount = await prisma.restaurant.count();
  const reviewCount = await prisma.review.count();
  const imageCount = await prisma.restaurant.count({
    where: {
      imageUrl: {
        not: null,
      },
    },
  });

  console.log("\n✅ Database seed completed!");
  console.log(`📊 Created:`);
  console.log(`   👥 ${userCount} users`);
  console.log(`   🏪 ${restaurantCount} restaurants`);
  console.log(`   ⭐ ${reviewCount} reviews`);
  console.log(`   🖼️ ${imageCount} restaurants with images`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
