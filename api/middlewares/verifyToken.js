const jwt = require("jsonwebtoken");
const User = require('../models/User')

function verify(req, res, next) {
    const authHeader = req.headers?.cookie?.split("=")[1] || req.headers?.token?.split(" ")[1];


    if (authHeader) {
        const token = authHeader
        jwt.verify(token, process.env.SECRET, async (err, user) => {
            if (err) res.status(404).json("Token is not valid!") && next([err]);
            else {
                const userDetails = await User.findById(user.id);
                req.user = user;
                if (userDetails?.blocked) {
                    return res.status(401).json("You are blocked by admin!");
                }
                else {
                    req.user = user;
                    next();
                }
            }
        });
    } else {
        return res.status(401).json("You Are Not Authenticated!");
    }
}
const verifyTokenAndAdmin = (req, res, next) => {
    verify(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            res.status(403).json("You Are Not Allowed To Do That")
        }

    })
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verify(req, res, async () => {
        const user = await User.findById(req.user.id);

        if (!user.blocked && req.params.id === req.user.id || req.user.isAdmin) {
            next()
        } else {
            res.status(403).json('you are not allowed to to that!')
        }
    })
}


module.exports = { verify, verifyTokenAndAdmin, verifyTokenAndAuthorization }