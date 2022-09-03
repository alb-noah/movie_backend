import { NextFunction, Request, Response } from "express"
import { UtilDatabase }                    from '../../Utils/finder'
import Movie                               from './movie.model'

export const AdminMovieController = {

    /**
     * ---------------------------------------------------------------------
     * View index of a model
     * ---------------------------------------------------------------------
     */
    index: async (req: Request, res: Response, next: NextFunction) => {

        let query = Movie.query()

        return await UtilDatabase
            .finder(Movie, req.query, query)
            .then((results) => res.json(results))
            .catch(err => next(err))
    },

    /**
     * ---------------------------------------------------------------------
     * View a single model
     * ---------------------------------------------------------------------
     */
    show: async (req: Request, res: Response, next: NextFunction) => {

        const { id } = req.params
        let lang = req.query.lang


        await Movie
            .query()
            .context({lang})
            .findById(id)
            .withGraphFetched(`[
                cast,
                genres,
                related_movies
            ]`)
            .throwIfNotFound({ message: 'Movie not found!' })
            .then((result: Movie) => res.json(result))
            .catch(err => next(err))
    },

    store: async (req: Request, res: Response, next: NextFunction) => {

        const data = req.body

        await Movie
            .query()
            .insert(data)
            .then((result) => res.json(result))
            .catch(err => next(err))

    },

    /**
     * ---------------------------------------------------------------------
     * Update an existing instance of a model
     * ---------------------------------------------------------------------
     */
    update: async (req: Request, res: Response, next: NextFunction) => {

        const data = req.body

        const trx = await Movie.startTransaction();

        try {
            await Movie
                .query(trx)
                .patchAndFetchById(req.params.id, data)
                .throwIfNotFound({ message: 'Movie not found!' })
                .then(async (result: Movie) => res.json(result))

            await trx.commit();
        } catch (err) {
            await trx.rollback();
            return next(err)
        }

    },

    /**
     * ---------------------------------------------------------------------
     * Destroy an instance of a model
     * ---------------------------------------------------------------------
     */
    destroy: async (req: Request, res: Response, next: NextFunction) => {

        const { id } = req.params

        await Movie
            .query()
            .deleteById(id)
            .throwIfNotFound({ message: 'Movie not found!' })
            .returning('*')
            .then((result) => res.json(result))
            .catch(err => next(err))
    }
}
