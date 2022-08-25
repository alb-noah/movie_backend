import {Knex} from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('movies', (table) => {
        table.specificType('fulltext', 'tsvector')
        table.index('fulltext', 'movies_fulltext_idx', 'gin')
    }).raw(`
        CREATE TRIGGER movie_fulltext_trigger
        BEFORE INSERT OR UPDATE ON movies
        FOR EACH ROW EXECUTE FUNCTION
        tsvector_update_trigger('fulltext', 'pg_catalog.english', 'title', 'description')
    `)
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('movies', (table) => {
        table.dropIndex('fulltext','movies_fulltext_idx')
        table.dropColumn('fulltext')
    })
}

