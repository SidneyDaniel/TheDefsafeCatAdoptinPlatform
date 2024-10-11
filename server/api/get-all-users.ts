import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async(event) => {
    let listOfUsers = await prisma.user.findMany({
        orderBy: { id:"asc" },
        // include: { adoptionRequests: true }
    })
    return listOfUsers
    
})