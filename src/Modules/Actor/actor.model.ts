import Objection, { Model, QueryBuilderType } from 'objection'
import { DOMAIN }                             from "../../config"
import Movie                                  from '../Movie/movie.model'
import { TimestampedModel }                   from '../Shared/TimestampedModel'

export default class Actor extends TimestampedModel {

    // Table name
    static tableName = 'actors'
    static defaultSort = 'name'

    // Table columns
    id!: string
    name!: string | null
    img!: string | null
    thumb!: string | null

    static jsonSchema = {
        type: 'object',
        required: [ 'name' ],
        properties: {
            name: { type: 'string', minLength: 3 }
        }
    }

    // Formats img and thumb fields when existing model value returns from database
    $parseDatabaseJson(json: Objection.Pojo): Objection.Pojo {
        json       = super.$parseDatabaseJson(json);
        json.img   = json.img != null ? `${ DOMAIN }/uploads/actors/${ json.img }` : null
        json.thumb = json.thumb != null ? `${ DOMAIN }/uploads/actors/thumbs/${ json.thumb }` : null
        return json
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
                    extra: [ 'as' ]
                },
                to: 'movies.id'
            },
            filter: (qb: QueryBuilderType<Movie>) => qb.select('movies.id', 'movies.title', 'movies.img', 'movies.thumb')
        }
    })
}

