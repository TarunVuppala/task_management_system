import jwt from 'jsonwebtoken';

export default async function auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new Error("Unauthorized: Missing or invalid Authorization header");
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new Error("Unauthorized: Token not found");
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);
        if (!user) {
            throw new Error("Unauthorized: Token verification failed");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ msg: "Token expired", success: false });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ msg: "Invalid token", success: false });
        }

        return res.status(401).json({ msg: error.message || "Authentication failed", success: false });
    }
}
