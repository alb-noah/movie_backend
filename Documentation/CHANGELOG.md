# Changelog

---

#### 2022-09-04 - Data Scraping and New Seed

##### New static files

- added new public files for `actors` and `movies` unpack from `uploads` in the same directory

##### New script commands

- `npm run knex:refresh` rolls back migration, migrates to latest and seed
- `npm run scrap-top-250` scraps the list of top 250 movies from imdb

#### Scraping

- start with `npm run scrap-top-250`
- takes 20~30 minutes to run
- produces the movie posters and actor images in public directory
- if unpacked the `zip` files from the repository, the scraper skips downloading the images
- a `top250.json` file will be written in the `private` dir wrap the `content` inside brackets `[ ...json items ]`, this
  is important for the seeders to work to make it an array json
- move `top250.json` to `Database`
- note the order of Seeders:
    - `20220803083920_GenreSeeder.ts`
    - `20220822162255_UserSeeder.ts`
    - `20220903221531_ScrappedMoviesSeeder.ts`
    - `20220903231405_RelatedMoviesSeeder.ts`
- `npm run knex:refresh` 

#### Scraper output

```bash
[ 001 / 250 ] The Shawshank Redemption
[ 002 / 250 ] The Godfather
[ 003 / 250 ] The Dark Knight
...
[ 249 / 250 ] The Help
[ 250 / 250 ] The Iron Giant
------------------------------------------------------------------------------------
scrapped 250 movies
and 3836 unique actors
------------------------------------------------------------------------------------
```


