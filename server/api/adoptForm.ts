import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface Cats {
    image: string,
    name: string,
    description: string
}

export default defineEventHandler(async (event) => {
    const body: Cats = await readBody(event);

    const res = await prisma.cat.create({
        data: {
            image: body.image,
            name: body.name,
            description: body.description
        }
    })
    
    return res
})