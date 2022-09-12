import { Model } from 'objection'
import { knex }  from '../../knexfile'
import Movie     from '../Modules/Movie/movie.model'

const fn = async () => {

    Model.knex(knex)

    let columns =  await knex('movies')
        .columnInfo()
        .then(e => {
            console.log(e)
            return e
        })
        .then(e => Object.keys(e))

    let relations = Object.keys(Movie.getRelations())
    return {
        columns,
        relations
    }
}

fn().then(({ columns, relations
}) => {

    // console.log(objectKeys)
    //
    // let check = objectKeys.includes(sorts)
    //
    // console.log(check)
    console.log(columns)
    console.log(relations)
    console.log('--------------')
    console.log('Ran trying')

    process.exit(0)
})
