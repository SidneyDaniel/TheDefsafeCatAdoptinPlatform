import type { AdoptionRequest } from "@prisma/client"

export const useAdoptionStore = defineStore('reqAdoptions', {
    state: () => ({
        adoptionReqs: [] as AdoptionRequest[]
    }),
    actions : {
        async getAllAdoptions() {
            let res: any = await useFetch('/api/get-all-requests')
            this.adoptionReqs = res.data
            console.log(res.data);
            
            return res.data
        }
    }
})