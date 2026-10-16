
const prisma = require('prisma');

const getHelloWorld = () => {
    return prisma.hello
}

module.exports = getHelloWorld;