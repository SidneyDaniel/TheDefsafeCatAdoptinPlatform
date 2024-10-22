import { AdoptionRequest, PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
const prisma = new PrismaClient();

// export default defineEventHandler(async (event) => {
//     const body: AdoptionRequest = await readBody(event);

//     const res = await prisma.adoptionRequest.update({
//         where: {id: Number(event.context.params?.id)},
//         data: {
//             status: body.status
//         }
//     })
    
//     return res
// })


export default defineEventHandler(async (event) => {
    const body: AdoptionRequest = await readBody(event);
    
    try {
        const result  = await prisma.$transaction(async(tx) =>{
            const updateStatus = await tx.adoptionRequest.update({
                where: { id: Number(event.context.params?.id) },
                data: { status: body.status }
            })

            
            // const updateCatOwner = await tx.cat.update({
            //     where: {id: body.catId},
            //     data: {ownerId: body.userId}
            // })

            // const deleteCaOwner = await tx.cat.update({
            //     where: { id: body.catId },
            //     data: { ownerId: null }
            // })

            if (body.status === 'approved') {
                try {
                    const updateCatOwner = await tx.cat.update({
                        where: {id: body.catId},
                        data: {ownerId: body.userId}
                    })
                    
                    return updateCatOwner
                } catch (error) {
                    const typedError = error as Error
                    throw new Error(typedError.message); 
                } finally {
                    return updateStatus
                }
            }

            if(body.status === 'canceled') {
                try {
                    const deleteCaOwner = await tx.cat.update({
                        where: { id: body.catId },
                        data: { ownerId: null }
                    })

                    return deleteCaOwner
                } catch (error) {
                    const typedError = error as Error
                    throw new Error(typedError.message); 
                } finally{
                    return updateStatus
                }
            }


            if (body.status === 'rejected') { 
                try {
                    const userToDelete = await tx.user.findUnique({
                        where: { id: body.userId },
                    });

                    const deleteStatus = await tx.user.delete({ 
                        where: { id: body.userId } 
                    });
                    
                    if( userToDelete ) {
                        return deleteStatus
                    } else {
                        console.warn(`User with ID ${body.userId} not found for deletion.`);
                    }
                } catch (error) {
                    const typedError = error as Error
                    throw new Error(typedError.message); 
                } finally {
                    return updateStatus
                }
                
                // await tx.adoptionRequest.delete({ where: {id: body.id}})
            } 
            
        })
                
        return {
            success: true,
            message: "Adoption request status updated successfully.",
            data: result,
            code : 200
        }  

    } catch (error) {
        const typedPrismaError = error as PrismaClientKnownRequestError
        return {
            success: false,
            message: "Error updating adoption request. Please try again.",
            error: typedPrismaError.message,
            code: typedPrismaError.code
        }
    } 
})