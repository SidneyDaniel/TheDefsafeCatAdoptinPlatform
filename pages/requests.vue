<script setup lang="ts">
const user = useSupabaseUser()
definePageMeta({colorMode:'light',  layout: 'default'})
</script>

<template>
    <section class="flex flex-col p-10 gap-5 w-full h-full">
        <header class="flex flex-row justify-between w-full ">
            request page
        </header>
        <main class="w-full">
            <RequestsRequestTable/>
        </main>
    </section>
</template>

<style scoped>

</style>