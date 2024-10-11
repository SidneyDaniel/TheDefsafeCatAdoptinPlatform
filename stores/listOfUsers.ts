import type { User } from "@prisma/client"

export const useUsersStore = defineStore('users', {
    state: () => ({
        listUsers: [] as User[]
    }),
    actions : {
        async getAllUsers() {
            let res: any = await useFetch('/api/get-all-users')
            this.listUsers = res.data
            console.log(res.data);
            
            return res.data
        }
    }
})