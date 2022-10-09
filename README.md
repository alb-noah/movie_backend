# Internship

an instructional backend project for internship at Sadeem Tech developed by [Sadeem Tech](https://sadeem-tech.com/)

![sadeem-folder](./art/folder-icon.png)

### resources:

- [node](https://nodejs.org/en/docs/)
- [typescript](https://www.typescriptlang.org/)
- [express](https://expressjs.com/)
- [knex](https://knexjs.org/)
- [objection](https://vincit.github.io/objection.js/)
- [postgresql](https://www.postgresqltutorial.com/)

# Documentation

when going through chapters remember to `npm install` as packages are introduced 

- [Chapter 0: Prerequisites](Documentation/Chapters/CHAPTER_0_PREREQUISITES.md)
- [Chapter 1: Project Setup](Documentation/Chapters/CHAPTER_1_PROJECT_SETUP.md)
- [Chapter 2: Connecting Database](Documentation/Chapters/CHAPTER_2_CONNECTING_DATABASE.md)
- [Chapter 3: Migrations & Seeders](Documentation/Chapters/CHAPTER_3_MIGRATIONS_AND_SEEDERS.md)
- [Chapter 4: Dataset](Documentation/Chapters/CHAPTER_4_DATASET.md)
- [Chapter 5: Models & Controllers](Documentation/Chapters/CHAPTER_5_MODELS_AND_CONTROLLERS.md)
- [Chapter 6: Express Core](Documentation/Chapters/CHAPTER_6_EXPRESS_CORE.md)

## Setup

1. Set environment `.env` 
2. `npm install`
3. `knex migrate:latest`
4. `knex seed:run`
5. `npm run dev`

---

## list of commands:

---

## Knex

---

### Migrations:

- `knex migrate:list`
- `knex migrate:up`
- `knex migrate:down`
- `knex migrate:latest`
- `knex migrate:rollback --all`
- `knex migrate:up 001_migration_name.ts`
- `knex migrate:make create_tablename_table`

---

### Seeders:

- `knex seed:make TableSeeder`
- `knex seed:run`
- `knex seed:run --specific=TableSeeder.ts`

---  
