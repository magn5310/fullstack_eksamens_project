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

    it("retrieves the created user", async () => {
        const user = await prisma.user.findUnique({
        where: { email: testEmail },
        });
    
        expect(user).toBeDefined();
        expect(user?.email).toBe(testEmail);
        expect(user?.firstName).toBe("Jest");
        expect(user?.lastName).toBe("Tester");
    });

    it("updates the user's first name", async () => {
    const updatedUser = await prisma.user.update({
      where: { email: testEmail },
      data: { firstName: "UpdatedJest" },
    });
    expect(updatedUser).toBeDefined();
    expect(updatedUser.firstName).toBe("UpdatedJest");
    });
  it("deletes the user", async () => {
    const deletedUser = await prisma.user.delete({
      where: { email: testEmail },
    });
    expect(deletedUser).toBeDefined();
    expect(deletedUser.email).toBe(testEmail);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
    await prisma.$disconnect();
  });
});
    
         

