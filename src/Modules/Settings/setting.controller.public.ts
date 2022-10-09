import { NextFunction, Request, Response } from "express"
import { UtilDatabase } from '../../Utils/finder';
import Setting                               from './setting.model'

export const PublicSettingController = {

    /**
     * ---------------------------------------------------------------------
     * View index of a model
     * ---------------------------------------------------------------------
     */
    index: async (req: Request, res: Response, next: NextFunction) => {

        let query = Setting.query()

        return await UtilDatabase
            .finder(Setting, req.query, query)
            .then((results) => res.json(results))
            .catch(err => next(err))
    },

    /**
     * ---------------------------------------------------------------------
     * View a single model
     * ---------------------------------------------------------------------
     */
    show: async (req: Request, res: Response, next: NextFunction) => {

        await Setting
            .query()
            .findById(req.params.id)
            .withGraphFetched(`[movies]`)
            .throwIfNotFound({ message: 'Setting not found!' })
            .then((result: Setting) => res.json(result))
            .catch(err => next(err))
    }
}
