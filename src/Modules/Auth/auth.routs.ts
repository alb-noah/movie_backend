import { Router }   from 'express'
import { Multer }   from '../../Middlewares/multer'
import { webLogin } from './web-login'

export const PublicAuthRoutes = (router: Router, prefix: string) => {
    router.post(
        `${ prefix }/web-login`,
        Multer.none,
        webLogin
    )
}
