<script setup lang="ts">
const user = useSupabaseUser()
definePageMeta({colorMode:'light',  layout: 'default'})
</script>

<template>
    <section class="flex flex-col gap-5 w-full h-full">
        <header class="flex flex-row justify-between w-full ">
            <HomeAddNewCat/>
        </header>
        <main class="w-full">
            <HomeCatsTable/>
        </main>
    </section>
</template>

<style scoped>

</style>