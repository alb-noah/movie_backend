import {Model, QueryBuilderType, QueryContext} from 'objection'
import {DOMAIN}                                from "../../config"
import Movie                                   from '../Movie/movie.model'
import { TimestampedModel }                    from '../Shared/TimestampedModel'

export default class Actor extends TimestampedModel {

    // Table name
    static tableName = 'actors'

    // Table columns
    id!: string
    name!: string | null
    img!: string | null
    thumb!: string | null

    async $afterGet(qc: QueryContext) {

        this.img = this.img ?
                   `${DOMAIN}/uploads/actors/${this.img}` :
                   null

        this.thumb = this.thumb ?
                     `${DOMAIN}/uploads/actors/thumbs/${this.thumb}` :
                     null

        return super.$afterGet(qc)
    }


    static jsonSchema = {
        type: 'object',
        required: ['name'],
        properties: {
            name: {type: 'string', minLength: 3}
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

