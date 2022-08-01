# Summer Internship

---

## Chapter 3: Migrations & Seeders

---

### 3.1 Migrations

The state and control of database schema, migrations are consistent steps to reach the final schema design
it can modify, remove or add new tables,fields,checks, constraints ...etc

refer to `knex` documentation of [migration-cli](https://knexjs.org/guide/migrations.html#migration-cli) for list of
commands

migrations created by default has two functions, `up` and `down` but no sample inside, to save time add a stub file with
most common fields to be used:

- create `migration.stub` file inside `Database` directory
- add `stub` property to `migrations` object inside `knexfile.ts`:

    ```typescript
    migrations: {
        ...
        stub: 'Database/migration.stub'
    },
    ```

- add the content of `migration.stub`

    ```typescript
    import {Knex} from "knex"
    
    const table_name = 'table'
    
    export async function up(knex: Knex): Promise<void> {
        return knex.schema.createTable(table_name, (table) => {
            table.increments('id', {primaryKey: true})
            table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
            table.string('name').nullable()
            table.boolean('is_disabled').defaultTo(false).notNullable()
            table.specificType('location', 'geography(point, 4326)').nullable()
            table.timestamp('created_at', {useTz: false}).defaultTo(knex.raw('now()')).notNullable()
            table.timestamp('updated_at', {useTz: false}).defaultTo(knex.raw('now()')).notNullable()
        })
    }
    
    export async function down(knex: Knex): Promise<void> {
        return knex.schema.dropTableIfExists(table_name)
    }
    ```

---

#### 3.1.1 Migration stub breakdown

- `up` function will modify the schema when running `knex migrate:latest` or `knex migrate:up` here it will first,
  create a `table` and add a few `columns` to it:
    - first `id` is a standard `incrementing` integer eg: 1,2,3...
    - second `id` is a `uuid` type, set by `.primary()` and default value of a `raw expression`
    - `name` a nullable string
    - `is_disabled` a none nullable boolean with default value `false`
    - `location` specific type applied by an extension added to database `postgis` ***(Geography Information System)***
      more on this later
    - timestamps `created_at` and `updated_at` without `timezone`
- `down` function drops the table if it exists (always the opposite action of `up`)

---

#### 3.1.2 Raw Expressions

SQL provides its own helper functions, depending on the client, in this case `postgresql` and those can be set
as `default` values in migrations.

- connect to postgres `λ psql -U postgres -d movie_rental`
    - tryout the following statements:
        - `movie_rental=# SELECT gen_random_uuid();`
          <details>
            <summary>result</summary>

             ```sql
                          gen_random_uuid
             --------------------------------------
             7580517f-af40-47c3-92e8-d9431447f5bc
             (1 row)
             ```
          </details>

        - `movie_rental=# SELECT now();`
          <details>
            <summary>result</summary>

             ```sql
                        now
             -------------------------------
             2022-08-01 22:06:54.394779+02
             (1 row)
             ```
          </details>

        - `movie_rental=# SELECT CURRENT_DATE + interval '3 days'`
          <details>
            <summary>result</summary>

             ```sql
                   ?column?
             ---------------------
             2022-08-04 00:00:00
             (1 row)
             ```
          </details>

---

#### 3.1.3 Applying Migrations

the first `create_movies_table` migration already done
to apply a migration run `knex migrate:up` or `knex migrate:latest` and see the following:

```shell
λ knex migrate:up
Requiring external module ts-node/register
Batch 1 ran the following migrations:
20220801162523_create_movies_table.ts
```

- connect to postgres `λ psql -U postgres -d movie_rental` and see the result of `\dt`

```sql
movie_rental=# \dt
              List of relations
 Schema |      Name       | Type  |  Owner
--------+-----------------+-------+----------
 public | migrations      | table | postgres
 public | migrations_lock | table | postgres
 public | movies          | table | postgres
(3 rows) 
```

- run `knex migrate:down` or `knex migrate:rollback` and see the data tables inside `postgres`

---

### 3.2 Seeders

a seed of database is the initial data to start with, like the first admin user or defined sets like cities, or
categories

knex runs seeder files sorted by name in the `Database/Seeders` directory you can either number seeder files as:

- `01_CitySeeder.ts`
- `02_UserSeeder.ts`

or add timestamp prefix when running `knex seed:make`

- add `timestampFilenamePrefix` property to `seeds` object inside `knexfile.ts`:

    ```typescript
    migrations: {
        ...
        timestampFilenamePrefix: true
    },
    ```
- now running `knex seed:make` results in:

    ```shell
    λ knex seed:make MovieSeeder
    Requiring external module ts-node/register
    Created seed file: C:\summer-internship-backend\Database\Seeders\20220801190749_MovieSeeder.ts
    ```
- `movies` table has an `image` + `thumb` attributes so prepare a public directory that will hold files `uploads`
    - create `public/uploads/movies/thumbs` directory tree
    - create `.gitignore` inside `thumbs` with content
      ```shell
      *
      !.gitignore
      ```

    - create `.gitignore` inside `movies` with content
      ```shell
      *
      !thumbs
      !.gitignore
      ```

    - edit root `.gitignore`
      ```shell
      - public/*
      + public/uploads/*
      + !public/uploads/movies
      ```
- add data to seeder, reference
  file [20220801190749_MovieSeeder.ts](../../Database/Seeders/20220801190749_MovieSeeder.ts)
- run `knex seed:run`
- connect to postgres `λ psql -U postgres -d movie_rental` and run:
    - `movie_rental=# select id,title,running_time,created_at from movies;`
       <details>
         <summary>result</summary>

         ```sql
         id                  |                       title                       | running_time |         created_at
         --------------------------------------+---------------------------------------------------+--------------+----------------------------
         a978e32a-5946-411e-87f8-72a9ef3552d0 | The Lord of the Rings: The Fellowship of the Ring | 02:58:00     | 2022-08-02 00:57:25.859226
         89c9dfa1-0f26-4da2-9c69-83976f83af75 | The Lord of the Rings: The Two Towers             | 02:59:00     | 2022-08-02 00:57:25.859226
         105dcb6a-8311-44c1-bea3-132f0648788a | The Lord of the Rings: The Return of the King     | 03:21:00     | 2022-08-02 00:57:25.859226
         e6225bed-a15e-49ec-b9a1-2d333cca374a | Spirited Away                                     | 02:05:00     | 2022-08-02 00:57:25.859226
         (4 rows)
         ```
       </details>
