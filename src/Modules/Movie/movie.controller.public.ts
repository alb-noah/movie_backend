import {NextFunction, Request, Response} from "express"
import { UtilDatabase }                  from '../../Utils/finder'
import Movie                             from './movie.model'

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
            .withGraphFetched(`[
                cast,
                genres,
                related_movies
            ]`)
            .throwIfNotFound({message: 'Movie not found!'})
            .then((result: Movie) => res.json(result))
            .catch(err => next(err))
    },
}
