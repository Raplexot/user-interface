<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="dashboard">
      <h1 class="text-white text-xl font-bold">User Dashboard</h1>
      <div v-if="user" class="w-full flex flex-col justify-start text-start text-white my-4">
        <div class="flex gap-4">
          <span>Name:</span>
          <h2>{{ user.name }}</h2>
        </div>
        <div class="flex gap-4">
          <span>Email:</span>
          <p>{{ user.email }}</p>
        </div>
        <div class="flex gap-4">
          <span>Phone:</span>
          <p>{{ user.phone }}</p>
        </div>
      </div>
      <div>
        <h2 class="text-white text-xl font-bold">Todo List</h2>
        <div class="flex gap-4 justify-center my-4">
          <select v-model="statusFilter" class="form-select">
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="uncompleted">Uncompleted</option>
          </select>
          <select v-model="userIdFilter" class="form-select">
            <option value="all">All Users</option>
            <option v-for="userId in userIds" :key="userId" :value="userId">{{ userId }}</option>
          </select>
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Search by title"
            class="form-input"
          />
        </div>
        <ul class="bg-white p-4 rounded">
          <li v-for="todo in filteredTodos" :key="todo.id" class="flex gap-2 mt-2">
            <label class="custom-checkbox">
              <input type="checkbox" v-model="todo.completed" />
              <span class="checkmark"></span>
            </label>
            <span>{{ todo.title }}</span>
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

.custom-checkbox {
  display: inline-block;
  position: relative;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  width: 1.5rem;
  height: 1.5rem;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 1.5rem;
  width: 1.5rem;
  background-color: #eee;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: #3182ce;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.custom-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.custom-checkbox .checkmark:after {
  left: 0.55rem;
  top: 0.45rem;
  width: 0.35rem;
  height: 0.55rem;
  border: solid white;
  border-width: 0 0.2rem 0.2rem 0;
  transform: rotate(45deg);
}

.form-select {
  appearance: none;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}
.form-select:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 1px #3182ce;
}

.form-input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  transition: border-color 0.2s;
  font-size: 1rem;
}
.form-input:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 1px #3182ce;
}
</style>
