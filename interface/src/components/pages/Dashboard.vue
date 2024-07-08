<template>
  <div class="dashboard" v-if="user">
    <h1 class="text-white text-xl font-bold">User Dashboard</h1>
    <div class="user-info my-4 p-4 bg-white rounded shadow-md">
      <div class="flex justify-between my-2">
        <span class="user-data-definition">Name:</span>
        <p class="user-data">{{ user.name }}</p>
      </div>
      <div class="flex justify-between my-2">
        <span class="user-data-definition">Email:</span>
        <p class="user-data">{{ user.email }}</p>
      </div>
      <div class="flex justify-between my-2">
        <span class="user-data-definition">Phone:</span>
        <p class="user-data">{{ user.phone }}</p>
      </div>
    </div>
      <CreateTodo @todo-added="addTodoToList" />
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
        <li v-for="todo in filteredTodos" :key="todo.id" class="flex gap-2 mt-2 items-center">
          <label class="custom-checkbox">
            <input type="checkbox" v-model="todo.completed" />
            <span class="checkmark"></span>
          </label>
          <span>{{ todo.title }}</span>
          <button @click="toggleFavorite(todo.id)" class="ml-auto btn-favorite">
            <StarIcon :fill="isFavorite(todo.id) ? '#FF8D24' : 'rgb(0,0,0,0)'" stroke="#FF8D24" stroke-width="1"/>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import CreateTodo from '../singles/CreateTodo.vue'
import StarIcon from '../icons/StarIcon.vue'
import useHandleError from '../../composables/useHandleError'

const route = useRoute()
const router = useRouter()

const user = ref(null)
const todos = ref([])
const statusFilter = ref('all')
const userIdFilter = ref('all')
const searchTerm = ref('')
const favoriteTodos = ref([])

const fetchUserData = async (userId: string) => {
  const { data } = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`)
  user.value = data
}

const fetchTodos = async () => {
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/todos')
  todos.value = data
}

onMounted(async () => {
  const userId = route.query.userId as string
  if (!userId) {
    useHandleError().handleCurrentError(router, 'No user provided')
    return
  }
  try {
    await fetchUserData(userId)
    await fetchTodos()
  } catch (error) {
    console.log('🚀 ~ onMounted ~ error:', error)
    useHandleError().handleCurrentError(router, error as string)
  }
  const storedFavorites = localStorage.getItem('favoriteTodos')
  if (storedFavorites) {
    favoriteTodos.value = JSON.parse(storedFavorites)
  }
})

const addTodoToList = (todo) => {
  todos.value.push(todo)
}

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

const isFavorite = (todoId) => {
  return favoriteTodos.value.includes(todoId)
}

const toggleFavorite = (todoId) => {
  if (isFavorite(todoId)) {
    favoriteTodos.value = favoriteTodos.value.filter(id => id !== todoId)
  } else {
    favoriteTodos.value.push(todoId)
  }
  localStorage.setItem('favoriteTodos', JSON.stringify(favoriteTodos.value))
}
</script>

<style scoped>

.dashboard{
  display: flex;
  flex-direction: column;
  gap: 20px;
}
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

.btn-favorite {
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}
.btn-favorite:hover {
  transform: scale(1.2);
}

.user-data-definition {
  font-weight: bold;
  color: #333;
  width: 100px;
}

.user-data {
  color: #555;
}
</style>
