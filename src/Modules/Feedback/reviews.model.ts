  import { Model, QueryContext } from 'objection'

import { TimestampedModel }    from '../Shared/TimestampedModel'

export default class Reviews extends TimestampedModel {

    // Table name
    static tableName = 'reviews'

    // Table columns
    user_id!: string
    movie_id!: string
    id!: string
    comment!: string
    feedback!: string
    /*
     * ---------------------------------------------------------------------
     * Static methods
     * ---------------------------------------------------------------------
     */
}