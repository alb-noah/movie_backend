import {Knex}       from "knex";
import {MOVIE_DATA} from '../../private/movies'
import {v4 as uuid} from 'uuid'

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("movies").del();
    await knex("movie_actors").del();
    await knex("movie_genres").del();


    // Build seed entries

    const genres = await knex('genres').select('id', 'name')
    const actors = await knex('actors').select('id', 'name')

    const movies_data = MOVIE_DATA

    /**
     * transfer these values into relations
     *
     * genre: "Crime, Drama",
     * actors: "Marlon Brando, Al Pacino, James Caan",
     * */

    let movies: any       = []
    let cast: any         = []
    let movie_genres: any = []

    movies_data.forEach((movie: any) => {
        let movie_id = uuid()

        let mv_actors = movie.actors.split(',')
        mv_actors.forEach((mv_actor: any) => {
            let name   = mv_actor.trim()
            let result = actors.filter(actor => actor.name == name)[0]

            if (result && result.id) {
                cast.push({movie_id, actor_id: result.id})
            }
        })

        let mv_genres = movie.genre.split(',')
        mv_genres.forEach((mvg: any) => {
            let name   = mvg.toLowerCase().trim()
            let result = genres.filter(genre => JSON.stringify(genre.name).includes(name))[0]

            if (result && result.id) {
                movie_genres.push({movie_id, genre_id: result.id})
            }
        })

        delete movie.genre
        delete movie.actors

        movies.push({
            ...movie,
            id: movie_id
        })
    })

    await knex.batchInsert('movies', movies)
    await knex.batchInsert('movie_actors', cast)
    await knex.batchInsert('movie_genres', movie_genres)

}
