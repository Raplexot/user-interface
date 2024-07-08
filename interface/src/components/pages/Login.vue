<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="login-wrapper flex justify-center items-center h-full w-full">
    <form @submit.prevent="handleLogin" class="login-form w-1/4">
      <div class="login-form-header">
        Log In
      </div>
      <div class="flex flex-col gap-4 p-8">
        <div class="flex">
          Enter Your credentials
        </div>
        <div class="flex items-center">
          <input
            type="text"
            v-model="username"
            placeholder="Username"
            id="username"
            required
            pattern="[A-Za-z]+"
            class="input"
            @input="validateUsername"
          />
        </div>
        <div v-if="usernameError" class="text-red-500">{{ usernameError }}</div>
        <div class="flex items-center">
          <input
            type="text"
            v-model="phone"
            id="phone"
            placeholder="Phone Number"
            required
            pattern="^[0-9\-\+\(\)\ ]+$"
            class="input"
            @input="validatePhone"
          />
        </div>
        <div v-if="phoneError" class="text-red-500">{{ phoneError }}</div>
        <button type="submit" class="btn">Login</button>
        <p v-if="error" class="text-red-500">{{ error }}</p>
      </div>
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
const usernameError = ref('')
const phoneError = ref('')
// Samantha
// 1-463-123-4447
const router = useRouter()

const validateUsername = () => {
  const regex = /^[A-Za-z]+$/
  usernameError.value = regex.test(username.value) ? '' : 'Username must contain only alphabetic characters.'
}

const validatePhone = () => {
  // eslint-disable-next-line no-useless-escape
  const regex = /^[0-9\-\+\(\)\ ]+$/
  phoneError.value = regex.test(phone.value) ? '' : 'Phone number must contain only numbers, spaces, or symbols like - + ( ).'
}

const handleLogin = async () => {
  validateUsername()
  validatePhone()

  if (usernameError.value || phoneError.value) {
    return
  }

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
  .login-wrapper {
    background-color: rgba(84, 84, 84, 0);
  }

  .login-form {
    background-color: #C3C3C3;
  }

  .login-form-header {
    background-color: #A5A5A5;
    padding: 15px 0;
  }

  .input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
  }

  .btn {
    padding: 0.5rem 1rem;
    background-color: #519945;
    font-weight: 600;
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }
</style>
