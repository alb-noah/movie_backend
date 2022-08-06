import {NextFunction, Request, Response} from "express"
import Movie                             from './movie.model'

export const AdminMovieController = {

    /**
     * ---------------------------------------------------------------------
     * View index of a model
     * ---------------------------------------------------------------------
     */
    index: async (req: Request, res: Response, next: NextFunction) => {

        await Movie
            .query()
            .then((results: Movie[]) => res.json(results))
            .catch(err => next(err))
    },

    /**
     * ---------------------------------------------------------------------
     * View a single model
     * ---------------------------------------------------------------------
     */
    show: async (req: Request, res: Response, next: NextFunction) => {

        await Movie
            .query()
            .findById(req.params.id)
            .withGraphFetched(`[
                cast,
                genres,
                related_movies
            ]`)
            .throwIfNotFound({message: 'Movie not found!'})
            .then((result: Movie) => res.json(result))
            .catch(err => next(err))
    }
}
