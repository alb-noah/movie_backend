import { Model, QueryContext } from 'objection'
import Movie                   from '../Movie/movie.model'
import { TimestampedModel }    from '../Shared/TimestampedModel'

export default class Genre extends TimestampedModel {

    // Table name
    static tableName = 'genres'

    // Table columns
    id!: string
    name!: string

    /*
     * ---------------------------------------------------------------------
     * Static methods
     * ---------------------------------------------------------------------
     */

    async $afterGet(qc: QueryContext) {

        let { lang } = qc
        this.name    = lang ? this.name[lang] : this.name

        return super.$afterGet(qc)
    }

    /*
     * ---------------------------------------------------------------------
     * JSON SCHEMA
     * ---------------------------------------------------------------------
     */
    static jsonSchema = {
        type: 'object',
        required: [ 'name' ],
        properties: {
            name: {
                type: 'object',
                required: [ 'en', 'ar' ],
                properties: {
                    en: { type: 'string' },
                    ar: { type: 'string' }
                }
            }
        }
    }

    /*
     * ---------------------------------------------------------------------
     * Model Relations
     * ---------------------------------------------------------------------
     */
    static relationMappings = () => ({
        movies: {
            relation: Model.ManyToManyRelation,
            modelClass: Movie,
            join: {
                from: 'genres.id',
                through: {
                    from: 'movie_genres.genre_id',
                    to: 'movie_genres.movie_id'
                },
                to: 'movies.id'
            }
        }
    })
}

