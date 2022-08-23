import { QueryBuilder } from 'objection'
import { knex }         from '../../knexfile'

export class UtilDatabase {

    // TODO: add sort
    // TODO: add filter
    // TODO: add include

    static sort(columns: string[], sortString: string) {
        let sorts = sortString.split(',')

        let sortsArray: any = []

        sorts.forEach((item: string) => {
            let order  = item.startsWith('-') ? 'desc' : 'asc'
            let column = item.toLowerCase()
                             .replace('-', '')
                             .replace(/ /g, '')

            if (columns.includes(item)) {
                sortsArray.push({ column, order })
            }
        })

        return sortsArray
    }

    static async finder(model: any, args: any, query: QueryBuilder<any>): Promise<any> {

        let { lang, page, paginate, sorts } = args

        // pagination stuff
        let offset: number;
        let total: number;
        let lastPage: number;
        let from: number;
        let to: number;
        let fraction: number;

        if (!paginate) paginate = 12;

        if (!page || page <= 1) {
            page   = 1;
            offset = 0;
        } else {
            offset = page * paginate - paginate;
        }

        let columns = await knex(model.tableName).columnInfo()

        let sortsArray = [ { column: 'created_at' } ]

        if (sorts)
            sortsArray = this.sort(Object.keys(columns), sorts)

        console.log(sortsArray)
        // Build the finder inquiry

        let inquiry = await query
            .context({ lang })
            .modify(qb => {
                // if filters
                // if sorts
                // search
            })
            .orderBy(sortsArray)
            .page(page - 1, paginate)

        total              = inquiry.total
        lastPage           = Math.ceil(total / paginate)
        let remainingItems = total % paginate;
        fraction           = remainingItems == 0 ? paginate : remainingItems
        from               = offset == 0 ? 1 : Number(offset + 1)
        to                 = page == lastPage ?
                             Number(offset) + Number(fraction) :
                             Number(offset) + Number(paginate)
        return {
            meta: {
                total,
                per_page: Number(paginate),
                current_page: Number(page),
                first_page: 1,
                last_page: lastPage,
                from,
                to,
                page_sizes: [ 12, 24, 50 ]
            },
            data: inquiry.results
        };
    }
}
