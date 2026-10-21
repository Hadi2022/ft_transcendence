import 'dotenv/config';

export default {
  schema: 'prisma/schema.prisma',
  migrations: {
    directory: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
