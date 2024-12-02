const jwt = require("jsonwebtoken");
export default async function auth(req, res, next) {
    if (!req.headers.authorization || req.cookies.token) {
        res.status(401).json({ msg: "Unauthorized", success: false });
        return;
    }
    const token = req.headers.authorization.split(" ")[1] || req.cookies.token;
    if (!token) {
        res.status(401).json({ msg: "Unauthorized", success: false });
        return;
    }
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user === null) {
        res.status(401).json({ msg: "Unauthorized", success: false });
        return;
    }
    console.log(user);

    req.user = user;
    next();
}