import { Router }                              from 'express'
import { errorHandler }                        from '../Middlewares/error.handler'
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
    const admin_prefix = prefix + '/admin'
    // TODO: lock this route behind a Role Middleware (authorization)
    AdminActorRoutes(router, admin_prefix)
    AdminGenreRoutes(router, admin_prefix)
    AdminMovieRoutes(router, admin_prefix)

    /**
     * ------------------------------------------------------------------------------
     *  PUBLIC ROUTES
     * ------------------------------------------------------------------------------
     */

    // insert any public middlewares above this line
    PublicActorRoutes(router, prefix)
    PublicGenreRoutes(router, prefix)
    PublicMovieRoutes(router, prefix)
    PublicAuthRoutes(router, prefix)

    /**
     * ------------------------------------------------------------------------------
     * !!!! The Error handler is the last middleware on the router !!!!
     * ------------------------------------------------------------------------------
     * */
    router.use(errorHandler)

    return router
}
