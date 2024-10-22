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


function getStatusFromParams(stat: string) {
  switch (stat) {
    case 'approve':
      return 'approved';
    case 'cancel':
      return 'canceled';
    case 'reject':
      return 'rejected';
    default:
      return 'pending'; 
  }
}


const updateStatus = async(id: any, catID: number ,userID: number ,statusReceived: string) =>{
  let res = confirm('Are you sure you want to set this status?')
  let setNewStatus = ref() 

  if (!res) return
  const a = getStatusFromParams(statusReceived)
  setNewStatus.value = a
  console.log('Status registrado: ',id, setNewStatus.value);
  
  try {
     await useFetch(`/api/update-status/${id}`, {
      method: 'PUT',
      body: {
        status: setNewStatus,
        userId: userID,
        catId: catID
      }
    }) 
  } catch (error) {
    console.log(error);
  } finally{
    await useAdoption.getAllAdoptions()
    await useUsers.getAllUsers()
    await useCats.getAllCats()

  }
}


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
    case 'pending':
      return 'orange'
    case 'approved':
      return 'green'
    case 'rejected':
      return 'red'
    case 'canceled':
      return 'yellow'
    default:
      break;
  }
}
</script>

<template>
  <UTable :rows="adoptionReqs" :columns="columnsRequest" class="border rounded-xl">
    <template #expand="{ row }">
      <div class="p-4">
        <pre>
          <div class="flex flex-row w-fit gap-8 border rounded-md p-5">
            <div class="flex flex-row w-fit gap-10">
              <UChip size="3xl" class="w-fit h-fit" position="bottom-right" :ui="{ base: 'rounded-lg ring-1', size: { '3xl' : 'h-fit min-w-[1.25rem] text-[14px] p-1'}}">
                  <img :src="`${ getImageUrl( getCatData(row.catId).image ) }`" :key="row.id" alt="" class="w-48 h-48 rounded-xl object-cover relative">
                  <template #content>
                    <span class="flex gap-2">
                      <UIcon name="i-solar-cat-bold" class="w-5 h-5" />
                      <h2> {{ getCatData(row.catId).name}} </h2>
                    </span>
                  </template>
              </UChip> 
              <UDivider icon="i-arcticons-cats-and-soup" orientation="vertical"/>
              <div style="font-family: 'Inter', sans-serif" class="flex">
                <ul class="flex flex-col gap-3">
                  <!-- <h1 class="">Request from</h1> -->
                  <UKbd size="md">Request From</UKbd>
                  <li class="flex flex-col">
                    <h1 class="text-primary font-semibold">Name</h1>
                    <h2 class="text-[15px]">{{ getUserData(row.userId).name }}</h2>
                  </li>
                  <li class="flex flex-col">
                    <h1 class="text-primary font-semibold">Phone number</h1>
                    <h2 class="text-[15px]">{{ getUserData(row.userId).phone }}</h2>
                  </li>
                  <li class="flex flex-col">
                    <h1 class="text-primary font-semibold">Email</h1>
                    <h2 class="text-[15px]">{{ getUserData(row.userId).email }}</h2>
                  </li>
                </ul>
              </div>
            </div>
            <div class="flex flex-col gap-3 w-fit">
              <UButton size="sm" color="gray"square icon="i-mdi-light-cancel" @click="updateStatus(row.id, row.catId, row.userId, 'reject')"/>
              <UButton size="sm" color="red" icon="i-material-symbols-light-cancel-outline" @click="updateStatus(row.id, row.catId,row.userId, 'cancel')"/>
              <UButton size="sm" color="green" icon="i-fluent:checkmark-circle-12-regular" @click="updateStatus(row.id, row.catId, row.userId,'approve')"/>     
            </div>
          </div>
        
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
</template>


