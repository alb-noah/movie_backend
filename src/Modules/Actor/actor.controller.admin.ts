import { NextFunction, Request, Response } from 'express'
import path                                from 'path'
import { UPLOADS_PATH }                    from '../../config'
import Actor                               from './actor.model'
import { unlink }                          from 'node:fs/promises';

export const AdminActorController = {

    store: async (req: Request, res: Response, next: NextFunction) => {

        const data = req.body
        const img  = req.file


        const trx = await Actor.startTransaction()

        try {

            // store file

            if (img) {
                data.img = img.filename
            }
            await Actor
                .query(trx)
                .insert(data)
                .then((result) => res.json(result))

            await trx.commit()
        } catch (err) {
            // Delete file
            if (img) {
                const img_path = path.resolve(UPLOADS_PATH, 'actors', img.filename)
                await unlink(img_path);

                console.log(`successfully deleted ${ img_path }`);
            }

            await trx.rollback()
            return next(err)
        }

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
