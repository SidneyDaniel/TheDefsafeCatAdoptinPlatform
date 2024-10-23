<script setup lang="ts">
const user = useSupabaseUser()
definePageMeta({colorMode:'light',  layout: 'default'})
</script>

<template>
    <section class="flex flex-col gap-5 w-full h-full">
        <header class="flex flex-row justify-between w-full ">
            <div class="flex items-center gap-4">
                <span class="p-3 rounded-xl bg-charcoalGray-50">
                    <UIcon name="i-solar-cat-bold" class="text-inherit size-14 text-primary" />
                </span>
                <h1 class="font-semibold text-[#26203b] text-[32px] ">Cat Requests</h1>
            </div>
        </header>
        <main class="w-full">
            <RequestsRequestTable/>
        </main>
    </section>
</template>

<style scoped>

</style>