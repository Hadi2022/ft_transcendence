import { use } from 'react';
import { prisma } from './db/prisma/prisma.js';
import { createUser } from './services/userService.ts';
/*
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
*/
async function testCreateUser() {
  const prueba =
  {
    username : 'prueba',
    email: 'prueba@prueba.com',
    password: '$2b$10$hashedpasswordforexample123',
  };
  const pruebaBefore =
  {
    username : 'prueba1',
    email: 'prueba@prueba.com',
    password: '$2b$10$hashedpasswordforexample123',
  };

  try
  {
    console.log('Creating user prueba .... \n');
    const created = await createUser(prueba);
    if ('passwordHash' in created)
        console.error("PasswordHash not filtered\n");
    else
      console.log("PasswordHash filtered\n");
    console.log(
      created.id,
      created.username,
			created.email,
    );
    console.log('Creating user pruebaBefore .... \n');
    const createdBefore = await createUser(pruebaBefore);
    if ('passwordHash' in created)
        console.error("PasswordHash not filtered\n");
    else
      console.log("PasswordHash filtered\n");
    console.log(
      createdBefore.id,
      createdBefore.username,
			createdBefore.email,
    )

  }catch(error)
  {
    console.error('Error:', error);
  }
}


testCreateUser();
