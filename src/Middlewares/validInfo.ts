// module.exports = function(req, res, next) {
//     const { email, name, password } = req.body;
//
//     function validEmail(email) {
//         return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
//     }
//
//     if (req.path === "/register") {
//         console.log(!email.length);
//         if (![email, name, password].every(Boolean)) {
//             return res.status(401).json("Missing Credentials");
//         } else if (!validEmail(email)) {
//             return res.status(401).json("Invalid Email");
//         }
//     } else if (req.path === "/web-login") {
//         if (![email, password].every(Boolean)) {
//             return res.status(401).json("Missing Credentials");
//         } else if (!validEmail(email)) {
//             return res.status(401).json("Invalid Email");
//         }
//     }
//
//     next();
// };