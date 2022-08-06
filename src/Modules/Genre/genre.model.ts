import {Model, QueryContext} from 'objection'
import Movie                 from '../Movie/movie.model'

export default class Genre extends Model {

    // Table name
    static tableName = 'genres'

    // Table columns
    id!: string
    name!: string
    created_at!: Date | string
    updated_at!: Date | string

    /*
     * ---------------------------------------------------------------------
     * Static methods
     * ---------------------------------------------------------------------
     */
    async $beforeInsert(qc: QueryContext) {
        this.created_at = new Date()
        this.updated_at = new Date()

        return super.$beforeInsert(qc)
    }

    async $beforeUpdate(_args: any, qc: QueryContext) {
        this.updated_at = new Date()

        return super.$beforeUpdate(_args, qc)
    }

    async $afterGet(qc: QueryContext) {

        let {lang} = qc
        this.name  = lang ? this.name[lang] : this.name

        return super.$afterGet(qc)
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

