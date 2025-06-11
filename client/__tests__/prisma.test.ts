/**
 * @jest-environment node
 */


import { prisma } from "@/lib/prisma";





describe("Prisma integration", () => {
  const testEmail = "jest-user@example.com";

  beforeAll(async () => {
    // Ensure the user does not already exist
    await prisma.user.deleteMany({ where: { email: testEmail } });
  });

  it("creates a new user", async () => {
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        password: "hashedpassword123",
        firstName: "Jest",
        lastName: "Tester",
        role: { connect: { name: "USER" } }, // Assumes a role with name "USER" exists
      },
    });

    expect(user).toHaveProperty("id");
    expect(user.email).toBe(testEmail);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await prisma.$disconnect();
  });
});
