import {Model, QueryBuilderType, QueryContext} from 'objection'
import {DOMAIN}                                from "../../config"
import Actor                                   from '../Actor/actor.model'
import Genre                                   from '../Genre/genre.model'
import { TimestampedModel }                    from '../Shared/TimestampedModel'

export default class Movie extends TimestampedModel {

    // Table name
    static tableName = 'movies'

    // Table columns
    id!: string
    title!: string | null
    description!: string | null
    release_date!: Date | string
    img!: string | null
    thumb!: string | null
    running_time!: string
    rating!: string | null
    rental_rate!: number
    rental_duration!: string
    damage_cost!: number
    is_disabled!: boolean

    /*
     * ---------------------------------------------------------------------
     * Static methods
     * ---------------------------------------------------------------------
     */

    async $afterGet(qc: QueryContext) {

        this.img = this.img ?
                   `${DOMAIN}/uploads/movies/${this.img}` :
                   null

        this.thumb = this.thumb ?
                     `${DOMAIN}/uploads/movies/thumbs/${this.thumb}` :
                     null

        return super.$afterGet(qc)
    }

    static jsonSchema = {
        type: 'object',
        required: ['title'],
        properties: {
            title: {type: 'string', minLength: 3}
        }
    }

    /*
     * ---------------------------------------------------------------------
     * Model Relations
     * ---------------------------------------------------------------------
     */
    static relationMappings = () => ({
        cast: {
            relation: Model.ManyToManyRelation,
            modelClass: Actor,
            join: {
                from: 'movies.id',
                through: {
                    from: 'movie_actors.movie_id',
                    to: 'movie_actors.actor_id'
                },
                to: 'actors.id'
            },
            filter: (qb: QueryBuilderType<Actor>) => qb.select('actors.id', 'actors.name')
        },
        genres: {
            relation: Model.ManyToManyRelation,
            modelClass: Genre,
            join: {
                from: 'movies.id',
                through: {
                    from: 'movie_genres.movie_id',
                    to: 'movie_genres.genre_id'
                },
                to: 'genres.id'
            },
            filter: (qb: QueryBuilderType<Genre>) => qb.select('genres.id', 'genres.name')
        },
        related_movies: {
            relation: Model.ManyToManyRelation,
            modelClass: Movie,
            join: {
                from: 'movies.id',
                through: {
                    from: 'related_movies.movie_id',
                    to: 'related_movies.related_id'
                },
                to: 'movies.id'
            },
            filter: (qb: QueryBuilderType<Movie>) => qb.select('movies.id', 'movies.title', 'movies.img', 'movies.thumb')
        }
    })

    /*
     * ---------------------------------------------------------------------
     * Query modifiers
     * ---------------------------------------------------------------------
     */
    static modifiers = {
        enabled(query: QueryBuilderType<Movie>) {
            query.where('movies.is_disabled', false)
        }
    }
}

