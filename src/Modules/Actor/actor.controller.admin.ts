import { NextFunction, Request, Response } from 'express'
import Actor                               from './actor.model'

export const AdminActorController = {

    store: async (req: Request, res: Response, next: NextFunction) => {

        const data = req.body

        await Actor
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

        await Actor
            .query()
            .patchAndFetchById(id, data)
            .throwIfNotFound({ message: 'Actor not found!' })
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

        await Actor
            .query()
            .deleteById(id)
            .throwIfNotFound({ message: 'Actor not found!' })
            .returning('*')
            .then((result) => res.json(result))
            .catch(err => next(err))

    }

}
