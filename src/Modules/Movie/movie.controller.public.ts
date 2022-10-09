import {NextFunction, Request, Response} from "express"
import { UtilDatabase }                  from '../../Utils/finder'
import Movie                             from './movie.model'
import {ValidationError} from "objection";
import {Review} from "../Reviews/review.model";

export const PublicMovieController = {

    /**
     * ---------------------------------------------------------------------
     * View index of a model
     * ---------------------------------------------------------------------
     */
    index: async (req: Request, res: Response, next: NextFunction) => {

        let query = Movie
            .query()
            .modify('enabled')
            .withGraphFetched(`[genres]`)

        return await UtilDatabase
            .finder(Movie, req.query, query)
            .then((results) => res.json(results))
            .catch(err => next(err))
    },

    /**
     * ---------------------------------------------------------------------
     * View a single model
     * ---------------------------------------------------------------------
     */
    show: async (req: Request, res: Response, next: NextFunction) => {

        let lang = req.query.lang

        await Movie
            .query()
            .context({lang})
            .findById(req.params.id)
            .modify('enabled')
            .withGraphFetched(`[cast,genres,related_movies,reviews.[user]`)
            .throwIfNotFound({message: 'Movie not found!'})
            .then((result: Movie) => res.json(result))
            .catch(err => next(err))
    },


    review:async(req: Request, res: Response, next: NextFunction)=>{

        let data: any = {}

        if(!req.user) {
            let err = new ValidationError({
                type:"ModleValidation",
                message:"no user , can't make review"
            })
            return next(err)
        }

        data.user_id = req.user.id
        data.rate = "rate" in req.body ? Number(req.body.rate) : null
        data.comment = "comment" in req.body ? String(req.body.rate).trim() : null

        const trx = await Review.startTransaction()

        try{

            let movie = await Movie
                .query(trx)
                .findById(req.params.id)
                .modify('enabled')
                .throwIfNotFound({message: 'Movie not found!'})
                .then((result: Movie) => result)

            let review = await  Review
                .query(trx)
                .whereExists(
                    Review.relatedQuery('user')
                        .findById(data.user_id)
                ).first()

            if(review){
                //update review
                await review
                    .$query(trx)
                    .patchAndFetch(data)
                    .then( async (result: Review) => {
                        res.json(result)
                    })

            } else {
                //insert review
                await Review
                    .query(trx)
                    .insert(data)
                    .returning("*")
                    .then( async (result: Review) =>{
                        await movie.$relatedQuery("reviews", trx)
                            .relate(result)

                        res.json(result)
                    })

            }

            await movie.$recalculateAvg(trx)
            await trx.commit()



        } catch (err){
            await trx.rollback()
            return next(err)
        }

    }

}