<template>
    <section class="flex justify-center bg-catImage bg-cover flex-col items-center size-full">
        <main class="flex flex-row p-4 pl-11 items-center size-full">
            <div class="grid gap-5">
                <h1 class="font-black text-4xl text-blueGem-400 drop-shadow-md uppercase">Adopt a cat</h1>
                
                <h2 class="font-medium text-6xl drop-shadow-2xl text-blueGem-300 capitalize">Thousands of <br> Homeless Cats, One <br> Act Of Kindness</h2>
                
                <p class="text-base drop-shadow-md text-blueGem-100">Find your new furry friend today! We have a wide variety of lovable pets available <br> for adoption!</p>

                <span class="flex items-center cursor-pointer drop-shadow-2xl gap-2 bg-blueGem-100 w-fit px-5 py-2 rounded-full shadow-xl  transition-all duration-300 hover:gap-3 hover:tracking-wide">
                    <NuxtLink to="/listOfCats" class="text-xl font-regular text-blueGem-950">Adopt Now</NuxtLink>
                    <UIcon name="i-material-symbols-arrow-forward-ios" class="size-5 text-blueGem-950" />
                </span>
            </div>            
        </main>
        <footer class="flex justify-end items-baseline w-full p-1">
            <NuxtLink to="/login" class="w-fit h-fit font-semibold text-blueGem-50">
                <UIcon name="i-clarity:administrator-line" class="text-inherit size-9"/>
            </NuxtLink>
        </footer>

    </section>
  </template>
  
  <script setup lang="ts">
  definePageMeta({colorMode:'light',  layout: 'custom', name: 'index'})
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>