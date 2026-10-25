// src/db/seed.ts
import { prisma } from './prisma/prisma.js'

async function main() {
  await prisma.user.createMany({
    data: [
      {
        id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
        username: 'carlos_dev',
        email: 'carlos@ejemplo.com',
        passwordHash: '$2b$10$hashedpassword1',
        name: 'Carlos Gómez',
        isVerified: true,
      },
      {
        id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        username: 'ana_tech',
        email: 'ana@ejemplo.com',
        passwordHash: '$2b$10$hashedpassword2',
    	name: 'Ana Torres',
        isVerified: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seed executed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
