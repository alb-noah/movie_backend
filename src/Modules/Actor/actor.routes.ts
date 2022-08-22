import {Router}                from 'express'
import {PublicActorController} from './actor.controller.public'
import {AdminActorController}  from './actor.controller.admin'

export const PublicActorRoutes = (router: Router, prefix: string) => {
    router.get(`${prefix}/actors`, PublicActorController.index)
    router.get(`${prefix}/actors/:id`, PublicActorController.show)
}

export const AdminActorRoutes = (router: Router, prefix: string) => {

    // TODO: add insert, update and delete to admin

    router
        .route(`${prefix}/actors`)
        .get(
            PublicActorController.index
        )
        // .post(
        //     AdminActorController.store
        // )

    router
        .route(`${prefix}/actors/:id`)
        .get(
            PublicActorController.show
        )
        // .patch(
        //     AdminActorController.update
        // )
        // .delete(
        //     AdminActorController.delete
        // )
}
