import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async(event) => {
    let adoptionsRequests = await prisma.adoptionRequest.findMany({
        orderBy: { id:"asc" },
        // include: { adoptionRequests: true }
    })
    return adoptionsRequests
})