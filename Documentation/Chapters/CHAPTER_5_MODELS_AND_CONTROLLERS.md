# Summer Internship

---

## Chapter 5: Models & Controllers

`Models` are class files that represent a table in database, used by a `Controller` to
perform `CRUD Queries`: `create, read, update and delete`

`Controllers` are api `Routes` that use `HTTP Verbs: GET,POST,PUT,PATCH,DELETE`

---

#### packages introduced this chapter

- `npm install --save objection`

---

#### New configurations

- `.env`
    - `DOMAIN="http://127.0.0.1:8000"`


- `config.ts`
    - `export const DOMAIN = process.env.DOMAIN`


- `DIR:public/uploads/actors`
- `DIR:public/uploads/actors/thumbs`

---

#### Fixes of previous chapters

- `genre` seeder `biography-fi` value set to `biography`
- `genre` seeder `sci` value set to `sci-fi`

---

### 5.1 Models

[Objection.js](https://vincit.github.io/objection.js/) will be used as an **ORM (Object Relational Mapper)**, the
documentation is extensive with multiple ways and tools to achieve the end goal for this project

- create a directory `Modules` inside `src`

for a start the current dataset has 3 main `Modules` to work with:

1. `movies` create `Movie/movie.model.ts`
2. `actors` create `Actor/actor.model.ts`
3. `genres` create `Genre/genre.model.ts`

the other `tables` are relational tables usually don't need their own `model` unless the relation can be represented
as `standalone`

refer to each of the files to see how the model is created and setup to match `database migrations` also check [static-properties](https://vincit.github.io/objection.js/api/model/static-properties.html) page of the orm documentation for more details.

---

#### 5.1.1 Table name & columns

first thing defined in the model are the table it represents as it exists in the database:

```typescript
// Table name
static tableName = 'movies'

// Table columns
id!: string
title!: string | null
...
created_at!: Date | string
updated_at!: Date | string
```

---

#### 5.1.2 Hooks

functions defined by the orm that trigger before or after certain events on the database:

```typescript
// adds timestamps to model before insert
async $beforeInsert(qc: QueryContext) {
    this.created_at = new Date()
    this.updated_at = new Date()

    return super.$beforeInsert(qc) // this line is optional but it is good practice when maintaining models that use plugins 
}
```

---

#### 5.1.3 Relations

notice that all relations are defined as `ManyToMany` with one difference in relation of `movie_actors` with `extra` attribute `as`:

```typescript
// This object defines the relations to other models. The relationMappings
// property can be a thunk to prevent circular dependencies.
static relationMappings = () => ({
    movies: {
        relation: Model.ManyToManyRelation,
        modelClass: Movie,
        join: {
            from: 'actors.id',
            through: {
                from: 'movie_actors.actor_id',
                to: 'movie_actors.movie_id',
                extra: ['as']
            },
            to: 'movies.id'
        },
        // filter determines a query on the relationship, in this case we select a few columns not all from the relation
        filter: (qb: any) => qb.select('movies.id', 'movies.title', 'movies.img', 'movies.thumb', 'movie_actors.as')
    }
})
```

later on the project other relationship types will be explored as features are introduced

---

#### 5.1.4 Modifiers

modifiers are predefined queries that can be chained in the `Controllers` while retrieving data:

```typescript
static modifiers = {
    enabled(query: QueryBuilder<any>) {
        query.where('movies.is_disabled', false)
    }
}
```

this example is used to show only movies that have `is_disabled=false`, 
this is handy later on when authentication is introduced to separate public data from administration data


---

### 5.2 Controllers

Basically an express route with function that queries the data

start by adding the following files:

- `movies` create:
    - `Movie/movie.controller.public.ts`
    - `Movie/movie.controller.admin.ts`

the structure is simple, the controller name `Role+ModuleController` reflects which module + the role that will be using it,
within, are `async` functions for each operation required by the `api` in this case we have two requests:

- `index` returns an array of `results`
- `show` returns a single `result`

```typescript
export const AdminMovieController = {

    // View index of a model
    index: async (req, res, next) => {...},

     // View a single model
    show: async (req, res, next) => {...}
}
```

the parameters for each function `(req, res, next)` are used by express to make:

- `req` the `request` object coming `from` the client
- `res` the `response` object to be sent `to` the client
- `next` forwards the request to the next `middleware` in the `router`

---

#### 5.2.1 Express Router

when a user makes a request to `http://localhost:8000` 
express server translates this path into a route, in this case `/` in [Chapter 1](Documentation/Chapters/CHAPTER_1_PROJECT_SETUP.md) 
was setup to return `hello world`

the current goal is to build the following routes:

- publice routes:
    - `/movies` returns `enabled movies index`
    - `/movies/:id` returns `single movie` if it is enabled, the `:id` part is a `parameter` 


- admin routes:
    - `/admin/movies` returns `all movies index`
    - `/admin/movies/:id` returns `single movie` 


refer to [express routing](https://expressjs.com/en/guide/routing.html) page for more details, 
in this project we'll follow the express.Router section to build modular routes

---

#### 5.2.2 Creating Express Router

create the following file:
- `Movie/movie.routes.ts`

***inspect the file content in this chapter commit `git checkout chapter-05`***

```typescript
export const RoleMovieRoutes = (router, prefix) => {...}
```

there are two roles currently `public` and `admin` routes will each use the corresponding controller

there is a `TODO` comment added to remind us to add the remainder of controls to `admin` and structure the routes in clean syntax

the `(router, prefix)` arguments are for the express `Router` instance and `prefix` of `/admin` or `/` string


create the following directory under `src`:
- `Routes/index.ts`

***inspect the file content in this chapter commit `git checkout chapter-05`***

the short version below, but the file will contain `TODOS` and comments for more detailed router structure

```typescript
export const applyRoutes = (): Router => {

    const router = Router()

    AdminMovieRoutes(router, '/admin')
    PublicMovieRoutes(router, '')

    return router
}
```

finally in the `app.ts` file in `src` replace:

```typescript
app.use('/', (req, res)=>{
    res.send({msg: "hello world"})
})
```

with 

```typescript
app.use(applyRoutes())
```

don't forget to `import {applyRoutes} from './Routes'`

if you run `npm run dev` and try to call `curl --location --request GET 'http://127.0.0.1:8000/movies'` you get the error

```shell
Error: no database connection available for a query. You need to bind the model class or the query to a knex instance.
```

there are 2 problems here:
1. `objection` orm is not bound to the `knex` instance that is connecting to database
2. the error is not in a `json` format 

the first problem is solved by updating `src/index.ts`:

```typescript
import {knex}        from '../knexfile'
import {Model}       from 'objection'

const start = async () => {
    Model.knex(knex) // bind knex instance to objection
    app.listen(SERVER_PORT, () => console.log(`Server listening at http://localhost:${SERVER_PORT}`))
}
```

second problem is solved by adding an `Error Handler` middleware at the end of `Routes/index.ts`

```typescript
...

router.use(errorHandler)

return router
```

we will use the one provided by `objection` 
in their [recipes/error-handling](https://vincit.github.io/objection.js/recipes/error-handling.html#examples) page,
the file in this commit will have the esm `import` syntax because we're using typescript 

then add it as a final route in the `router`

---

##### the importance of Error Handler middleware

this middleware represents the `api` last resort of getting a readable response

in the controllers this is done when the `.catch(err => next(err))` block is triggered,
allowing the application to continue running without crashing

---

#### 5.2.3 Testing Routes in Postman

- make a `GET` request to `http://127.0.0.1:8000/movies`
- pick any id from the results, example: `b94a8f6b-ab87-4b11-b26e-b3036fbae6ec`
- make a `GET` request to `http://127.0.0.1:8000/movies/b94a8f6b-ab87-4b11-b26e-b3036fbae6ec`

---

# Tasks

1. Write about anything unusual on the two `GET` requests done in `5.2.3`
2. Disable some movies by switching their `is_disabled` to `true` see how it is done in this [Tutorial](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update/)
3. Make the two `GET` requests but for `/admin`
4. Request a `is_disabled=true` Movie from public `/` and note the response
5. Create the `controllers` and `routes` for `Actor` and `Genre` modules.
6. Add `Actor` and `Genre` routes to the main `Router` instance


