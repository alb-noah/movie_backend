import {Router}                              from 'express'
import {AdminMovieRoutes, PublicMovieRoutes} from '../Modules/Movie/movie.routes'
import {errorHandler}                        from '../Middlewares/error.handler'

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

    const prefix = '' // TODO: can add general prefix to the router here as "/api/v1"

    /**
     * ------------------------------------------------------------------------------
     *  SUPERADMIN ROUTES
     * ------------------------------------------------------------------------------
     */
    const admin_prefix = prefix + '/admin'
    // TODO: lock this route behind a Role Middleware (authorization)
    AdminMovieRoutes(router, admin_prefix)

    /**
     * ------------------------------------------------------------------------------
     *  PUBLIC ROUTES
     * ------------------------------------------------------------------------------
     */

    // insert any public middlewares above this line
    PublicMovieRoutes(router, prefix)

    /**
     * ------------------------------------------------------------------------------
     * !!!! The Error handler is the last middleware on the router !!!!
     * ------------------------------------------------------------------------------
     * */
    router.use(errorHandler)

    return router
}
