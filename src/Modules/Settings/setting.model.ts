
import { TimestampedModel }                   from '../Shared/TimestampedModel'

export default class Setting extends TimestampedModel {

    // Table name
    static tableName = 'system'
    static defaultSort = 'name'

    // Table columns
    id!: string
    filter!: string | null
    description!: string | null


    static jsonSchema = {
        type: 'object',
        required: [ 'description' ],
        properties: {
            description: { type: 'string', minLength: 3 }
        }
    }

    // Formats img and thumb fields when existing model value returns from database


    /*
     * ---------------------------------------------------------------------
     * Model Relations
     * ---------------------------------------------------------------------
     */

}

