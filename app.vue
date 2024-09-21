<template>
  <div class="flex justify-center items-center w-screen h-screen">
    <NuxtRouteAnnouncer />
    <!-- <NuxtWelcome /> -->
    <NuxtPage/>
  </div>
  <UNotifications />
</template>
<style>
body {
  font-family: 'Inter', sans-serif;
}
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>