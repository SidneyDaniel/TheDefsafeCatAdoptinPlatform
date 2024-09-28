<script setup lang="ts">
const route = useRoute()
const user = useSupabaseUser()
</script>

<template>
  <div class="flex flex-col justify-evenly h-full w-96 border">
    <h1 class="flex items-center gap-2 text-primary font-medium text-2xl p-1">
      <UIcon name="i-ph-cat-fill" class="text-inherit size-16" />
      Cat Adoption Platform
    </h1>
    <UDivider />
    <div class="flex flex-col justify-between h-5/6 pl-7 mt-8 gap-5">
      <nav class="px-2">
        <h1 class="font-medium text-charcoalGray-300 mb-5">MAIN MENU</h1>
        <ul class="group flex flex-col gap-2">
            <li class="flex items-center gap-5">
                <UIcon name="i-solar-cat-bold" class="text-inherit size-7 text-primary" />
                <NuxtLink to="/home" class="font-semibold text-primary text-base ">Cat List</NuxtLink>
            </li>

            <li class="flex items-center gap-5">
                <UIcon name="i-material-symbols-mail" class="text-inherit size-7 text-primary" />
                <NuxtLink to="/requests" class="font-semibold text-primary text-base ">Requests</NuxtLink>
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
        <div class="flex flex-row gap-4 max-w-fit">
          <span class="flex items-center p-1 gap-3 ">
            <UAvatar :alt="user?.email" size="md"/>
            <h1 class="text-xs">{{ user?.email }}</h1>
          </span>
        </div>
    </div>
    <span class="flex items-center justify-end gap-2 pr-2 rounded-xl">
            <NuxtLink to="/requests" class=" ">
              <UIcon name="i-ic-outline-log-out" class="text-inherit size-6 text-primary" />
            </NuxtLink>
          </span>
  </div>
  <slot />
</template>

