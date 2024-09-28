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
  image: undefined,
  name: undefined,
  description: undefined,
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


const columns = [{
  key: 'image',
  label: 'Image'
},{
  key: 'name',
  label: 'Name'
},  {
  key: 'description',
  label: 'Description'
}, {
  key: 'condition',
  label: 'Condition'
}, {
  key: 'actions'
}]

type Schema = { image: File , name: String, description: String }


const deleteCat = async(id: any, image: string[]) =>{
  let res = confirm('Are you sure you want to delete this post?')

  if (!res) return

  try {
    const {error, data } = await client
      .storage
      .from('Cat-Adoption-Files')
      .remove(image)

     await useFetch(`/api/delete-cat/${id}`, {method: 'DELETE'}) 
  } catch (error) {
    console.log(error);
  } finally{
    await useStore.getAllCats()

  }
}

const pet: ComputedRef<Cat[]> = computed(() => cats.value || [])
console.log(pet.value.map(image => image.image));

const items = (row: { id: number; image: string[] }) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () =>  {
      idClicked.value = row.id
      imageClicked.value = row.image
      isOpen.value = true
    }
  }],[{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: () => deleteCat(row.id, row.image)
  }]
]

// const selected = ref([pet.value.map(id => id.id)])
// console.log(selected.value);

async function onSubmit (event: FormSubmitEvent<Schema>) {
  loading.value = true;

  const image = event.data.image;
  const name = event.data.name;
  const description  = event.data.description;

  const Cid = idClicked.value
  const Cimg = imageClicked.value

  try {
    await useFetch(`/api/update-cat/${Cid}`, {
        method: 'PUT',
        body:  {
            image: image,
            name: name,
            description: description
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

// async function getImageUrl(fileName: string) {
//   const { data } = await client
//         .storage
//         .from('Cat-Adoption-Files')
//         .getPublicUrl(fileName)
  
//   return data.publicUrl 
// }
</script>

<template>
  <UTable  :rows="pet" :columns="columns" class="border rounded-xl">
    <!-- <template #name-data="{ row }">
      <span :class="[selected.find(animal => animal === row.id) && 'text-primary-500 dark:text-primary-400']">{{ row.name }}</span>
    </template> -->

    <template #actions-data="{ row }">
      <UDropdown :items="items(row)">
        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
      </UDropdown>
    </template>

    <template #image-data="{ row }">
      <UAvatar
        :chip-color="row.condition ? 'orange': 'green'"
        icon="i-heroicons-photo"
        chip-position="top-right"
        size="sm"
        :src="`https://fkgywnnadbbpjmyhjyda.supabase.co/storage/v1/object/public/Cat-Adoption-Files/${row.image}`"
        alt="Avatar"
      />
    </template>
    
    <template #condition-data="{row}">
      <UBadge class="w-20 grid justify-center" :color="row.condition ? 'orange': 'green'">{{ row.condition ? 'Adopted' : 'Not adopted' }}</UBadge>
    </template>
  </UTable>

  <UModal v-model="isOpen" prevent-close>
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800 p-2' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Update Cat
                    </h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                        @click="isOpen = false" />
                </div>
            </template>

            <Placeholder class="h-32" />


            <UForm :schema="schema" :state="state" class="space-y-4 grid gap-2" @submit="onSubmit">
                
                <UFormGroup name="image" class="text-blueGem-400 grid gap-2">
                    <template #label>
                        <label class="text-primary text-base font-semibold">Image</label>
                    </template>
                    <UInput v-model="state.image" type="file" size="xl" placeholder="URL and Upload" icon="i-ph-camera-fill" color="primary" class="!order-2" accept=".jpg, .jpeg, .png" />
                </UFormGroup>

                <UFormGroup name="name">
                    <template #label>
                        <label class="text-primary text-base font-semibold">Name</label>
                    </template>
                    <UInput v-model="state.name" size="xl" placeholder="Enter the name" />
                </UFormGroup>

                
                <UFormGroup name="description">
                    <template #label>
                        <label class="text-primary text-base font-semibold">Description</label>
                    </template>
                    <UInput v-model="state.description" size="xl" placeholder="Enter the description" />
                </UFormGroup>

                <UButton type="submit" class="p-3" size="xl" block>
                    <UIcon v-if="loading" name="i-svg-spinners-gooey-balls-1" class="w-5 h-5" />
                    <span v-else>Submit</span>
                </UButton>
            </UForm>

        </UCard>
    </UModal>
</template>


