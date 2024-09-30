<template>
<main class="flex justify-center items-center h-[100vh]">
    <div class="flex flex-col items-center gap-2 size-2/3 rounded-lg">
        <UIcon name="i-token-branded-pussy" class="text-inherit size-96" />
        <UChip color="red" text="Code" size="2xl">
            <h1 class="text-[5rem]">{{ error.statusCode }}</h1>
        </UChip>
        <p class="text-3xl">{{ error.message }}</p>
        <UButton @click="handleClearError" color="white" variant="solid">Go Home...</UButton>
    </div>
</main>
</template>

<script setup lang="ts">
definePageMeta({colorMode:'light',  layout: 'custom'})
defineProps(['error'])
const handleClearError = () => clearError({redirect: '/'})
</script>
  