import { NextFunction, Request, Response } from "express"
import { UtilDatabase }                    from '../../Utils/finder'
import Reviews                               from './reviews.model'

export const PublicReviewsController = {

    /**
     * ---------------------------------------------------------------------
     * View index of a model
     * ---------------------------------------------------------------------
     */
    index: async (req: Request, res: Response, next: NextFunction) => {

        let query = Reviews.query()

        return await UtilDatabase
            .finder(Reviews, req.query, query)
            .then((results) => res.json(results))
            .catch(err => next(err))
    },
    store: async (req: Request, res: Response, next: NextFunction) => {

        const data = req.body

        await Reviews
            .query()
            .insert(data)
            .then((result) => res.json(result))
            .catch(err => next(err))

    },

    /**
     * ---------------------------------------------------------------------
     * View a single model
     * ---------------------------------------------------------------------
     */
    show: async (req: Request, res: Response, next: NextFunction) => {

        const { id } = req.params

        return await Reviews
            .query()
            .findById(id)
            .throwIfNotFound({ message: 'Review not found!' })
            .then((result: Reviews) => res.json(result))
            .catch(err => next(err))
    }
}
