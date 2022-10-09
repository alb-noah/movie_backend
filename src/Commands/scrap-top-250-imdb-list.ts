import fsSync                         from 'fs'
import fs                             from 'fs/promises'
import path                           from 'path'
import { PRIVATE_PATH, UPLOADS_PATH } from '../config'
import downloadUrl                    from '../Utils/download_url'
import { generateThumb }              from '../Utils/generate_thumbs'
import { randomNumber }               from '../Utils/randomizer'
import { writeToFile }                from '../Utils/write_to_file'

const jsdom     = require("jsdom");
const { JSDOM } = jsdom;

const getMoviePageById = async (imdbID: string) => {
    return await JSDOM.fromURL(`https://www.imdb.com/title/${ imdbID }`)
                      .then(dom => new JSDOM(dom.serialize()))
}

const fn = async () => {
    return await JSDOM.fromURL("https://www.imdb.com/chart/top/")
                      .then(dom => new JSDOM(dom.serialize()))
}

fn().then(async (jsdom) => {

    const document = jsdom.window.document;

    let output = path.resolve(PRIVATE_PATH, "top250.json")
    await fs.truncate(output, 0)

    let collectedMovies: any[] = []

    document
        .querySelectorAll(".titleColumn")
        .forEach(title => {
            let href        = title.querySelector("a")?.href
            let rental_rate = randomNumber(1, 5) * randomNumber(1, 5)

            collectedMovies.push({
                imdbID: href.split("/", 3)[2],
                title: title.querySelector("a")?.textContent,
                poster: null,
                img: null,
                thumb: null,
                description: null,
                rating: null,
                release_date: null,
                running_time: null,
                box_office: null,
                rental_rate,
                rental_duration: `${ randomNumber(1, 7) } days`,
                damage_cost: rental_rate + 2,
                actors: [],
                genres: [],
                related_movies: []
            })
        });

    let uniqueActors: any = []

    let count = 1
    for (let movie of collectedMovies) {
        let titleJSDOM      = await getMoviePageById(movie.imdbID)
        const titleDocument = titleJSDOM.window.document;
        let result          = await scrapMovie(titleJSDOM, titleDocument, movie, output)
        uniqueActors.push(...result.actors.map(a => a.name))
        let c = ("000" + count).slice(-3)
        console.log('[ ' + c + " / " + 250 + ` ] ${ result.name }`);
        count++
    }

    uniqueActors = uniqueActors.filter((value, index, self) => self.indexOf(value) === index)

    console.log('------------------------------------------------------------------------------------')
    console.log(`scrapped ${ collectedMovies.length } movies`);
    console.log(`and ${ uniqueActors.length } unique actors`);
    console.log('------------------------------------------------------------------------------------')

    process.exit(0)
}).catch(err => console.error(err))


const scrapMovie = async (jsdom, doc, movie, output) => {

    movie.poster = doc
        .querySelector(".ipc-media--poster-27x40")
        .querySelector("img")
        .src

    movie.description = doc.querySelector(".sc-16ede01-2")?.textContent

    movie.rating = doc
        .querySelector(".sc-8c396aa2-0 > li:nth-child(2) > a")
        ?.textContent

    movie.running_time = doc
        .querySelector(".sc-8c396aa2-0 > li:nth-child(3)")
        ?.textContent


    let release_date = doc
        .querySelectorAll("div.sc-f65f65be-0.ktSkVi > ul > li.ipc-metadata-list__item")[3]
        .querySelector("div")
        ?.textContent
        .split(" (", 1)[0]

    // console.log("release_date:", release_date, Date.parse(release_date))

    if (Date.parse(release_date)) {
        movie.release_date = new Date(release_date)
            .toISOString()
            .split('T', 1)[0]
    }

    let moneyList: string[] = []

    doc.querySelectorAll("section.ipc-page-section ul > li div ul li")
       .forEach((x) => {
           if (x?.textContent.startsWith("$")) {
               moneyList.push(x?.textContent)
           }
       })

    movie.box_office = moneyList && moneyList[1] ? moneyList[1] : null

    doc.querySelector(".ipc-chip-list__scroller")
       .querySelectorAll("a")
       .forEach(e => {
           movie.genres.push(e?.textContent.toLowerCase())
       })

    doc.querySelectorAll(".sc-36c36dd0-6")
       .forEach((child) => {
           let as = child.querySelector("div > ul > li > a")
           movie.actors.push({
               name: child.querySelector("a:first-child")?.textContent,
               as: as ? as?.textContent : null,
               url: child.querySelector("img")?.src,
           })
       });


    if (movie && movie.poster) {
        let moviesPath    = path.resolve(UPLOADS_PATH, "movies")
        const poster_path = path.resolve(moviesPath, `${ movie.imdbID }.jpg`)

        if (poster_path && !fsSync.existsSync(poster_path)) {
            await downloadUrl(movie.poster, poster_path)
            await generateThumb(moviesPath, poster_path)
        }

        movie.img   = movie.img ? `${ movie.imdbID }.jpg` : null
        movie.thumb = movie.thumb ? `thumb_${ movie.imdbID }.png` : null
    }

    for (let actor of movie.actors) {
        if (actor.url != null) {
            let actorsPath    = path.resolve(UPLOADS_PATH, "actors")
            let actorFilename = `${ actor.name.replace(' ', '_').replace('. ', '_').toLowerCase() }`
            const actorFile   = path.resolve(actorsPath, actorFilename + ".jpg")

            if (actorFile && !fsSync.existsSync(actorFile)) {
                await downloadUrl(actor.url, actorFile)
                await generateThumb(actorsPath, actorFile)
            }
        }
    }

    await writeToFile(output, JSON.stringify(movie))
    await writeToFile(output, ',')
    return movie
}
