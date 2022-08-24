import { knex } from '../../knexfile'

const fn = async () => {
    return await knex('movies')
        .columnInfo()
        .then(e => {
            console.log(e)
            return e
        })
        .then(e => Object.keys(e))
}

fn().then((columns) => {

    // console.log(objectKeys)
    //
    // let check = objectKeys.includes(sorts)
    //
    // console.log(check)
    // console.log(e)
    console.log('--------------')
    console.log('Ran trying')

    process.exit(0)
})
