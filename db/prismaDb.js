import { PrismaClient } from "@prisma/client";

let prismadb;
if (typeof global.prisma !== "undefined") {
    prismadb = global.prisma;
} else {
    prismadb = new PrismaClient();
    if (process.env.NODE_ENV !== "production") {
        global.prisma = prismadb;
    }
}

export default prismadb;