import {Knex} from "knex";

const table_name = 'related_movies'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(table_name, (table) => {
        table
            .uuid('movie_id')
            .references('movies.id')

        table
            .uuid('related_id')
            .references('movies.id')

        table.primary(['movie_id', 'related_id'])
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists(table_name)
}

