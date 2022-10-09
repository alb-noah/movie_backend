import Objection, {Model, QueryBuilderType, QueryContext, Transaction} from 'objection'
import {DOMAIN}                                from "../../config"
import Actor                                   from '../Actor/actor.model'
import Genre                                   from '../Genre/genre.model'
import { TimestampedModel }                    from '../Shared/TimestampedModel'
import {Review} from "../Reviews/review.model";

export default class Movie extends TimestampedModel {

    // Table name
    static tableName = 'movies'
    static defaultSort = 'title'

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
    fulltext!: string
    avg_rating!: number


    actors?: Actor[] | []
    reviews?: Review[] | []
    related_movies?: Movie[] | []
    /*
     * ---------------------------------------------------------------------
     * Static methods
     * ---------------------------------------------------------------------
     */

    static jsonSchema = {
        type: 'object',
        required: ['title','description'],
        properties: {
            title: {type: 'string', minLength: 3},
            description:{type:'string', minLength:10}
        }
    }

    async $recalculateAvg(trx: Transaction) {
        let avg_rating = await this
            .$relatedQuery("reviews", trx)
            .sum("rate")
            .count("id")
            .then((result:any)=>{
                return result[0].sum / result[0].count
            })
        console.log("avg_rating", avg_rating)
        await this.$query(trx).patch({avg_rating})
    }


    // Formats img and thumb fields when existing model value returns from database
    $parseDatabaseJson(json: Objection.Pojo): Objection.Pojo {
        json       = super.$parseDatabaseJson(json);
        json.img   = json.img != null ? `${DOMAIN}/uploads/movies/${json.img}` : null
        json.thumb = json.thumb != null ? `${DOMAIN}/uploads/movies/thumbs/${json.thumb}` : null
        return json
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
            filter: (qb: QueryBuilderType<Actor>) => qb.select('actors.id', 'actors.name', 'actors.img', 'actors.thumb')
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
        },

        reviews: {
            relation: Model.ManyToManyRelation,
            modelClass: Review,
            join: {
                from: 'movies.id',
                through: {
                    from: 'movie_reviews.movie_id',
                    to: 'movie_reviews.review_id'
                },
                to: 'reviews.id'
            },
        }
    })

    // async $afterGet(qc: QueryContext) {
    //
    //     this.img = this.img ?
    //                `${DOMAIN}/uploads/movies/${this.img}` :
    //                null
    //
    //     this.thumb = this.thumb ?
    //                  `${DOMAIN}/uploads/movies/thumbs/${this.thumb}` :
    //                  null
    //
    //     return super.$afterGet(qc)
    // }






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

