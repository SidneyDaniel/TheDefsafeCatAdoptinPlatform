import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface FormValue {
    name: string, 
    email: string,
    telephone: string,
    description: string, 
    catSelected: number
}


export default defineEventHandler(async (event) => {
    const body: FormValue = await readBody(event);

    try {
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name: body.name,
                    email: body.email,
                    phone: body.telephone,
                    description: body.description,
                    adoptedCatsIds: {
                        set: [body.catSelected]
                    }
                }
            })

            const adoptionRequest = await tx.adoptionRequest.create({
                data:{
                    catId: body.catSelected,
                    userId: user.id
                }
            })
            return { user, adoptionRequest }
        })

        return {
            success: true,
            message: "User anc request created",
            data: result
        }
        
    } catch (error) {
        const err = error as Error
        return {
            success: false,
            message: "Error please try again",
            error: err.message,
        }
    }
})