// src/test-find-user.ts
import { findUserByUsername,findUserByEmail,findUserById, } from '../repositories/userRepository.ts'
import { prisma } from '../db/prisma/prisma.ts'



async function testLookUpMethods() {


  try {
    console.log('--- TEST: findUserById ---\n');
    // 1. Obtener un ID real directamente de la base de datos para la prueba
    const anyUser = await prisma.user.findFirst();

    if (!anyUser) {
      console.log('No users in DB.');
      return;
    }

    console.log(`ID selected: ${anyUser.id}\n`);

    // 2. Probar caso de éxito (usuario existente)
    console.log('1. Finding user exists...');
    const foundUser = await findUserById(anyUser.id);
    console.log(' Result:');
    console.log(foundUser);
	  console.log('\n');
    // 3. Probar caso con UUID inexistente
    console.log('\n2. Find with not exits UUID ...');
    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    const notFound = await findUserById(nonExistentId);

    if (notFound === null) {
      console.log('Not found');
    } else {
      console.error('Error return :', notFound);
    }
    const badUUID = '0';
    try{
    const badUUIDError = await findUserById(badUUID);
    }
    catch(error)
    {
      console.error(error)
    }
    console.log('--- TEST: findUserByEmail ---\n');
    // 1. Obtener un ID real directamente de la base de datos para la prueba
    const anyUserEmail = await prisma.user.findFirst();

    if (!anyUserEmail) {
      console.log('No users in DB.');
      return;
    }

    console.log(`Email selected: ${anyUser.email}\n`);

    // 2. Probar caso de éxito (usuario existente)
    console.log('1. Finding user exists...');
    const foundUserEmail = await findUserByEmail(anyUser.email);
    console.log(' Result:');
    console.log(foundUserEmail);
	  console.log('\n');
    // 3. Validar exclusión del hash
    if (foundUserEmail && 'passwordHash' in foundUserEmail) {
      console.error('Error Pass not filtered.');
    } else {
      console.log('ok Pass filtered.');
    }
    // 3. Probar caso con email inexistente
    console.log('\n2. Find with not exits email ...');
    const nonExistentEmail = 'no_existe@noexiste.com';
    const notFoundEmail = await findUserByEmail(nonExistentEmail);

    if (notFoundEmail === null) {
      console.log('Not found');
    } else {
      console.error('Error return :', notFoundEmail);
    }
    const badEmail = '0';
    try{
    const badEmailError = await findUserByEmail(badEmail);
    }
    catch(error)
    {
      console.error(error)
    }

   console.log('--- TEST: findUserByUsername ---\n');
    // 1. Obtener un ID real directamente de la base de datos para la prueba
    const anyUserUsername = await prisma.user.findFirst();

    if (!anyUserUsername) {
      console.log('No users in DB.');
      return;
    }

    console.log(`Username selected: ${anyUser.username}\n`);

    // 2. Probar caso de éxito (usuario existente)
    console.log('1. Finding user exists...');
    const foundUserUsername = await findUserByUsername(anyUser.username);
    console.log(' Result:');
    console.log(foundUserUsername);
	  console.log('\n');
    // 3. Validar exclusión del hash
    if (foundUserUsername && 'passwordHash' in foundUserUsername) {
      console.error('Error Pass not filtered.');
    } else {
      console.log('ok Pass filtered.');
    }
    // 3. Probar caso con email inexistente
    console.log('\n2. Find with not exits username ...');
    const nonExistentUsername = 'no_existe';
    const notFoundUsername = await findUserByUsername(nonExistentUsername);

    if (notFoundUsername === null) {
      console.log('Not found');
    } else {
      console.error('Error return :', notFoundEmail);
    }


  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n--- END ---');
  }
}



testLookUpMethods();
