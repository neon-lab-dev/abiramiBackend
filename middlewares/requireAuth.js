import ENV_CONFIG from "../config/config.js";
import prismadb from "../db/prismaDb.js";
import { sendResponse } from "./sendResponse.js";
import jwt from "jsonwebtoken";

export const verifyTokenAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendResponse(res, {
      status: 401,
      message: "Authorization token missing or invalid",
    });
  }

  const token = authHeader.split(" ")[1];
  console.log("token", token);
  try {
    console.log("hello");
    const decoded = jwt.verify(token, ENV_CONFIG.JWT_SECRET);
    res.locals.jwtData = decoded;
    console.log("decoded", decoded);
    const admin = await prismadb.admin.findFirst({
      where: {
        id: decoded.id,
      },
    });
    console.log("admin", admin);
    if (!admin) {
      return sendResponse(res, {
        status: 404,
        message: "You are not an admin",
      });
    }
    next();
  } catch (error) {
    return sendResponse(res, {
      status: 401,
      message: "Invalid or expired token",
    });
  }
};
