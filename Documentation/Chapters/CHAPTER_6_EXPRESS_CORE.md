# Summer Internship

---

## Chapter 6: Express Core

The core of any `api` is user interaction, `querying`,
`sorting`, `filtering` and `limiting` of results to find information,
or `writing`,`editing`, or `omitting` of information

---

#### packages introduced this chapter

- `npm i -S cors multer`
- `npm i -D @types/cors @types/multer`

---

#### how to test this chapter

- `git pull origin master` get the latest updates from repository
- `git checkout chapter-06`
- `npm install`
- `npm run dev`
---

### Tasks of chapter 5

tasks in the previous chapter expose you to some concepts of `api` concepts

1. images are inaccessible `Static File Serving`
2. index result huge array `Pagination`
3. the movie genre name returns all languages `query params, default Locale Middleware`
4. public requesting disabled movie returns 404 NotFound error `RBAC Mocking`

---

### 5.1 API Versioning: Compatibility

consuming apis by multiple users introduces a fracture in usage, old devices with certain capabilities
may stop you from upgrading your software or adding new features.

this is where route prefixing comes in:

- instead of using `localhost:8000/movies`
- prefix it with `/api/v1` to get `localhost:8000/api/v1/movies`

this way, if the api is drastically changed the new routes can go to:

- `localhost:8000/api/v2/movies`

without breaking existing api consumers, those can be `users` or `machines`

---

### 5.2 [Serving static files in Express](https://expressjs.com/en/starter/static-files.html)

right now the api can only serve `responses` returned by the `controllers`
to enable access on static files such as `css`, `images` or `html`:

 ```
http://localhost:8000/uploads/movies/thumbs/thumb_tt0180093.jpg
http://localhost:8000/uploads/movies/tt0180093.jpg
http://localhost:8000/css/style.css
http://localhost:8000/index.html
 ```

above are `public` files that can be shared,
server generated documents like `invoices`, `user_report.pdf` can go
into `private` directory.

add express built in static middleware:

```javascript

app.use( // tells the express server to use a middleware
    express.static( // static files built-in middleware
        path.resolve(__dirname, '../', 'public')
        // node js api for file system path resolving 
    )
)
```

`__dirname` is a special `unix` variable to print the path to last
directory from where it is running in our case inside the app it resolves to `.`

`path.resolve(...)` is `Node.js` api so no need to install it from `npm`, its packaged as part of the runtime

check [Node.js API Docs](https://nodejs.org/dist/latest-v16.x/docs/api/) for details and
specifically the [Path api page](https://nodejs.org/dist/latest-v16.x/docs/api/path.html#pathresolvepaths)
on how `path` works internally

to make it practical and avoid writing deeply nested path resolvers like:

`path.resolve(__dirname, '../../../','movies', 'path')`

add a `config.ts` variable:

```javascript

import path from 'path'

...

export const PUBLIC_PATH = path.resolve(__dirname, '../public')
export const UPLOADS_PATH = path.resolve(__dirname, '../public/uploads')
```

now in `app.ts` enabling static file with the following:

```typescript
app.use(express.static(PUBLIC_PATH))
```

---

### 5.3 User input

`POST` and `PATCH` requests requires a `body` to create new instances
or update existing ones, there are:

1. `form-data`: used for `POST` and can handle `file` data types
2. `x-www-form-urlencoded`: used with `PATCH` and mostly handles text values
3. `raw json`: sends data as a json object

any request made to the api in its current state will not accept input,
to enable the server with `insert`, `update` capabilities there are middlewares:

#### [express.urlencoded()](http://expressjs.com/en/api.html#express.urlencoded)

#### [express.json](http://expressjs.com/en/api.html#express.json)

adding them to the app instance in `app.ts`

```typescript
app.use(express.json());
app.use(express.urlencoded({extended: true}))
```

working with `clients` on web or mobile add cors:

#### [cors](http://expressjs.com/en/resources/middleware/cors.html)

- `npm i -S cors`
- `npm i -D @types/cors`

```typescript
import cors from 'cors'

...

app.use(cors())

```

#### [multer](http://expressjs.com/en/resources/middleware/multer.html)

multer will handle file uploads and `form-data` parsing, it needs to be setup 
for `POST` requests with `file` fields

- `npm i -S multer`
- `npm i -D @types/multer`

Make a new file inside `src/Middlewares` named `multer.ts` with content:

```typescript
import multer from "multer"

export class Multer {
    static none = multer().none()
}
```

now inside any `router.post(...)` route we can use multer middleware with 
`Multer.none` none here referring to `form-data` only with no files, 
the content of `multer.ts` in this chapters' commit 
has another function that accepts a single `file`

---

### Notes

**Genre** & **Movie*** `models`, `routes` and `controllers` have been updated to have
full `CRUD` capabilities

**Actor** `routes` and `controllers` have been added

---

lastly, create the file
- `src/Types/express/index.d.ts`

this allows extending the `express` types with data we define for the api

content of the new `index.d.ts`

```typescript
declare namespace Express {
    interface Request {
        headers: any
    }
}
```


