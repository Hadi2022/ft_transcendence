require("dotenv").config();

module.exports = {
  schema: "src/db/prisma/schema.prisma",
  migrations:{
    seed: "src/db/seed.ts"
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
