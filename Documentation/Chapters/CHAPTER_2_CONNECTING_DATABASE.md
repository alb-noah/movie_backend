# Summer Internship

---

## Chapter 2: Connecting Database

Configuring a connection with database

---

- connect to postgres `λ psql -U postgres`
- create the database inside postgres:
    ```sql
    postgres=# CREATE DATABASE movie_rental;
    CREATE DATABASE
    ```

---

- add to `.env` the following:
  ```dotenv
    DB_CLIENT=pg
    PG_HOST=localhost
    PG_PORT=5432
    PG_USER=postgres
    PG_PASSWORD=1
    PG_DATABASE=movie_rental
  ```
  
---

- add to `config.ts` the following:
- 
  ```typescript
  export const DB = {
    client: process.env.DB_CLIENT,
    port: process.env.PG_PORT,
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE
  }
  ```

---

Initialize and install required packages:

- run `npm install --save knex pg`
- run `npm install --save-dev @types/pg`
- run `knex init -x ts`
- edit `knexfile.ts` with the following:

    ```typescript
    import 'dotenv/config'
    import Knex from "knex"
    import {DB} from "./src/config"
    
    const config = {
        client: DB.client,
        connection: {
            host: DB.host,
            user: DB.user,
            password: DB.password,
            database: DB.database
        },
        searchPath: ['public'],
        pool: {
            min: 0,
            max: 10
        },
        migrations: {
            tableName: 'migrations',
            directory: "Database/Migrations",
        },
        seeds: {
            directory: "Database/Seeders"
        }
    }
    
    export const knex = Knex(config)
    export default config
    ```

To complete configuration:

- create directory `Database` in the project root with two more directories inside it `Migrations` and `Seeders`
- run `knex migrate:make create_movies_table` if successful you should see:

    ```shell
    Created Migration: C:\summer-internship-backend\Database\Migrations\20220801162316_create_movies_table.ts
    ```
- run `knex seed:make 01_MovieSeeder` if successful you should see:

    ```shell
    Created seed file: C:\summer-internship-backend\Database\Seeders\01_MovieSeeder.ts
    ```
