<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="login">
      <form @submit.prevent="handleLogin" class="space-y-4 w-12">
        <div>
          <label for="username" class="text-red">Username</label>
          <input type="text" v-model="username" id="username" required pattern="[A-Za-z]+" class="input" />
        </div>
        <div>
          <label for="phone">Phone Number</label>
          <input type="text" v-model="phone" id="phone" required class="input" />
        </div>
        <button type="submit" class="btn">Login</button>
        <p v-if="error" class="text-red-500">{{ error }}</p>
      </form>
    </div>
  </template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const username = ref('')
const phone = ref('')
const error = ref('')

const router = useRouter()

const handleLogin = async () => {
  try {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/users')
    const user = data.find((user: any) => user.username === username.value && user.phone === phone.value)
    if (user) {
      router.push({ path: '/dashboard', query: { userId: user.id } })
    } else {
      error.value = 'Login error'
    }
  } catch (e) {
    error.value = 'Login error'
  }
}
</script>

<style scoped>
  .input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
  }
  .btn {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }
</style>
