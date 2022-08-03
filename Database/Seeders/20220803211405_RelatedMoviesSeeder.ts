import {Knex} from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("related_movies").del();

    const related_movies = [

        // Godfather trilogy
        {title: "The Godfather", related_title: "The Godfather Part II"},
        {title: "The Godfather", related_title: "The Godfather Part III"},
        {title: "The Godfather Part II", related_title: "The Godfather"},
        {title: "The Godfather Part II", related_title: "The Godfather Part III"},
        {title: "The Godfather Part III", related_title: "The Godfather"},
        {title: "The Godfather Part III", related_title: "The Godfather Part II"},

        // Dark knight trilogy
        {title: "Batman Begins", related_title: "The Dark Knight"},
        {title: "Batman Begins", related_title: "The Dark Knight Rises"},
        {title: "The Dark Knight", related_title: "Batman Begins"},
        {title: "The Dark Knight", related_title: "The Dark Knight Rises"},
        {title: "The Dark Knight Rises", related_title: "Batman Begins"},
        {title: "The Dark Knight Rises", related_title: "The Dark Knight"},

        // The Lord of the Rings trilogy
        {
            title: "The Lord of the Rings: The Fellowship of the Ring",
            related_title: "The Lord of the Rings: The Two Towers"
        },
        {
            title: "The Lord of the Rings: The Fellowship of the Ring",
            related_title: "The Lord of the Rings: The Return of the King"
        },
        {
            title: "The Lord of the Rings: The Two Towers",
            related_title: "The Lord of the Rings: The Fellowship of the Ring"
        },
        {
            title: "The Lord of the Rings: The Two Towers",
            related_title: "The Lord of the Rings: The Return of the King"
        },
        {
            title: "The Lord of the Rings: The Return of the King",
            related_title: "The Lord of the Rings: The Fellowship of the Ring"
        },
        {
            title: "The Lord of the Rings: The Return of the King",
            related_title: "The Lord of the Rings: The Two Towers"
        },

        // Matrix
        {title: "The Matrix", related_title: "The Matrix Reloaded"},
        {title: "The Matrix", related_title: "The Matrix Revolutions"},
        {title: "The Matrix", related_title: "The Matrix Resurrections"},
        {title: "The Matrix Reloaded", related_title: "The Matrix"},
        {title: "The Matrix Reloaded", related_title: "The Matrix Revolutions"},
        {title: "The Matrix Reloaded", related_title: "The Matrix Resurrections"},
        {title: "The Matrix Revolutions", related_title: "The Matrix"},
        {title: "The Matrix Revolutions", related_title: "The Matrix Reloaded"},
        {title: "The Matrix Revolutions", related_title: "The Matrix Resurrections"},
        {title: "The Matrix Resurrections", related_title: "The Matrix"},
        {title: "The Matrix Resurrections", related_title: "The Matrix Reloaded"},
        {title: "The Matrix Resurrections", related_title: "The Matrix Revolutions"},

        // Bladerunner
        {title: "Blade Runner", related_title: "Blade Runner 2049"},
        {title: "Blade Runner 2049", related_title: "Blade Runner"},

        // Marvel
        {title: "Avengers: Infinity War", related_title: "Spider-Man: Into the Spider-Verse"},
        {title: "Avengers: Infinity War", related_title: "Avengers: Endgame"},
        {title: "Spider-Man: Into the Spider-Verse", related_title: "Avengers: Infinity War"},
        {title: "Spider-Man: Into the Spider-Verse", related_title: "Avengers: Endgame"},
        {title: "Avengers: Endgame", related_title: "Avengers: Infinity War"},
        {title: "Avengers: Endgame", related_title: "Spider-Man: Into the Spider-Verse"},

        // Ghibli
        {title: "Spirited Away", related_title: "Grave of the Fireflies"},
        {title: "Spirited Away", related_title: "Princess Mononoke"},
        {title: "Spirited Away", related_title: "My Neighbor Totoro"},
        {title: "Spirited Away", related_title: "Howl's Moving Castle"},

        {title: "Grave of the Fireflies", related_title: "Spirited Away"},
        {title: "Grave of the Fireflies", related_title: "Princess Mononoke"},
        {title: "Grave of the Fireflies", related_title: "My Neighbor Totoro"},
        {title: "Grave of the Fireflies", related_title: "Howl's Moving Castle"},

        {title: "Princess Mononoke", related_title: "Spirited Away"},
        {title: "Princess Mononoke", related_title: "Grave of the Fireflies"},
        {title: "Princess Mononoke", related_title: "My Neighbor Totoro"},
        {title: "Princess Mononoke", related_title: "Howl's Moving Castle"},

        {title: "My Neighbor Totoro", related_title: "Spirited Away"},
        {title: "My Neighbor Totoro", related_title: "Grave of the Fireflies"},
        {title: "My Neighbor Totoro", related_title: "Princess Mononoke"},
        {title: "My Neighbor Totoro", related_title: "Howl's Moving Castle"},

        {title: "Howl's Moving Castle", related_title: "Spirited Away"},
        {title: "Howl's Moving Castle", related_title: "Grave of the Fireflies"},
        {title: "Howl's Moving Castle", related_title: "Princess Mononoke"},
        {title: "Howl's Moving Castle", related_title: "My Neighbor Totoro"}
    ]

    const movies = await knex('movies').select('id', 'title')

    let related_result: any = []

    for (let related_movie of related_movies) {

        let movie = movies.filter(m => m.title == related_movie.title)[0]
        let related_mv = movies.filter(m => m.title == related_movie.related_title)[0]

        if (movie && related_mv) {
            related_result.push({
                movie_id: movie.id,
                related_id: related_mv.id
            })
        }
    }

    // Inserts seed entries
    await knex.batchInsert("related_movies", related_result)
}
