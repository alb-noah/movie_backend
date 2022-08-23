import { QueryBuilder } from 'objection'

export class UtilDatabase {

    // TODO: add sort
    // TODO: add filter
    // TODO: add include

    static async finder(model: any, args: any, query: QueryBuilder<any>): Promise<any> {

        let { lang, page, paginate } = args

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

        // Build the finder inquiry

        let inquiry = await query
            .context({ lang })
            .modify(qb => {
                // if filters
                // if sorts
                // search
            })
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
