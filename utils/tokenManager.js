import ENV_CONFIG from "../config/config.js";
import { sendResponse } from "../middlewares/sendResponse.js";
import jwt from "jsonwebtoken";



/*
 * Creates a JWT token.
 * @param {object} payload - The payload containing user data.
 * @param {string} expiresIn - Token expiry time.
 * @returns {string} - Signed JWT token.
 */
export const createToken = (payload, expiresIn) => {
    const token = jwt.sign(payload, ENV_CONFIG.JWT_SECRET, {
        expiresIn,
    });
    return token;
};

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;


    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return sendResponse(res, {
            status: 401,
            message: "Authorization token missing or invalid",
        });
    }

    const token = authHeader.split(" ")[1];
    console.log(token)
    try {
        const decoded = jwt.verify(token, ENV_CONFIG.JWT_SECRET);
        res.locals.jwtData = decoded;
        next();
    } catch (error) {
        return sendResponse(res, {
            status: 401,
            message: "Invalid or expired token",
        });
    }
};