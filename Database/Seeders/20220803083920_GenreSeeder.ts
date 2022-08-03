import {Knex} from "knex"

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("genres").del()

    // Inserts seed entries
    await knex.raw(`
        INSERT INTO genres 
            (id,name) 
        VALUES
            (1, '{"en":"drama","ar":"دراما"}'),
            (2, '{"en":"crime","ar":"جريمة"}'),
            (3, '{"en":"action","ar":"عمل"}'),
            (4, '{"en":"adventure","ar":"مغامرة"}'),
            (5, '{"en":"western","ar":"الغربي"}'),
            (6, '{"en":"romance","ar":"رومانسي"}'),
            (7, '{"en":"sci","ar":"خيال علمي"}'),
            (8, '{"en":"biography-fi","ar":"سيرة شخصية"}'),
            (9, '{"en":"thriller","ar":"إثارة"}'),
            (10,'{"en":"war","ar":"حرب"}'),
            (11,'{"en":"fantasy","ar":"خيال"}'),
            (12,'{"en":"animation","ar":"الرسوم المتحركة"}'),
            (13,'{"en":"family","ar":"الأسرة"}'),
            (14,'{"en":"mystery","ar":"الغموض"}'),
            (15,'{"en":"history","ar":"التاريخ"}'),
            (16,'{"en":"comedy","ar":"كوميديا"}');
    `)

    // After seeding insert for postgres integer ids needs to be synced
    await knex.raw('select setval(\'genres_id_seq\', max(id)) from genres')
}
