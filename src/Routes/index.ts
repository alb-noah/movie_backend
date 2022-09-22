import { Router }                              from 'express'
import { errorHandler }                        from '../Middlewares/error.handler'
import { JWT }                                 from '../Middlewares/Jwt'
import { Locale }                              from '../Middlewares/locale'
import { AdminActorRoutes, PublicActorRoutes } from '../Modules/Actor/actor.routes'
import { PublicAuthRoutes }                    from '../Modules/Auth/auth.routs'
import { AdminGenreRoutes, PublicGenreRoutes } from '../Modules/Genre/genre.routes'
import { AdminMovieRoutes, PublicMovieRoutes } from '../Modules/Movie/movie.routes'

export const applyRoutes = (): Router => {

    const router = Router()

    /**
     * -------------------------------------------------------
     * Authentication, Authorization and locale middlewares are first
     * to be registered on the Router
     * -------------------------------------------------------
     * */
    // TODO: add (authentication) and locale middlewares here

    router.use(Locale)
    router.use(JWT)

    /**
     * -------------------------------------------------------
     * All application routes can go here
     * -------------------------------------------------------
     * */
    const prefix = '/api/v1'

    /**
     * ------------------------------------------------------------------------------
     *  ADMIN ROUTES
     * ------------------------------------------------------------------------------
     */
    const admin_prefix = prefix + '/admin' // domain:8000/api/v1/admin
    // TODO: lock this route behind a Role Middleware (authorization)

    AdminActorRoutes(router, admin_prefix)
    AdminGenreRoutes(router, admin_prefix)
    AdminMovieRoutes(router, admin_prefix)

    /**
     * ------------------------------------------------------------------------------
     *  PUBLIC ROUTES
     * ------------------------------------------------------------------------------
     */
    // domain:8000/api/v1
    const actors_prefix = prefix + '/actors'
    const genre_prefix = prefix + '/genre'
    const  movies_prefix = prefix + '/movies'
    const login_prefix = prefix + '/login'
    const  web_login_prefix = prefix + '/web-login'
    const register_prefix = prefix + '/register'


    // insert any public middlewares above this line
    PublicActorRoutes(router, prefix)
    PublicGenreRoutes(router, prefix)
    PublicMovieRoutes(router, prefix)
    PublicAuthRoutes(router, prefix)
    PublicAuthRoutes(router, prefix)
    PublicAuthRoutes(router, prefix)

    /**
     * ------------------------------------------------------------------------------
     * !!!! The Error handler is the last middleware on the router !!!!
     * ------------------------------------------------------------------------------
     * */
    router.use(errorHandler)
    module.exports = router;
    return router
}
