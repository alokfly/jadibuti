const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.SECRETK, (err, user) => {
            if (err) res.status(403).json("Token is Not Valid!");
            req.user = user
            next();
        })
    } else {
        return res.status(401).json("You are not authenticated!");
    }
}

const verifyTokenwithAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.role) {
            next();
        } else {
            res.status(403).json("You Are Not Authorized to Perform That Function")
        }
    })
};

const verifyTokenwithAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role) {
            next();
        } else {
            res.status(403).json("You Are Not Authorized to Perform That Function")
        }
    })
}

module.exports = { verifyToken, verifyTokenwithAuthorization, verifyTokenwithAdmin }