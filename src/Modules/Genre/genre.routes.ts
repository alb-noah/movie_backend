import { Router }                from 'express'
import { Multer }                from '../../Middlewares/multer'
import { PublicGenreController } from './genre.controller.public'
import { AdminGenreController }  from './genre.controller.admin'

export const PublicGenreRoutes = (router: Router, prefix: string) => {
    router.get(
        `${ prefix }/genres`,
        PublicGenreController.index
    )
    router.get(
        `${ prefix }/genres/:id`,
        PublicGenreController.show
    )
}

export const AdminGenreRoutes = (router: Router, prefix: string) => {

    router
        .route(`${ prefix }/genres`)
        .get(
            AdminGenreController.index
        )
        .post(
            Multer.none,
            AdminGenreController.store
        )

    router
        .route(`${ prefix }/genres/:id`)
        .get(
            AdminGenreController.show
        )
        .patch(
            Multer.none,
            AdminGenreController.update
        )
        .delete(
            AdminGenreController.destroy
        )
}
