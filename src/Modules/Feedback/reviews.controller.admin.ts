import { NextFunction, Request, Response } from "express"
import { UtilDatabase }                    from '../../Utils/finder'
import Reviews                               from './reviews.model'

export const AdminReviewsController = {

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
            .throwIfNotFound({ message: 'هذا التقييم غير موجود!' })
            .then((result: Reviews) => res.json(result))
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
     * Update an existing instance of a model
     * ---------------------------------------------------------------------
     */
    update: async (req: Request, res: Response, next: NextFunction) => {

        const data   = req.body
        const { id } = req.params

        await Reviews
            .query()
            .patchAndFetchById(id, data)
            .throwIfNotFound({ message: 'هذا التقييم غير موجود!' })
            .then((result) => res.json(result))
            .catch(err => next(err))
    },

    /**
     * ---------------------------------------------------------------------
     * Destroy an instance of a model
     * ---------------------------------------------------------------------
     */
    destroy: async (req: Request, res: Response, next: NextFunction) => {

        const { id } = req.params

        await Reviews
            .query()
            .deleteById(id)
            .throwIfNotFound({ message: 'هذا التقييم غير موجود!' })
            .returning('*')
            .then((result) => res.json(result))
            .catch(err => next(err))

    }

}
