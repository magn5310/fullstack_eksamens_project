import { PrismaClient } from "@prisma/client";
// Import test lifecycle functions from Jest (or Vitest if you use that)


const prisma = new PrismaClient();

beforeAll(async () => {
  // Connect to the database
  await prisma.$connect();
}   );

afterAll(async () => {
  // Disconnect from the database
  await prisma.$disconnect();
});


afterEach(async () => {
    const tables = await prisma.$queryRawUnsafe<string[]>(`SELECT name FROM sqlite_master WHERE type='table'`);
    for (const table of tables) {
      if (table !== "_prisma_migrations") {
        await prisma.$executeRawUnsafe(`DELETE FROM "${table}"`);
      }
    }
  });


export default prisma;