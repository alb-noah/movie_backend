import {Knex} from "knex";

const table_name = 'movies'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(table_name, (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
        table.string('title').nullable()
        table.text('description').nullable()
        table.date('release_date').notNullable().defaultTo(knex.raw('now()'))
        table.string('img').nullable()
        table.string('thumb').nullable()
        table.specificType('running_time', 'interval').notNullable().defaultTo(knex.raw('interval \'1h 45m\''))
        table.string('rating').nullable()
        table.float('rental_rate').notNullable().defaultTo(0.0)
        table.specificType('rental_duration', 'interval').notNullable().defaultTo(knex.raw('interval \'3d\''))
        table.float('damage_cost').notNullable().defaultTo(0.0)
        table.boolean('is_disabled').defaultTo(false).notNullable()
        table.timestamp('created_at', {useTz: false}).defaultTo(knex.raw('now()')).notNullable()
        table.timestamp('updated_at', {useTz: false}).defaultTo(knex.raw('now()')).notNullable()
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists(table_name)
}

