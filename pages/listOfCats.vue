<script setup lang="ts">
const isOpen = ref(false)
const catClicked: Ref = ref(null)

import type { AdoptionRequest } from '@prisma/client';
import { useCatStore } from '~/stores/catStore'
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'


const client = useSupabaseClient()

const phoneRegex = /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:(9)\s?(\d{4})\-?(\d{4}))$/;
const schema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().regex(phoneRegex, {message: "Number phone invalid!"}),
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
  email: undefined,
  phone: undefined,
  description: undefined
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


function getImageUrl(fileName: string) {
  try {
    const { data } = client
        .storage
        .from('Cat-Adoption-Files')
        .getPublicUrl(fileName)
    
  return data?.publicUrl 
  } catch (error) {
    return null
  }
}

// type Schema = { name: String, email: String, phone: String, description: String  }

type Schema = z.output<typeof schema>


const pet: ComputedRef<Cat[]> = computed(() => cats.value || [])
console.log(pet.value.map(image => image.image));

// const selected = ref([pet.value.map(id => id.id)])
// console.log(selected.value);
function takeCatData(ID: number){
    isOpen.value = true 
    return catClicked.value = ID
}


async function onSubmit (event: FormSubmitEvent<Schema>) {
  loading.value = true;
  
  const name = event.data.name;
  const email = event.data.email;
  const telephone = event.data.phone;
  const description  = event.data.description;
  const catSelected = catClicked.value;

  const Cid = idClicked.value
  const Cimg = imageClicked.value

  console.group(name, email, telephone, description, catSelected);
  

  try {
    await useFetch(`/api/adoptForm`, {
        method: 'POST',
        body:  {
            name, 
            email, 
            telephone, 
            description, 
            catSelected
        } 
    })
    await useStore.getAllCats()
  } catch (error) {
    console.log(error);
    loading.value = false
    
  }finally{
    loading.value = false
  }

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
                <UCard v-for="cat in cats" class="w-72 h-fit" :key="cat.id"> 
                    <div class="grid gap-3">
                        <div class="flex justify-center w-full h-56 bg-blue-100 rounded-xl">
                            <Icon v-if="!cat.image" name="i-lets-icons-img-box-fill" class="w- full h-56"/>
                            <img v-else :src="`${getImageUrl(cat.image)}`" :key="cat.id" alt="" class="w-full h-56 rounded-xl object-cover">
                        </div>
                        <h1 class="text-2xl font-semibold">{{ cat.name }}</h1>
                        <p>{{ cat.description }}</p>
                        <UButton label="Adopt" size="xl" block class="h-12 grid" @click="takeCatData(cat.id)" />
                    </div>    
                </UCard>
            </div>

            <UModal v-model="isOpen" prevent-close>
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
                            <UInput v-model="state.name" size="xl" />
                        </UFormGroup>

                        <UFormGroup name="email">
                            <template #label>
                                <label class="text-primary text-base font-semibold">Email</label>
                            </template>
                            <UInput v-model="state.email" size="xl"  />
                        </UFormGroup>


                        <UFormGroup name="phone">
                            <template #label>
                                <label class="text-primary text-base font-semibold">Telephone</label>
                            </template>
                            <UInput v-model="state.phone" size="xl" type="tel"/>
                        </UFormGroup>
                        

                        <UFormGroup name="description">
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
            </UModal>
        </main>
    </section>

    
</template>