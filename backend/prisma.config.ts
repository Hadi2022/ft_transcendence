require("dotenv").config();

module.exports = {
  schema: "src/db/prisma/schema.prisma",
//  migrations:{directory:'src/db/prisma/migrations'},
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
