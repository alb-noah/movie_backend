import {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('favourite', (table) => {

        table.uuid('movie_id')
        table.foreign('movie_id')
            .references('movies.id')
            .onDelete("CASCADE")

        table.uuid('user_id')
        table.foreign('user_id')
            .references('users.id')
            .onDelete("CASCADE")
        table.primary(["movie_id", "user_id"])
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('favourite')
}

