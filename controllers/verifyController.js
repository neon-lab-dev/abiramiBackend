import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { sendResponse } from "../middlewares/sendResponse.js";
import ENV_CONFIG from "../config/config.js";
import prismadb from "../db/prismaDb.js";
import jwt from "jsonwebtoken";

export const verify= catchAsyncErrors(async (req, res) => {
    const token=req.query;
    console.log("token", token.token);
    const decoded = jwt.verify(token.token, ENV_CONFIG.JWT_SECRET);
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

    return sendResponse(res, {
      status: 200,
      data: admin,
    });
})  