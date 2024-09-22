<script setup lang="ts">
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

const pet = [{
  id: 1,
  name: 'Lindsay Walton',
  image: 'https://fastly.picsum.photos/id/237/536/354.jpg?hmac=i0yVXW1ORpyCZpQ-CknuyV-jbtU7_x9EBQVhvT5aRr0',
  description: 'Likes something new',
  condition: false
}, {
  id: 2,
  name: 'Courtney Henry',
  image: '',
  description: 'Likes water',
  condition: true
}
]

const items = (row: { id: number; }) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => console.log('Edit', row.id)
  }],[{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    
  }]
]

const selected = ref([pet[1]])
</script>

<template>
  <UTable v-model="selected" :rows="pet" :columns="columns" class="border rounded-xl">
    <template #name-data="{ row }">
      <span :class="[selected.find(animal => animal.id === row.id) && 'text-primary-500 dark:text-primary-400']">{{ row.name }}</span>
    </template>

    <template #actions-data="{ row }">
      <UDropdown :items="items(row)">
        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
      </UDropdown>
    </template>

    <template #image-data="{ row }">
      <!-- <img :src="row.image" alt="Profile Image" width="50" height="50" />  -->
      <UAvatar
        :chip-color="row.condition ? 'orange': 'green'"
        icon="i-heroicons-photo"
        chip-position="top-right"
        size="sm"
        :src="row.image ? row.image : undefined"
        alt="Avatar"
      />
    </template>
    
    <template #condition-data="{row}">
      <UBadge class="w-20 grid justify-center" :color="row.condition ? 'orange': 'green'">{{ row.condition ? 'Adopted' : 'Not adopted' }}</UBadge>
    </template>
  </UTable>
</template>


