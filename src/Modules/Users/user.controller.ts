import { NextFunction, Request, Response } from 'express'
import { unlink }                          from 'node:fs/promises'
import { ValidationError }                 from 'objection'
import path                                from 'path'
import { UPLOADS_PATH }                    from '../../config'
import { User }                            from './user.model'

export const UserController = {

    /**
     * ---------------------------------------------------------------------
     * Update user profile
     * ---------------------------------------------------------------------
     */
    update: async (req: Request, res: Response, next: NextFunction) => {

        const user = req.user as User
        const data = req.body // password, password_confirmation
        const img  = req.file
        if (img) {
            data.img = img.filename
        }

        let err = new ValidationError({
            message: "password does not match confirmation",
            type: "InputValidationError"
        })

        // user must not disable himself only allowed in admin
        if ('is_disabled' in data) {
            // data.is_disabled = booleanParser(data.is_disabled)
            delete data.is_disabled
        }

        if ('password' in data && data.password) {
            // if password is provided and no password_confirmation present
            if (data.password && !('password_confirmation' in data))
                return next(err)

            // if password is provided and password_confirmation does not match
            if ('password_confirmation' in data && data.password_confirmation) {
                let valid = data.password == data.password_confirmation
                if (!valid) return next(err)
            }
            delete data.password_confirmation
        }

        const trx = await User.startTransaction()

        try {

            let oldImage = user.img

            await user
                .$query(trx)
                .patchAndFetch(data)
                .then(async (result: User) => {

                    // If new image in update and old file exists
                    // delete old image on success
                    if (img && oldImage) {
                        const oldImageBasename = path.basename(oldImage)
                        const oldImagePath = path.resolve(UPLOADS_PATH, 'users', oldImageBasename)
                        await unlink(oldImagePath);
                    }
                    return res.json(result)
                })

            await trx.commit()
            // TODO: delete older image
        } catch (err) {

            // Delete file
            if (img) {
                const img_path = path.resolve(UPLOADS_PATH, 'users', img.filename)
                await unlink(img_path);
                console.log(`successfully deleted ${img_path}`);
            }

            await trx.rollback()
            return next(err)
        }
    }

}