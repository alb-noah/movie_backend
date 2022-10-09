import {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('users', (table) => {
        table.string("img").nullable()
        table.date("birthdate").nullable()
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('users', (table) => {
        table.dropColumn("img")
        table.dropColumn("birthdate")
    })
}
