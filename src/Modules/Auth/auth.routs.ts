import { Router }   from 'express'
import { Multer }   from '../../Middlewares/multer'
import { logout }   from './logout'
import { me }       from './me'
import { webLogin } from './web-login'

export const PublicAuthRoutes = (router: Router, prefix: string) => {

    router.post(
        `${ prefix }/web-login`,
        Multer.none,
        webLogin
    )

    router.get(`${ prefix }/me`, me)

    router.get(`${ prefix }/logout`, logout)
}
