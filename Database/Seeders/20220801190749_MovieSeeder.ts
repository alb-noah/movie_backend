import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("movies").del()

    // Inserts seed entries
    await knex("movies").insert([
        {
            title: "The Lord of the Rings: The Fellowship of the Ring",
            description: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
            release_date: "2001-12-19",
            img: 'movies_1659391851374_152950792.jpg',
            thumb: 'thumb_movies_1659391851374_152950792.jpg',
            running_time: "2h 58m",
            rating: "PG-13",
            rental_rate: 5.75,
            rental_duration: "3 days",
            damage_cost: 9.25,
        },
        {
            title: "The Lord of the Rings: The Two Towers",
            description: "While Frodo and Sam edge closer to Mordor with the help of the shifty Gollum, the divided fellowship makes a stand against Sauron's new ally, Saruman, and his hordes of Isengard.",
            release_date: "2002-12-18",
            img: 'movies_1659391769582_282160515.jpg',
            thumb: 'thumb_movies_1659391769582_282160515.jpg',
            running_time: "2h 59m",
            rating: "PG-13",
            rental_rate: 5.75,
            rental_duration: "3 days",
            damage_cost: 8.25,
        },
        {
            title: "The Lord of the Rings: The Return of the King",
            description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
            release_date: "2003-12-17",
            img: 'movies_1659391976909_447371535.jpg',
            thumb: 'thumb_movies_1659391976909_447371535.jpg',
            running_time: "3h 21m",
            rating: "PG-13",
            rental_rate: 5.75,
            rental_duration: "3 days",
            damage_cost: 7.25,
        },
        {
            title: "Spirited Away",
            description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
            release_date: "2003-03-28",
            img: 'movies_1659392470374_588614046.jpg',
            thumb: 'thumb_movies_1659392470374_588614046.jpg',
            running_time: "2h 5m",
            rating: "PG",
            rental_rate: 4.75,
            rental_duration: "5 days",
            damage_cost: 7.25,
        },
    ])
}

