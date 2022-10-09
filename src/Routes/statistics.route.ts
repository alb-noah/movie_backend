import { NextFunction, Request, Response } from 'express'
import Actor                               from '../Modules/Actor/actor.model'
import Movie                               from '../Modules/Movie/movie.model'
import { Review }                          from '../Modules/Reviews/review.model'
import { User }                            from '../Modules/Users/user.model'

export const GetStatics = async (req: Request, res: Response, next: NextFunction) => {

    const moviesTotal = await Movie
        .query()
        .count()
        .then((rows: any) => Number(rows[0].count))

    const usersTotal = await User
        .query()
        .count()
        .then((rows: any) => Number(rows[0].count))

    const actorTotal = await Actor
        .query()
        .count()
        .then((rows: any) => Number(rows[0].count))

    const reviewsTotal = await Review
        .query()
        .count()
        .then((rows: any) => Number(rows[0].count))

    const statistics = {
        movies: moviesTotal,
        actors: actorTotal,
        users: usersTotal,
        reviews: reviewsTotal
    }

    res.json(statistics)
}
