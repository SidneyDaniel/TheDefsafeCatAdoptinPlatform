import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async(event) => {
    let cats = await prisma.cat.findMany({
        orderBy: { id:"asc" },
        // include: { adoptionRequests: true }
    })
    return cats
})