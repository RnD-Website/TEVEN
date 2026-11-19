<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
useSeoMeta({ title: props.error?.statusCode === 404 ? 'Page not found' : 'Something went wrong' })
const handle = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="err">
    <div class="err__logo"><TevenLogo variant="outline" /></div>
    <p class="t-label">{{ error?.statusCode ?? 'Error' }}</p>
    <h1 class="t-serif-xl">{{ error?.statusCode === 404 ? 'This leaf has drifted away.' : 'Something went wrong.' }}</h1>
    <PillButton label="Back to home" @click="handle" />
  </div>
</template>

<style scoped>
.err { min-height: 100svh; display: grid; place-content: center; justify-items: center; gap: 2.4rem; padding: var(--page-pad); text-align: center; background: var(--bg); color: var(--c-beige-200); }
.err__logo { width: 7.2rem; }
</style>
