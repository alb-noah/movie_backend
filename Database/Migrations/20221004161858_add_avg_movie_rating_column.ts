import {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('movies', (table) => {
        table.float( "avg_rating").notNullable().defaultTo(0.0)
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('movies', (table) => {
        table.dropColumn("avg_rating")
    })
}

