<script setup lang="ts">
const router = useRouter()
const user = useSupabaseSession()
const session = useSupabaseClient()

const logOut = async () => {
  try {
    const { error } = await session.auth.signOut()
    if (error) {
      throw createError({ statusCode: 400, statusMessage: 'Something went wrong!!!' });
    } else {
      await router.clearRoutes
      await router.push('/')
    }
  } catch (error) { 
    throw createError({ statusCode: 400, statusMessage: 'Something went wrong!!!' });
  }
}

const showNextModelLabel = ref(false)

const nextMode = computed(() => {
    const currentModeIndex = modes.indexOf(useColorMode().value)
    let nextModeIndex = null
    if(currentModeIndex + 1 === modes.length){
        nextModeIndex = 0
    } else {
        nextModeIndex = currentModeIndex + 1
    }

    return modes[nextModeIndex]
})


const modes = [
    'system',
    'light', 
    'dark'
]

const nextModeIcons: { system: string; light: string; dark: string } = {
    system: 'i-line-md:laptop-twotone',
    light: 'i-line-md:moon-alt-to-sunny-outline-loop-transition',
    dark: 'i-line-md:sunny-filled-loop-to-moon-alt-filled-loop-transition'
}


const nextModeIcon = computed(() => nextModeIcons[nextMode.value as keyof typeof nextModeIcons])
const toggleMode = () => useColorMode().value= nextMode.value

</script>

<template>
  <main class="size-full flex justify-center items-center gap-4 p-5">


    <div class="flex flex-col justify-evenly h-full w-96 border rounded-xl">
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
          </ul>
        </nav>

        <div class="flex flex-row gap-4 w-full">
          <ClientOnly>
            <span class="flex items-center p-1 gap-3 ">
              <UAvatar :alt="user?.user.email" size="lg"  />
            </span>
            <div class="flex flex-col justify-center w-full">
              <h1 class="text-sm text-primary">{{ user?.user.email }}</h1>
              <div class="flex justify-end">
                <!-- <button @click="toggleMode" @mouseenter="showNextModelLabel = true"
                  @mouseleave="showNextModelLabel = false" class="flex px-2 py-1 text-primary text-3xl md:text-2xl">
                  <UTooltip text="mode" :shortcuts="[nextMode]">
                    <UIcon :name="nextModeIcon" dynamic class="text-inherit" />
                  </UTooltip>
                </button> -->
  
                <span class="flex items-center justify-end gap-2 pr-2 rounded-xl cursor-pointer" @click="logOut">
                  <UIcon name="i-ic-outline-log-out" class="text-inherit size-6 text-primary" />
                </span>
              </div>
            </div>
          </ClientOnly>
        </div>
      </div>
    </div>
    <slot />
  </main>

</template>

