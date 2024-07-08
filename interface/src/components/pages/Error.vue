<template>
    <div class="flex flex-col gap-12">

        <h1 class="text-red-600 font-bold" style="font-size: 48px;">ERROR</h1>
        <div class="text-white font-semibold" style="font-size: 32px;">
            {{ error }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useHandleError from '../../composables/useHandleError'

const error = computed(() => {
  console.log('🚀 ~ error ~ useHandleError().error:', useHandleError().error)
  return useHandleError().error
})
</script>

<style scoped>

</style>
