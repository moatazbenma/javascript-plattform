const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: "123",
      role: "admin"
    }
  });

  await prisma.user.create({
    data: {
      email: "member@example.com",
      password: "123",
      role: "member"
    }
  });
}

main()
  .then(() => {
    console.log("Seed completed");
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(() => prisma.$disconnect());
