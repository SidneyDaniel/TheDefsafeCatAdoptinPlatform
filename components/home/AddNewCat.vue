<script setup lang="ts">
const isOpen = ref(false)

import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { v4 as uuidv4 } from 'uuid';
import { useCatStore } from '~/stores/catStore'

const toast = useToast()
const client = useSupabaseClient()
const useStore = useCatStore()

const schema = z.object({
  name: z.string(),
  description: z.string()
})

type Schema = { image: File , name: String, description: String }

const state = reactive({
  image: undefined,
  name: undefined,
  description: undefined,
})

let file = ref(null)
let fileDisplay = ref(null)
let fileData: Ref<File | null> = ref(null)

const onChange = () => {
    const fileInput = event?.target as HTMLInputElement
    const selectedFile = fileInput.files?.[0]
    const fileUrl = ref()

    if (selectedFile) {
        fileUrl.value = URL.createObjectURL(selectedFile)
    
        
        fileDisplay.value = fileUrl.value
        fileData.value = selectedFile
    }

    console.log(fileDisplay.value, fileData.value);
    
}

const errorMsg = ref()
const loading = ref(false)

async function onSubmit (event: FormSubmitEvent<Schema>) {
  loading.value = true;

  const image = event.data.image;
  const name = event.data.name;
  const description  = event.data.description;
  const uuiGenerator = uuidv4()
  const unique_ui = ref() 

  unique_ui.value = uuiGenerator

  console.log(event.data)
  if (fileData.value) {
    const { data, error } = await client
        .storage
        .from('Cat-Adoption-Files')
        .upload(`${unique_ui.value}`, fileData.value)
        
        if (data) {
            toast.add({title: `Cat image whith th ID: ${data?.id} added in the collection`})
        } else {
            toast.add({title: `Error: ${error?.message}, caused by :${error?.cause}`})
        }

  }

  try {
    await useFetch(`/api/create-cats`, {
        method: 'POST',
        body:  {
            image: unique_ui.value,
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
</script>

<template>
    <div class="flex items-center gap-4">
        <span class="p-3 rounded-xl bg-charcoalGray-50">
            <UIcon name="i-solar-cat-bold" class="text-inherit size-14 text-primary" />
        </span>
        <h1 class="font-semibold text-[#26203b] text-[32px] ">Cat List</h1>
    </div>
    <UButton label="New Cat" size="xl" class="w-32 h-16 grid" @click="isOpen = true" />

    <UModal v-model="isOpen" prevent-close>
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800 p-2' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Register New Cat
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
                    <UInput v-model="state.image" @input="onChange" type="file" size="xl" placeholder="URL and Upload" icon="i-ph-camera-fill" color="primary" class="!order-2" accept=".jpg, .jpeg, .png" />
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

