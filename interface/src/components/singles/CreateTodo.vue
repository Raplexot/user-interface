<template>
    <div class="create-todo flex flex-col gap-4 p-4 bg-white rounded shadow-md">
      <h2 class="text-xl font-bold">Create Todo</h2>
      <input v-model="newTodo.userId" type="number" placeholder="User ID" class="form-input" />
      <input v-model="newTodo.title" type="text" placeholder="Title" class="form-input" />
      <button @click="addTodo" class="btn">Add Todo</button>
      <p v-if="error" class="text-red-500">{{ error }}</p>
    </div>
  </template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const newTodo = ref({ userId: '', title: '' })
const error = ref('')

// eslint-disable-next-line no-undef
const emits = defineEmits<{(e: 'todo-added', data:any): void
}>()

const addTodo = async () => {
  if (!newTodo.value.userId || !newTodo.value.title) {
    error.value = 'Both fields are required.'
    return
  }

  try {
    const { data } = await axios.post('https://jsonplaceholder.typicode.com/todos', {
      userId: newTodo.value.userId,
      title: newTodo.value.title,
      completed: false
    })
    emits('todo-added', data)
    newTodo.value = { userId: '', title: '' }
    error.value = ''
  } catch (e) {
    error.value = 'Error adding todo'
  }
}
</script>

  <style scoped>
  .create-todo {
    max-width: 400px;
    margin: auto;
  }
  .form-input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    transition: border-color 0.2s;
  }
  .form-input:focus {
    outline: none;
    border-color: #3182ce;
  }
  .btn {
    padding: 0.5rem 1rem;
    background-color: #519945;
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s;
  }
  .btn:hover {
    background-color: #57a848;
  }
  </style>
