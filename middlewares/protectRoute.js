import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function protectRoute(req, res, next) {
    try {
        const cookieToken = await req.cookies.AuthCookie;
        if(!cookieToken) {
            return res.status(401).json({
                status: 401,
                message: "Cookie not found"
            });
        }
    
        const secretkey = process.env.SECRET_KEY;
        const decoded = jwt.verify(cookieToken, secretkey);
        if(!decoded) {
            return res.status(401).json({
                status: 401,
                message: "Incorrect cookie, unauthorized access"
            });
        }
        
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
}