<script setup lang="ts">
const isOpen = ref(false)

import type { AdoptionRequest } from '@prisma/client';
import { useCatStore } from '~/stores/catStore'
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'


const client = useSupabaseClient()

const schema = z.object({
  name: z.string(),
  description: z.string()
})

type Cat = {
    id: number;
    image: string;
    name: string;
    description: string;
    ownerId?: number | null;
    adoptionRequests?: AdoptionRequest[];
};

const state = reactive({
  name: undefined,
})

const useStore = useCatStore()

let cats: Ref<Cat[]>= ref([])
let isCat = ref(false)
let loading = ref(false)
let idClicked = ref()
let imageClicked = ref()

onBeforeMount(async () =>{
  try {
    loading.value = true
    await useStore.getAllCats()
  } catch (error) {
    console.log(error);
  }finally{
    loading.value = false
  }
})

onMounted(() => {
    watchEffect(() => {
        if (useStore.cats && useStore.cats.length >= 1) {
            cats.value = useStore.cats.map((cat: Cat) => { return {
                id: cat.id,
                name: cat.name,
                image: cat.image,
                description: cat.description,
                condition: cat.adoptionRequests?.map(status => ({ ...status }))
              }
            })
            isCat.value = true

        }
    })
})

watch(() => cats.value, () => {
    if (useStore.cats && useStore.cats.length >= 1) {
        cats.value = useStore.cats
        isCat.value = true
    }
}, { deep: true })




type Schema = { name: String, email: String, phone: String, description: String  }



const pet: ComputedRef<Cat[]> = computed(() => cats.value || [])
console.log(pet.value.map(image => image.image));

// const selected = ref([pet.value.map(id => id.id)])
// console.log(selected.value);

async function onSubmit (event: FormSubmitEvent<Schema>) {
//   loading.value = true;

//   const name = event.data.name;
//   const description  = event.data.description;

//   const Cid = idClicked.value
//   const Cimg = imageClicked.value

//   try {
//     await useFetch(`/api/adoptForm`, {
//         method: 'POST',
//         body:  {
//            name: name,
//            email: email,
//            phone: phone,
//            description: description
           
           
//         } 
//     })

//     await useStore.getAllCats()
//   } catch (error) {
//     console.log(error);
//     loading.value = false
    
//   }finally{
//     loading.value = false
//   }

}

definePageMeta({colorMode:'light',  layout: 'custom'})
</script>

<template>

    <section class="w-full h-full p-10">
        <header>
            <h1 class="flex items-center gap-2 text-primary font-medium text-2xl p-1">
                <UIcon name="i-ph-cat-fill" class="text-inherit size-16" />
                Cat Adoption Platform
            </h1>
            <UDivider />
        </header>

        <main>
            <div class="flex flex-row mt-12 gap-7">    
                <UCard v-for="cat in cats" class="w-72 h-fit"> 
                    <div class="grid gap-3">
                        <div class="flex justify-center size-56 bg-blue-100 rounded-xl">
                            <Icon v-if="!cat.image" name="i-lets-icons-img-box-fill" class="size-56"/>
                            <img v-else :src="cat.image" :key="cat.id" alt="" class="size-56 rounded-xl object-cover">
                        </div>
                        <h1 class="text-2xl font-semibold">{{ cat.name }}</h1>
                        <p>{{ cat.description }}</p>
                        <UButton label="Adopt" size="xl" block class="h-12 grid" @click="isOpen = true" />
                    </div>    
                </UCard>
            </div>

            <!-- <UModal v-model="isOpen" prevent-close>
                <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800 p-2' }">
                    <template #header>
                        <div class="flex items-center justify-between">
                            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                Adopt Form
                            </h3>
                            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                                @click="isOpen = false" />
                        </div>
                    </template>

                    <Placeholder class="h-32" />


                    <UForm :schema="schema" :state="state" class="space-y-4 grid gap-2" @submit="onSubmit">

                        <UFormGroup name="name" class="text-blueGem-400 grid gap-2">
                            <template #label>
                                <label class="text-primary text-base font-semibold">Full Name</label>
                            </template>
                            <UInput v-model="state.image" size="xl" />
                        </UFormGroup>

                        <UFormGroup name="email">
                            <template #label>
                                <label class="text-primary text-base font-semibold">Email</label>
                            </template>
                            <UInput v-model="state.name" size="xl"  />
                        </UFormGroup>


                        <UFormGroup name="Telephone">
                            <template #label>
                                <label class="text-primary text-base font-semibold">Description</label>
                            </template>
                            <UInput v-model="state.description" size="xl"  />
                        </UFormGroup>
                        

                        <UFormGroup name="someText">
                            <template #label>
                                <label class="text-primary text-base font-semibold">Why would you want to adopt this cat?</label>
                            </template>
                            <UInput v-model="state.description" size="xl" />
                        </UFormGroup>

                        <UButton type="submit" class="p-3" size="xl" block>
                            <UIcon v-if="loading" name="i-svg-spinners-gooey-balls-1" class="w-5 h-5" />
                            <span v-else>Submit</span>
                        </UButton>
                    </UForm>

                </UCard>
            </UModal> -->
        </main>
    </section>

    
</template>