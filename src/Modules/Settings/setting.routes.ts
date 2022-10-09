import { Router }                from 'express'
import { Multer }                from '../../Middlewares/multer'
import { PublicSettingController } from './setting.controller.public'
import { AdminSettingController }  from './setting.controller.admin'

export const PublicSettingRoutes = (router: Router, prefix: string) => {
    router.get(`${ prefix }/setting`, PublicSettingController.index)
    router.get(`${ prefix }/setting/:id`, PublicSettingController.show)
}

export const AdminSettingRoutes = (router: Router, prefix: string) => {

    // TODO: add insert, update and delete to admin

    router
        .route(`${ prefix }/setting`)  // domain:8000/api/v1/admin/setting
        .get(
            PublicSettingController.index
        )
        .post(
            Multer.none,
            AdminSettingController.store
        )

    router
        .route(`${ prefix }/setting/:id`) // domain:8000/api/v1/admin/setting/1
        .get(
            PublicSettingController.show
        )
        .patch(
            Multer.none,
            AdminSettingController.update
        )
        .delete(
            AdminSettingController.destroy
        )
}
