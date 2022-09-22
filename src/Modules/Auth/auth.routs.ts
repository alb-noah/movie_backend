import { Router }   from 'express'
import {bcrypt} from 'bcrypt'
import { Multer }   from '../../Middlewares/multer'
import { logout }   from './logout'
import { me }       from './me'
import { webLogin } from './web-login'
import {knex} from "../../../knexfile"
const jwtGenerator = require('../../Utils/jwtGenerator');
const validInfo = require('../../Middlewares/validInfo');
const authorrization = require('../../Middlewares/authorization');


export const PublicAuthRoutes = (router: Router, prefix: string) => {

    router.post(
        `${ prefix }/register`,
        validInfo , async (req,res) => {
            try {
                const {name, email, password,age} = req.body;
                const user = await knex.raw("SELECT * FROM users WHERE email=$1",
                    [email]);
                if(user.rows.length !== 0){
                    return res.status(401).send("المستخدم موجود");
                }
                const saltRound = 10;
                const salt = await bcrypt.genSalt(saltRound);
                const bcryptPassword = await bcrypt.hash(password, salt);

                const newUser = await knex.raw(
                    "INSERT INTO users (name, email, password,age) VALUES ($1,$2,$3,$4) RETURNING *",
                    [name, email, bcryptPassword,age]
                );
                res.json(newUser.rows[0]);

                const token = jwtGenerator(newUser.rows[0].id);
                res.json({token});

            } catch (err){
               console.error(err.message);
               res.status(500).send("server error");
            }
        });

    router.post(
        `${ prefix }/web-login`,
        validInfo ,async (req,res) =>{
            try{
                const {email,password} = req.body;
                const user = await knex.raw("SELECT * FROM users where user =$1",[email]);

                if(user.rows.length === 0){
                    return res.status(401).json("خطأ في الايميل او الباسوورد");
                }

                const validPassword = await bcrypt.compare(password, user.rows[0].password);

                if (!validPassword){
                    return res.status(401).json("البريد او كلمة السر خاطئة");

                }

                const token = jwtGenerator(user.rows[0].id);
                res.json({token});

            } catch (e){
                console.error(e.message);
                res.status(500).send("Server Error");

            }
        },
        Multer.none,
        webLogin

    );

    router.get(`${ prefix }/me`, authorrization,
        async (req,res) =>{
            try{
                res.json(true)
            } catch (e){
                console.error(e.message);
                res.status(500).send("Server Error");
            }
        }, me)

    router.get(`${ prefix }/logout`, logout)

}