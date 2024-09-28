import type { AdoptionRequest } from "@prisma/client";

type Cat = {
    id: number;
    image: string;
    name: string;
    description: string;
    ownerId: number | null;
    adoptionRequests: AdoptionRequest[];
};

export const useCatStore = defineStore('cats', {
    state: () => ({
      cats: [] as Cat[],
      isMenuOverlay: false,
      isLogoutOverlay: false,
    }),
  
    actions: {
      async getAllCats(): Promise<Cat[]> {
        let res: any = await useFetch('/api/get-all-cats')
        this.cats = res.data
        return res.data
      }
    },
  })