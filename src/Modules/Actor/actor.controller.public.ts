import { NextFunction, Request, Response } from "express"
import { UtilDatabase }                    from '../../Utils/finder'
import Actor                               from './actor.model'

export const PublicActorController = {

    /**
     * ---------------------------------------------------------------------
     * View index of a model
     * ---------------------------------------------------------------------
     */
    index: async (req: Request, res: Response, next: NextFunction) => {

        let query = Actor.query()

        return await UtilDatabase
            .finder(Actor, req.query, query)
            .then((results) => res.json(results))
            .catch(err => next(err))
    },

    /**
     * ---------------------------------------------------------------------
     * View a single model
     * ---------------------------------------------------------------------
     */
    show: async (req: Request, res: Response, next: NextFunction) => {

        await Actor
            .query()
            .findById(req.params.id)
            .withGraphFetched(`[movies]`)
            .throwIfNotFound({ message: 'Actor not found!' })
            .then((result: Actor) => res.json(result))
            .catch(err => next(err))
    }
}
