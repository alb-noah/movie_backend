import {Model, QueryBuilderType, QueryContext} from 'objection'
import {DOMAIN}                                from "../../config"
import Movie                                   from '../Movie/movie.model'

export default class Actor extends Model {

    // Table name
    static tableName = 'actors'

    // Table columns
    id!: string
    name!: string | null
    img!: string | null
    thumb!: string | null
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

    async $beforeUpdate(args: any, qc: QueryContext) {
        this.updated_at = new Date()

        return super.$beforeUpdate(args, qc)
    }

    async $afterGet(qc: QueryContext) {

        this.img = this.img ?
                   `${DOMAIN}/uploads/actors/${this.img}` :
                   null

        this.thumb = this.thumb ?
                     `${DOMAIN}/uploads/actors/thumbs/${this.thumb}` :
                     null

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
                from: 'actors.id',
                through: {
                    from: 'movie_actors.actor_id',
                    to: 'movie_actors.movie_id',
                    extra: ['as']
                },
                to: 'movies.id'
            },
            filter: (qb: QueryBuilderType<Movie>) => qb.select('movies.id', 'movies.title', 'movies.img', 'movies.thumb')
        }
    })
}

