import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { sendResponse } from "../middlewares/sendResponse.js";
import { createToken } from "../utils/tokenManager.js";
import bcrypt from "bcrypt";

import z from "zod";

import prismadb from "../db/prismaDb.js";

const emailSchema = z.string().email();

// create admin
export const createAdmin = catchAsyncErrors(async (req, res) => {
    try {
        const {
            firstName , lastName, email, password
        } = req.body;

        // error handling
        if (
            !firstName || !lastName || !email || !password
        ) {
            return sendResponse(res, {
                status: 400,
                error: "Please fill the required fields",
            });
        }

        if (email) {
            const emailValidation = emailSchema.safeParse(email);
            if (!emailValidation.success) {
                return sendResponse(res, {
                    status: 400,
                    error: "Invalid email",
                });
            }
        }

        const existingAdmin = await prismadb.admin.findFirst({
            where: {
                email
            },
        });

        if (existingAdmin) {
            return sendResponse(res, {
                status: 400,
                error: "Admin already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const admin = await prismadb.admin.create({
            data: { 
                firstName,
                lastName,
                email,
                password:hash
            },
        });
        const adminWithoutPassword = {
            id: admin.id,
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            password: admin.password
        };
        delete adminWithoutPassword.password;

        const token = createToken({ id: admin.id , email:admin.email }, "7d");

        return sendResponse(res, {
            status: 201,
            data: adminWithoutPassword,
            message: "Admin created successfully",
            token
        });
    } catch (error) {
        return sendResponse(res, {
            status: 500,
            error: error.message,
        });
    }
});

// login admin
export const loginAdmin = catchAsyncErrors(async (req, res) => {
    try {
        const { email, password } = req.body;

        // error handling
        if (!email || !password) {
            return sendResponse(res, {
                status: 400,
                error: "Please fill the required fields",
            });
        }


        const admin = await prismadb.admin.findFirst({
            where: {
                email,
            },
        });

        if (!admin) {
            return sendResponse(res, {
                status: 401,
                error: "Invalid credentials",
            });
        }

        const match= await bcrypt.compare(password, admin.password);

        if (!match) {
            return sendResponse(res, {
                status: 401,
                error: "Incorrect passwrod",
            });
        }

        const adminWithoutPassword = {
            id: admin.id,
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            password: admin.password
        };
        delete adminWithoutPassword.password;

        const token = createToken({ id: admin.id , email:admin.email }, "7d");

        return sendResponse(res, {
            status: 200,
            data: adminWithoutPassword,
            message: "Admin logged in successfully",
            token
        });
    } catch (error) {
        return sendResponse(res, {
            status: 500,
            error: error.message,
        });
    }
});