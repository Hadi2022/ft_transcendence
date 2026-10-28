import { use } from 'react';
import { prisma } from '../db/prisma/prisma.ts';
import { createUser } from '../services/userService.ts';

async function testQuery() {
  try {
    console.log('Conecting to database...\n');

    // Consulta de prueba: trae todos los usuarios con sus campos principales

    const users = await prisma.user.findMany();

    console.log(`Total rows: ${users.length}`);
    console.table(
		users.map((u) => ({
			id: u.id,
			username: u.username,
			email: u.email,
			createdAt: u.createdAt,
		}))
	);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testQuery();
