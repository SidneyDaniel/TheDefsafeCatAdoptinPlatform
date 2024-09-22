<script setup lang="ts">
const route = useRoute()
const user = useSupabaseUser()
</script>

<template>
  <div class="h-full w-96 border">
    <h1 class="flex items-center gap-2 text-primary font-medium text-2xl p-1">
      <UIcon name="i-ph-cat-fill" class="text-inherit size-16" />
      Cat Adoption Platform
    </h1>
    <UDivider />
    <div class="flex flex-col justify-center pl-7 mt-8 gap-5">
      <h1 class="font-medium text-charcoalGray-300 px-2">MAIN MENU</h1>
      <nav class="px-2">
        <ul class="group flex flex-col md:space-x-8 gap-2">
            <li class="flex items-center gap-5">
                <UIcon name="i-solar-cat-bold" class="text-inherit size-7 text-primary" />
                <NuxtLink to="/home" class="font-semibold text-primary text-base ">Cat List</NuxtLink>
            </li>
            <!-- <li>
                <NuxtLink to="/about" class="link">Sobre</NuxtLink>
            </li>
            <li>
                <NuxtLink to="/projects" class="link">Projetos</NuxtLink>
            </li>
            <li>
                <NuxtLink to="/blog" class="link">Blog</NuxtLink>
            </li> -->
        </ul>
    </nav>
    </div>

  </div>
  <slot />
</template>

