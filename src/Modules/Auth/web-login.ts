import { NextFunction, Request, Response } from "express"
import { ValidationError }                 from 'objection'
import { User }                            from '../Users/user.model'

export const webLogin = async (req: Request, res: Response, next: NextFunction) => {

    let { email, password } = req.body

    if (email) email = String(email).trim().toLowerCase()

    await User
        .query()
        .where('email', email)
        .first()
        .throwIfNotFound({ message: "User not found" })
        .then(async (result) => {
            const valid = await result.$validatePassword(password)

            if (valid) {

                if(result.role == 'admin') console.log("User is an admin")
                if(result.role == 'user') console.log("User is not an admin")

                return res.json({
                    status: 'success',
                    message: 'logged in',
                    token: 'future make token return'
                })
            } else {
                throw new ValidationError({
                    type: 'ValidationError',
                    message: 'wrong password'
                })
            }

        })
        .catch(err => next(err))

}
