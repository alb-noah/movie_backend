import { NextFunction, Request, Response } from "express"
import Genre                               from './genre.model'

export const PublicGenreController = {

    /**
     * ---------------------------------------------------------------------
     * View index of a model
     * ---------------------------------------------------------------------
     */
    index: async (req: Request, res: Response, next: NextFunction) => {

        await Genre
            .query()
            .then((results: Genre[]) => res.json(results))
            .catch(err => next(err))
    },

    /**
     * ---------------------------------------------------------------------
     * View a single model
     * ---------------------------------------------------------------------
     */
    show: async (req: Request, res: Response, next: NextFunction) => {

        const { id } = req.params

        return await Genre
            .query()
            .findById(id)
            .throwIfNotFound({ message: 'Genre not found!' })
            .then((result: Genre) => res.json(result))
            .catch(err => next(err))
    }
}
