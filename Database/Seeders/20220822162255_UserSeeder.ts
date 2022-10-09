import * as bcrypt from 'bcryptjs'
import { Knex }    from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();


    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash("password", salt)

    // Inserts seed entries
    await knex("users").insert([
        { email: 'admin@google.com', password: hash },
        { email: 'user@google.com', password: hash }
    ]);
}