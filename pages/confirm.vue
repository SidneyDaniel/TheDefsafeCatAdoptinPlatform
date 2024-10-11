<script setup lang="ts">
import { ref } from 'vue';

const user = useSupabaseUser();

// Get redirect path from cookies
const cookieName = useRuntimeConfig().public.supabase.cookieName;
const redirectPath = useCookie(`${cookieName}-redirect-path`).value;   


const startTime = ref(Date.now()); // Start timer

watch(user, () => {
  if (user.value) {
    const elapsedTime = (Date.now() - startTime.value) / 1000; // Calculate elapsed time in seconds
    console.log(`Login and redirection took ${elapsedTime} seconds`);

    // Clear cookie
    useCookie(`${cookieName}-redirect-path`).value = null;

    // Add a 5-second delay before redirecting
    setTimeout(() => {
      navigateTo(redirectPath || '/home');
    }, 1000); // 5000 milliseconds = 5 seconds
  }
}, { immediate: true });

definePageMeta({colorMode:'light',  layout: 'custom'})

</script>
<template>  
    <main class="flex justify-center items-center h-[100vh]">
        <UIcon name="i-svg-spinners-pulse-rings-3" class="text-inherit size-96 text-primary" />
    </main>
</template>
