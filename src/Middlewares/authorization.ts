// import {jwt} from 'jsonwebtoken'
// require("dotenv").config();
//
// module.exports = async (req,res,next)=>{
//     try{
//
//         const jwtToken = req.header("token");
//         if (!jwtToken){
//             return res.status(403).json("غير مصرح بالولوج");
//         }
//         const payload = jwt.verify(jwtToken,process.env.JWT_SECRET);
//         req.user = payload.user;
//
//     } catch (err){
//         console.error(err.message);
//         return res.status(403).json("غير مصرح لك بالولوج");
//     }
// }