import { Router }   from 'express'
import {bcrypt} from 'bcrypt'
import { Multer }   from '../../Middlewares/multer'
import { logout }   from './logout'
import { me }       from './me'
import { webLogin } from './web-login'
const jwtGenerator = require('../../Utils/jwtGenerator')
//import {register} from "./register";
import { Pool } from 'pg';
import {DB} from "../../config";
import {config} from "dotenv";
import {pool} from "../../../knexfile";
import {genSalt} from "bcryptjs";

export const PublicAuthRoutes = (router: Router, prefix: string) => {

    router.post(
        `${ prefix }/register`,
        async (req,res) => {
            try {
                const {name, email, password} = req.body;
                const user = await pool.query("SELECT * FROM users WHERE email=$1",
                    [email]);
                if(user.rows.length !== 0){
                    return res.status(401).send("المستخدم موجود");
                }
                const saltRound = 10;
                const salt = await bcrypt.genSalt(saltRound);
                const bcryptPassword = await bcrypt.hash(password, salt);

                const newUser = await pool.query(
                    "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING *",
                    [name, email, bcryptPassword]
                );
                res.json(newUser.rows[0]);

                const token = jwtGenerator(newUser.rows[0].id);
                res.json(token);

            } catch (err){
               console.error(err.message);
               res.status(500).send("server error");
            }

        });

    router.post(
        `${ prefix }/web-login`,
        Multer.none,
        webLogin
    )

    router.get(`${ prefix }/me`, me)

    router.get(`${ prefix }/logout`, logout)

    // router.post(
    //     `${ prefix }/register`,
    //     // Multer.none,async (req,res) =>{
    //     //     const {name,email,phone, password,birthOfDate} = req.body;
    //     //     try{
    //     //         //const user = await Pool.query("SELECT * FROM users WHERE email = $1",[email])
    //     //     }
    //     // }
    // )
}
