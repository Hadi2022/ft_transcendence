*This project has been created as part of the 42 curriculum by iherman-, apestana, aortigos, manuelfe...*

## Description

## Instructions

## Resources

## Team Information

- **Product Owner**: aortigos
Defines the priorities, maintains the backlog, and validates completed work.
- **Tech Lead**: iherman-
Defines the architecture and technical stack, sets code standards, and reviews critical changes.
- **Scrum Master**: apestana
Organizes meetings and planning, tracks progress and deadlines, and helps remove blockers.
- **Developers**: aortigos, iherman-, apestana, manuelfe
Write code for features and modules, take part in code reviews, test their work, and document it.

## Project Management

- **Meetings**: We started with two meetings per week. After two weeks, once we were used to working together as a team, we moved to one weekly meeting.
- **Task organization**: We use a backlog in Notion to organize and track every task.
- **Communication**: We use Discord for every day communication.


## Technical Stack

- **Frontend**: React + Vite
- **Backend**: Express
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Infrastructure**: Docker + Docker Compose + ...

Libraries
- **Routing**: React Router
- **Validation**: Zod (frontend and backend)
- **Styling**: TailwindCSS

### Justification

...

## Database Schema

This guide documents the base architecture for the project’s development and data persistence environment, utilizing Docker containers with volume persistence, secure credential management via Docker Secrets, and object-relational mapping through Prisma ORM v7.

### Directory Structure

backend/
├── .secrets/
│   ├── postgres_user.txt
│   └── postgres_password.txt
├── src/
│   └── db/
│       └── prisma/
│           └── schema.prisma
├── .env
├── .gitignore
├── docker-compose.yml
├── package.json
├── prisma.config.ts
└── tsconfig.json

### Secrets and Environment Variable Management

To prevent the leakage of credentials into version control (Git) or configuration files, two layers of configuration are used.

#### Secrets Files (.secrets/)

Plain-text files containing the raw values. It is critical to create them without trailing line breaks (-n) to avoid authentication failures in PostgreSQL.

#### Local Configuration File (.env)

Contains the environment parameters and the formatted connection string for the development CLI.

### Prisma ORM v7 Configuration

Starting with version 7 of Prisma, the `url` property is decoupled from the `schema.prisma` file and moved to the bootstrap configuration file (`prisma.config.ts`), while the active connection utilizes driver adapters.

#### Installation of Dependencies

npm install -D prisma@^7.0.0 typescript @types/node @types/pg tsx dotenv

npm install @prisma/client@^7.0.0 pg @prisma/adapter-pg dotenv

#### Prisma Configuration File (prisma.config.ts)

Located at the root of the project, it tells the Prisma CLI where the schema resides and which credentials to use when migrating or inspecting.

#### Data Schema (src/db/prisma/schema.prisma)

The datasource block defines only the provider. The model implements the base tables for users, sessions (with hash tokens and metadata), posts, categories, comments, and likes.

#### Client Instantiation in the Application (src/lib/prisma.ts)

In Prisma v7, for direct connections to PostgreSQL the client must be initialized by injecting the PrismaPg adapter instance

### Routine Operations

#### Apply Migration

npx prisma migrate dev --name <name>

Detects changes in schema.prisma, generates the SQL script, and updates the client.

#### Explore Data

npx prisma studio

Opens a local graphical interface at http://localhost:5555

## Modules

## Individual Contributions


