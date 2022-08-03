import {Knex} from "knex";

const table_name = 'movie_actors'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(table_name, (table) => {
        table
            .uuid('movie_id')
            .references('movies.id')

        table
            .integer('actor_id')
            .references('actors.id')

        table.string('as').nullable()

        table.primary(['movie_id', 'actor_id'])
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists(table_name)
}

