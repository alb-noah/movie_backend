import { knex } from '../../knexfile'

const fn = async () => {
    return await knex('movies').columnInfo()
}

fn().then((e) => {

    let objectKeys = Object.keys(e)

    let sorts: any = '-naMe  ,  tiTle,-ruN  Ning_time'

    sorts = sorts.split(',')

    sorts.forEach((item: string) => {
        let order  = item.startsWith('-') ? 'desc' : 'asc'
        let column = item.toLowerCase()
                         .replace('-', '')
                         .replace(/ /g,'')
        console.log({ column, order })
    })
    // console.log(sorts)
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
