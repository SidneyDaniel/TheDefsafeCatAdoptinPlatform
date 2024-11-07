import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
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
    const cat = await prisma.cat.findUnique({
        where: { id: body.catSelected },
    })

    console.log(cat?.ownerId);

    try {
        if (cat?.ownerId) return {success: false, message: 'This cat already has a owner!', code: 400}
        
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
            data: result,
            code: 200
        }
        
    } catch (error) {
        const typedError = error as PrismaClientKnownRequestError
        return {
            success: false,
            message: "Error please try again",
            error: typedError.message,
            code: typedError.code
        }
    }
})