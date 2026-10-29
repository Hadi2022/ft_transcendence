import { prisma } from "../src/db/prisma/prisma.ts";
import { createUser } from "../src/repositories/userRepository.ts";

async function testCreateUser() {

  let timestamp = Date.now();
  const testUser = {
    username: `dev_${timestamp}`,
    email: `dev_${timestamp}@example.com`,
    passwordHash: '$2b$10$hashedpasswordforexample123',
  };


  try {
    console.log('Creating user prueba .... \n');
    const created = await createUser(testUser);
    if ('passwordHash' in created)
      console.error("PasswordHash not filtered\n");
    else
      console.log("PasswordHash filtered\n");
    console.log(
      created.id,
      created.username,
      created.email,
    );
    let users = await prisma.user.findMany();

    console.log(`Total rows: ${users.length}`);
    console.table(
      users.map((u) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        createdAt: u.createdAt,
      }))
    );
    console.log('Creating user testEmail .... \n');
    try {
      timestamp = Date.now();
      const testEmail =
      {
        username: `dev_${timestamp}`,
        email: testUser.email,
        passwordHash: '$2b$10$hashedpasswordforexample123',
      };
      const testEmailUser = await createUser(testEmail);
    } catch (error) {
      console.error('Error', error)
    }
    console.log('Creating user testUsername .... \n');
    try {
      const testUsername =
      {
        username: testUser.username,
        email: `dev_${timestamp}@example.com`,
        passwordHash: '$2b$10$hashedpasswordforexample123',
      };

      const testUsernameUser = await createUser(testUsername);
    } catch (error) {
      console.error('Error', error)
    }
    users = await prisma.user.findMany();

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
  }
}


testCreateUser();
