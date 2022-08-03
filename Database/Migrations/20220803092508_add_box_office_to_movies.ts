import {Knex} from "knex";

const table_name = 'movies'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable(table_name, (table) => {
        table.string('box_office').nullable()
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable(table_name, (table) => {
        table.dropColumn('box_office')
    })
}

