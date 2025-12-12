import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { email: 'admin@example.com', password: '123', role: 'admin' },
      { email: 'member@example.com', password: '123', role: 'member' }
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => console.log('Seed completed'))
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
