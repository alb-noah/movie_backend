import { Router }                              from 'express'
import { errorHandler }                        from '../Middlewares/error.handler'
import { JWT }                                 from '../Middlewares/Jwt'
import { Locale }                              from '../Middlewares/locale'
import { AdminActorRoutes, PublicActorRoutes } from '../Modules/Actor/actor.routes'

import { AdminGenreRoutes, PublicGenreRoutes } from '../Modules/Genre/genre.routes'
import { AdminMovieRoutes, PublicMovieRoutes } from '../Modules/Movie/movie.routes'
import {AdminUserRoutes, UserRoutes} from "../Modules/Users/user.routes";
import {RoleMiddleware} from "../Middlewares/RoleMiddleware";
import {AdminReviewRoutes} from "../Modules/Reviews/review.routes";
import {GetStatics} from "./statistics.route";
import {PublicAuthRoutes} from "../Modules/Auth/auth.routs";
//import {app} from "../app";

export const applyRoutes = (): Router => {

    const router = Router()
    //app.use("/dashboard", require("./dashboard"));

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
     *  USER ROUTES
     * ------------------------------------------------------------------------------
     */
    const user_prefix = prefix + '/user' // domain:8000/api/v1/user

    router.use(user_prefix, RoleMiddleware(["user"]))
    UserRoutes(router, user_prefix)

    /**
     * ------------------------------------------------------------------------------
     *  ADMIN ROUTES
     * ------------------------------------------------------------------------------
     */
    const admin_prefix = prefix + '/admin' // domain:8000/api/v1/admin
    // TODO: lock this route behind a Role Middleware (authorization)
    router.use(admin_prefix, RoleMiddleware(["admin"]))
    AdminUserRoutes(router, admin_prefix)
    AdminActorRoutes(router, admin_prefix)
    AdminGenreRoutes(router, admin_prefix)
    AdminMovieRoutes(router, admin_prefix)
    AdminReviewRoutes(router, admin_prefix)


    router.get(`${admin_prefix}/statistics`, GetStatics)
    /**
     * ------------------------------------------------------------------------------
     *  PUBLIC ROUTES
     * ------------------------------------------------------------------------------
     */
    // domain:8000/api/v1


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
    // module.exports = router;
    return router
}
