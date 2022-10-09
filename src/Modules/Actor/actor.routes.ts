import { Router }                from 'express'
import { Multer }                from '../../Middlewares/multer'
import { PublicActorController } from './actor.controller.public'
import { AdminActorController }  from './actor.controller.admin'

export const PublicActorRoutes = (router: Router, prefix: string) => {
    router.get(`${ prefix }/actors`, PublicActorController.index)
    router.get(`${ prefix }/actors/:id`, PublicActorController.show)
}

export const AdminActorRoutes = (router: Router, prefix: string) => {

    // TODO: add insert, update and delete to admin

    router
        .route(`${ prefix }/actors`)  // domain:8000/api/v1/admin/actors
        .get(
            PublicActorController.index
        )
        .post(
            Multer.simple('actors'),
            AdminActorController.store
        )

    router
        .route(`${ prefix }/actors/:id`) // domain:8000/api/v1/admin/actors/1
        .get(
            PublicActorController.show
        )
        .patch(
            Multer.none,
            AdminActorController.update
        )
        .delete(
            AdminActorController.destroy
        )
}
