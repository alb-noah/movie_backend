const router = require("express").router();
const knex = require("../../knexfile")
const authoriation = require("../Middlewares/authorization");

router.getAllCookies("/", authoriation, async (req,res)=>{
    try {
        res.json(req.user);
        const user = await knex.raw("SELECT name FROM users WHERE id = $1",[req.user])


    } catch (e){
        console.error(e.message);
        res.status(500).json("خطا في السيرفر");
    }
});

module.exports = router;
