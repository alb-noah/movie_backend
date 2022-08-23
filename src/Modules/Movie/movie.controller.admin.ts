import { NextFunction, Request, Response } from "express"
import Movie                               from './movie.model'

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

        const { id } = req.params

        await Movie
            .query()
            .findById(id)
            .withGraphFetched(`[
                cast,
                genres,
                related_movies
            ]`)
            .throwIfNotFound({ message: 'Movie not found!' })
            .then((result: Movie) => res.json(result))
            .catch(err => next(err))
    },

    store: async (req: Request, res: Response, next: NextFunction) => {

        const data = req.body

        await Movie
            .query()
            .insert(data)
            .then((result) => res.json(result))
            .catch(err => next(err))

    },

    /**
     * ---------------------------------------------------------------------
     * Update an existing instance of a model
     * ---------------------------------------------------------------------
     */
    update: async (req: Request, res: Response, next: NextFunction) => {

        const data = req.body

        await Movie
            .query()
            .patchAndFetchById(req.params.id, data)
            .throwIfNotFound({ message: 'Movie not found!' })
            .then((result: Movie) => res.json(result))
            .catch(err => next(err))
    },

    /**
     * ---------------------------------------------------------------------
     * Destroy an instance of a model
     * ---------------------------------------------------------------------
     */
    destroy: async (req: Request, res: Response, next: NextFunction) => {

        const { id } = req.params

        await Movie
            .query()
            .deleteById(id)
            .throwIfNotFound({ message: 'Movie not found!' })
            .then((result) => res.json(result))
            .catch(err => next(err))
    }
}