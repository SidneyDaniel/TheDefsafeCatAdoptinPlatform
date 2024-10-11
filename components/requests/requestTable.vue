<script setup lang="ts">
import type { AdoptionRequest, User, Cat } from '@prisma/client';

import { useAdoptionStore } from '~/stores/adoptionsRequestsStore';
import { useUsersStore } from '~/stores/listOfUsers';
import { useCatStore } from '~/stores/catStore';

const client = useSupabaseClient()
const isOpen = ref(false)

const useAdoption = useAdoptionStore()
const useUsers = useUsersStore()
const useCats = useCatStore()

const listRequest: ComputedRef<AdoptionRequest[]> = computed(() => useAdoption.adoptionReqs || [])
const listUsers: ComputedRef<User[]> = computed(() => useUsers.listUsers || [])
const listCats: ComputedRef<Cat[]> = computed(() => useCats.cats || [])

let adoptionReqs: Ref<AdoptionRequest[]>= ref([])
let user: Ref<User[]> = ref([])
let cats: Ref<Cat[]> = ref([])

let isCat = ref(false)
let loading = ref(false)
let idClicked = ref()
let imageClicked = ref()

onBeforeMount(async () =>{
  try {
    loading.value = true
    await useAdoption.getAllAdoptions()
    await useUsers.getAllUsers()
    await useCats.getAllCats()
  } catch (error) {
    console.log(error);
  }finally{
    loading.value = false
  }
})

onMounted(() => {
    watchEffect(() => {
      adoptionReqs.value = listRequest.value
      user.value = listUsers.value
      cats.value = listCats.value
    })
})

// watch((adoptionReqs.value, user.value, cats.value), () => {
// console.group();
// console.log(adoptionReqs.value);
// console.log(user.value);
// console.log(cats.value);
// console.groupEnd();

// }, { deep: true })


const columnsRequest = [{
  key: 'id',
  label: 'ID'
},{
  key: 'catId',
  label: 'Cat Requested'
},  {
  key: 'status',
  label: 'Status'
}, {
  key: 'createdAt',
  label: 'Data of Request'
}, {
  key: 'actions'
}]

const columns = [{
  key: 'id',
  label: 'ID'
},{
  key: 'name',
  label: 'Name'
},  {
  key: 'phone',
  label: 'Phone'
}, {
  key: 'Description',
  label: 'Status'
}, {
  key: 'actions'
}]

const columnsCat = [{
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

function getUserData(id:number) {
  const us = user.value.find((u) => u.id === id)
  return us ? us : null as unknown as User
}

function getCatData(id: number) {
  const ca = cats.value.find((c) => c.id === id )
  return ca ? ca : null as unknown as Cat
}


// const deleteCat = async(id: any, image: string[]) =>{
//   let res = confirm('Are you sure you want to delete this post?')

//   if (!res) return

//   try {
//     const {error, data } = await client
//       .storage
//       .from('Cat-Adoption-Files')
//       .remove(image)

//      await useFetch(`/api/delete-cat/${id}`, {method: 'DELETE'}) 
//   } catch (error) {
//     console.log(error);
//   } finally{
//     await useStore.getAllAdoptions()

//   }
// }


// const pet: ComputedRef<AdoptionRequest[]> = computed(() => adoptionReqs.value || [])
// console.log(pet.value.map(image => image.image));
// console.log(pet);


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
    click: () => console.log('clicked')
    
  }]
]

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

//pending, approved, rejected, canceled
function currentStatus(stat: string){
  switch (stat) {
    case stat: 'pending'
      return 'orange'

    case stat: 'approved'
    return 'green'

     case stat: 'rejected'
    return 'red'

      case stat: 'canceled'
    return 'yellow'
    default:
      break;
  }
}
</script>

<template>
  <!-- <UTable  :rows="pet" :columns="columns" class="border rounded-xl">
    <template #actions-data="{ row }">
      <UDropdown :items="items(row)">
        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
      </UDropdown>
    </template>

    <template #image-data="{ row }">
      <UAvatar
        :chip-color="currentStatus(row.condition)"
        icon="i-heroicons-photo"
        chip-position="top-right"
        size="sm"
        :src="`${getImageUrl(row.image)}`"
        alt="Avatar"
      />
    </template>
    
    <template #condition-data="{row}">
      <UBadge class="w-20 grid justify-center" :color="currentStatus(row.condition)">{{ row.condition }}</UBadge>
    </template>
  </UTable>
  {{pet}} -->

  <UTable :rows="adoptionReqs" :columns="columnsRequest" class="border rounded-xl">
    <template #expand="{ row }">
      <div class="p-4">
        <pre>
          <span class="flex flex-row w-fit gap-10 border rounded-md p-5">
            <UChip size="3xl" class="w-fit" position="bottom-right" :ui="{ base: 'rounded-lg ring-1', size: { '3xl' : 'h-fit min-w-[1.25rem] text-[14px] p-1'}}">
                <img :src="`${ getImageUrl( getCatData(row.catId).image ) }`" :key="row.id" alt="" class="w-56 h-56 rounded-xl object-cover relative">
              
                <template #content>
                  <span class="flex gap-2">
                    <UIcon name="i-solar-cat-bold" class="w-5 h-5" />
                    <h2> {{ getCatData(row.catId).name}} </h2>
                  </span>
                </template>
            </UChip>        
          </span>
        </pre>
      </div>
    </template>

    <template #catId-data="{row}">
      <UTooltip :text="`ID: ${getCatData(row.catId).id}`" :popper="{ placement: 'right' }">
          {{ getCatData(row.catId).name }}
      </UTooltip>
    </template>

    <template #status-data="{row}">
      <UBadge class="w-20 grid justify-center uppercase" :color="currentStatus(row.status)">{{ row.status }}</UBadge>
    </template>

    <template #createdAt-data="{row}">
      {{ new Date(row.createdAt).toDateString() ,'in', new Date(row.createdAt).getTime() }}
    </template>
  </UTable>

  <!-- <div class="flex flex-col gap-10">
    <span>
      {{ adoptionReqs }}
    </span>
    <span>
      {{ user }}
    </span>
    <span>
      {{ cats }}
    </span>

  </div> -->
</template>


