# Summer Internship 

---

## Chapter 1: Project Setup

- run `npm init -y`
- run `git init`
- create `.gitignore` file in root project directory with content:

    ```gitignore
    .git
    .env
    .idea
    .thumb
    .vscode
    .DS_STORE
    
    build/*
    public/*
    node_modules
    
    !build/.gitignore
    
    ```
- create `src` directory
- create `Types` directory inside `src` to host typescript types of project
- create `build` directory
- create `.gitignore` file inside `build` with content:

    ```gitignore
    *
    !.gitignore
    ```

- create `public` directory
- `npm install --save-dev typescript ts-node nodemon`
- add `tsc` script to `package.json`
- run `npm run tsc -- --init` ( -- sets the following as argument for the command )
- enable the following modules in `tsconfig.json`:

    ```json
    {
        "compilerOptions": {
            "target": "es2016",
            "experimentalDecorators": true,
            "emitDecoratorMetadata": true,
            "module": "commonjs",
            "baseUrl": "./src",
            "typeRoots": [
                "./src/Types",
                "node_modules/@types"
            ],
            "resolveJsonModule": true,
            "outDir": "./build",
            "esModuleInterop": true,
            "forceConsistentCasingInFileNames": true,
            "strict": true,
            "noImplicitAny": true,
            "skipDefaultLibCheck": true,
            "skipLibCheck": true
        },
        "include": [
            "src/**/*",
            "Database/**/*"
        ],
        "exclude": [
            "node_modules",
            "**/*.spec.ts"
        ]
    }
    ```

- `npm install --save-dev typescript ts-node nodemon @types/express @types/node`
- `npm install --save express dotenv`

- create `.env` on `root` directory with content:

    ```dotenv
    SERVER_PORT=8000
    ```

- create `config.ts` inside `src` directory with content:

    ```typescript
    export const SERVER_PORT = process.env.SERVER_PORT
    ```

- create `app.ts` inside `src` directory with content:

    ```typescript
    import express, {Application} from 'express'
    
    export const app: Application = express()
    ```

- create `index.ts` inside `src` directory with content:

    ```typescript
    import 'dotenv/config'
    import {app}         from './app'
    import {SERVER_PORT} from './config'
    
    const start = async () => {
        app.listen(SERVER_PORT, () => console.log(`Server listening at http://localhost:${SERVER_PORT}`))
    }
    
    // Running the App
    start().catch(err => console.log(err))
    
    ```

- run `npm run tsc && node build/index.js`

    ```bash
    λ npm run tsc && node build/index.js
    
    > movie_backendd@1.0.0 tsc
    > tsc
    
    Server listening at http://localhost:8000
    ```

- visit `http://localhost:8000/` on your browser, you should see:

    ```html
    Cannot GET /
    ```
- add the following to end of file `app.ts`:

    ```typescript
    app.use('/', (req, res)=>{
        res.send({msg: "hello world"})
    })
    ```

- kill the process in commandline using `Ctrl+C` and run `npm run tsc && node build/index.js` again
- refresh `http://localhost:8000/` on your browser, you should see a json response with `msg`:`hello world`
- to avoid doing the last two steps on every update add nodemon to `scripts` in `package.json`:

    ```json
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "tsc": "tsc",
        "dev": "nodemon --watch \"src/**\" --ext \"ts\" --ignore \"src/**/*.spec.ts\" --exec ts-node \"src/index.ts\" "
    },
    ```
