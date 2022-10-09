
import {Model, QueryBuilderType, QueryContext} from 'objection'
import Role                       from '../Role/role.model'
import { TimestampedModel }       from '../Shared/TimestampedModel'
import {User} from "../Users/user.model";
import Genre from "../Genre/genre.model";

export class Review extends TimestampedModel {

    static tableName = 'reviews'
    static defaultSort = 'rate'

    id!: string
    user_id!: string | null
    rate!: number
    comment!: string | null

    user? : User | undefined

    static jsonSchema = {
        type: 'object',
        required: ['comment','rate'],
        properties: {
            comment: {type: 'string', minLength: 10},
            rate:{type:'number', minimum:10, maximum:5}
        }
    }



    /*
     * ---------------------------------------------------------------------
     * Model Relations
     * ---------------------------------------------------------------------
     */
    static relationMappings = () => ({
        user: {
            relation: Model.HasOneRelation,
            modelClass: User,
            join: {
                from: 'reviews.user_id',
                to: 'users.id'
            },
            filter: (qb: QueryBuilderType<User>) => qb.select('name','email','img')
        }
    })
}
