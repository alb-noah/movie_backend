import { Knex }                          from "knex"
import movies                            from '../top250.json'
import { v4 as uuid }                    from 'uuid'
import { distinct_array_obj_key, limit } from '../../src/Utils/objects'

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("related_movies").del();
    await knex("movie_actors").del();
    await knex("movie_genres").del();
    await knex("movies").del();
    await knex("actors").del();

    let AllActors: any[] = []

    movies.forEach(m => {
        AllActors.push(...m.actors)
    })

    let uniqueActors: any[] = distinct_array_obj_key(AllActors, "name")

    let insertedActors: any[] = []

    uniqueActors.forEach((ua, i) => {

        let actorFilename = `${ ua.name.replace(' ', '_').replace('. ', '_').toLowerCase() }`

        insertedActors.push({
            id: i + 1,
            name: ua.name,
            img: actorFilename + ".jpg",
            thumb: `thumb_${ actorFilename }.png`
        })
    })

    // 1. Seed actors and set their sequence
    await knex.batchInsert("actors", insertedActors)
    await knex.raw('select setval(\'actors_id_seq\', max(id)) from actors')

    // 2. Seed Movies and their genres

    const genres = await knex('genres').select('id', 'name')

    let movie_genres: any[]   = []
    let movie_actors: any[]   = []
    let insertedMovies: any[] = []

    movies.forEach(m => {
        let movieProperties = limit(m, [
            "title",
            "description",
            "rating",
            "release_date",
            "running_time",
            "box_office",
            "rental_rate",
            "rental_duration",
            "damage_cost"
        ])

        let movie_id = uuid()
        let img      = m.poster ? `${ m.imdbID }.jpg` : null
        let thumb    = m.imdbID ? `thumb_${ m.imdbID }.png` : null

        insertedMovies.push({
            id: movie_id,
            img,
            thumb,
            ...movieProperties,
            release_date: m.release_date ?? "1970-01-01"
        })

        m.genres.forEach((name: string) => {
            let result = genres.filter(genre => JSON.stringify(genre.name).includes(name))[0]

            if (result && result.id) {
                movie_genres.push({ movie_id, genre_id: result.id })
            }
        })

        m.actors.forEach(actor => {
            movie_actors.push({
                movie_id: movie_id,
                actor_id: insertedActors.filter(a => a.name == actor.name)[0].id,
                as: actor.as
            })
        })

    })

    // Inserts seed entries
    await knex.batchInsert('movies', insertedMovies)
    await knex.batchInsert('movie_genres', movie_genres)
    await knex.batchInsert('movie_actors', movie_actors)
}
