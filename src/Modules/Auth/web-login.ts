import { NextFunction, Request, Response } from "express"
import { ValidationError }                 from 'objection'
import { JWT_EXPIRY }                      from '../../config'
import { User }                            from '../Users/user.model'
import ms                                  from 'ms'

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
            const generated = result.$genToken()
            const token     = `Bearer ${ generated }`
            if (valid) {
                return res
                    .setHeader('Set-Cookie', [
                        `accessToken=${ token }; path=/; HttpOnly; Max-Age=${ ms(JWT_EXPIRY) / 100 }; SameSite=None; Secure`
                    ])
                    .json({
                        status: 'success',
                        message: 'logged in',
                        token: result.$genToken()
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
