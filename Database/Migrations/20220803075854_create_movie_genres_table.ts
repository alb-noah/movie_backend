import {Knex} from "knex";

const table_name = 'movie_genres'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(table_name, (table) => {
        table
            .uuid('movie_id')
            .references('movies.id')

        table
            .integer('genre_id')
            .references('genres.id')

        table.primary(['movie_id', 'genre_id'])
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists(table_name)
}

