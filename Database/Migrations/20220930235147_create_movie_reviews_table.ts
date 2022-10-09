import {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {

    return knex.schema.createTable('movie_reviews', (table) => {
        table.uuid('review_id')
            .references('reviews.id')
            .onDelete('CASCADE')

        table.uuid('movie_id')
            .references('movies.id')
            .onDelete('CASCADE')

        table.primary(['review_id', 'movie_id'])
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('movie_reviews')
}

