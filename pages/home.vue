<script setup lang="ts">
const user = useSupabaseUser()
definePageMeta({colorMode:'light'})
</script>

<template>
    <main class="flex flex-row justify-center items-center gap-5 size-11/12">
    Home Route
    {{ user?.email }}
    </main>
</template>

<style scoped>

</style>