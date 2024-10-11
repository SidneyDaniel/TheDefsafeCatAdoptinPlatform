<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const client = useSupabaseClient()
const router = useRouter()
const toast = useToast()

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const state = reactive({
  email: undefined,
  password: undefined,
})

const errorMsg = ref()
const loading = ref(false)

async function onSubmit (event: FormSubmitEvent<Schema>) {
  // Do something with data
  console.log(event.data)

  try {
    loading.value = true
    const {error} =  await client.auth.signInWithPassword({
        email: event.data.email,
        password: event.data.password
    })
    if (error) throw error;
    router.push('/confirm')
  } catch (error) {
    errorMsg.value = (error as Error).message
    toast.add({title: `${errorMsg.value}`})
    console.log(errorMsg);
    console.error(error);  
  } finally {
    loading.value = false
  }
}

definePageMeta({colorMode:'light', layout: 'custom', name: 'login'})
</script>

<template>
    <main class="flex flex-row justify-center items-center gap-5 size-11/12">
        <section class="card w-3/6 h-full pt-11 px-11 bg-primary  bg-no-repeat bg-cover text-white rounded-2xl">
            <h1 class="text-center font-semibold text-[32px]">Welcome to the Cat <br> Adoption Panel</h1>
            <!-- <img  src="../public/Cat.svg" class="w-full" alt=""> -->
        </section>
        <section class="flex justify-center size-3/6">
            <div class="flex flex-col gap-5 w-full max-w-lg">
                <h1 class="flex items-center gap-2 text-primary font-medium text-2xl">
                    <UIcon name="i-token-branded-pussy" class="text-inherit size-20" />
                    Cat Adoption Platform</h1>
                <UDivider />
    
                <h1 class=" font-semibold text-2xl">Login</h1>
                <UForm :schema="schema" :state="state" class="space-y-4 grid gap-2" @submit="onSubmit">
                    <UFormGroup name="email" class="text-blueGem-400 grid gap-2">
                        <template #label>
                            <label class="text-primary text-base font-semibold">Email</label>
                        </template>
                        <UInput v-model="state.email" size="xl" placeholder="Enter the user name" />
                    </UFormGroup>
    
                    <UFormGroup name="password">
                        <template #label>
                            <label class="text-primary text-base font-semibold">Password</label>
                        </template>
                        <UInput v-model="state.password" type="password"  size="xl" placeholder="Enter the password" />
                    </UFormGroup>
    
                    <UButton type="submit" class="p-3" size="xl" block>
                        <UIcon v-if="loading" name="i-svg-spinners-gooey-balls-1" class="w-5 h-5" />
                        <span v-else>Submit</span>
                    </UButton>
                </UForm>
            </div>
        </section>
    </main>
</template>

<style scoped>
.card{
    background-image: url(../public/Cat.svg), url(../public/Background.svg);
    background-position-y: 11rem, 0px;
    background-position-x: center;
}
</style>
  