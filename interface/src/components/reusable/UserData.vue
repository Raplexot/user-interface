<template>
   <div class="user-info my-4 p-4 bg-white rounded shadow-md">
      <div class="flex justify-between my-2">
        <span class="user-data-definition">Name:</span>
        <p class="user-data">{{ props.name }}</p>
      </div>
      <div class="flex justify-between my-2">
        <span class="user-data-definition">Email:</span>
        <p class="user-data">{{ props.email }}</p>
      </div>
      <div class="flex justify-between my-2">
        <span class="user-data-definition">Phone:</span>
        <p class="user-data">{{ props.phone }}</p>
      </div>
    </div>
</template>

<script setup lang="ts">

const props = defineProps<{
    name:string,
    email:string,
    phone:string
}>()

</script>

<style scoped>

.user-data-definition {
  font-weight: bold;
  color: #333;
  width: 100px;
}

.user-data {
  color: #555;
}
</style>
