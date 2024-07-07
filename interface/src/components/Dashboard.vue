<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="dashboard">
      <h1>User Dashboard</h1>
      <div v-if="user">
        <h2>{{ user.name }}</h2>
        <p>Email: {{ user.email }}</p>
        <p>Phone: {{ user.phone }}</p>
      </div>
      <div>
        <h2>Todo List</h2>
        <select v-model="statusFilter">
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="uncompleted">Uncompleted</option>
        </select>
        <select v-model="userIdFilter">
          <option value="all">All Users</option>
          <option v-for="userId in userIds" :key="userId" :value="userId">{{ userId }}</option>
        </select>
        <input type="text" v-model="searchTerm" placeholder="Search by title" />
        <ul>
          <li v-for="todo in filteredTodos" :key="todo.id">
            <label>
              <input type="checkbox" v-model="todo.completed" />
              {{ todo.title }}
            </label>
          </li>
        </ul>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()

const user = ref(null)
const todos = ref([])
const statusFilter = ref('all')
const userIdFilter = ref('all')
const searchTerm = ref('')

const fetchUserData = async (userId: string) => {
  const { data } = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`)
  user.value = data
}

const fetchTodos = async () => {
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/todos')
  todos.value = data
}

onMounted(() => {
  const userId = route.query.userId as string
  fetchUserData(userId)
  fetchTodos()
})

const userIds = computed(() => {
  return Array.from(new Set(todos.value.map(todo => todo.userId)))
})

const filteredTodos = computed(() => {
  return todos.value.filter(todo => {
    return (
      (statusFilter.value === 'all' || (statusFilter.value === 'completed' && todo.completed) || (statusFilter.value === 'uncompleted' && !todo.completed)) &&
        (userIdFilter.value === 'all' || todo.userId === userIdFilter.value) &&
        todo.title.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  })
})
</script>

<style scoped>
</style>
