<template>
  <div class="dashboard" v-if="user">
    <h1 class="text-white text-xl font-bold">User Dashboard</h1>
    <UserData :name="user.name" :email="user.email" :phone="user.phone"/>
    <CreateTodo @todo-added="addTodoToList" />
    <TodoList
      :todos="todos"
      :favorite-todos="favoriteTodos"
      @toggle-favorite="toggleFavorite"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Router, useRoute, useRouter } from 'vue-router'
import CreateTodo from '../singles/CreateTodo.vue'
import useHandleError from '../../composables/useHandleError'
import UserData from '../reusable/UserData.vue'
import TodoList from '../reusable/TodoList.vue'

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const route = useRoute()
const router: Router = useRouter()

const user = ref<User | null>(null)
const todos = ref<Todo[]>([])

const favoriteTodos = ref<number[]>([])

const fetchUserData = async (userId: string) => {
  try {
    const { data } = await axios.get<User>(`https://jsonplaceholder.typicode.com/users/${userId}`)
    user.value = data
  } catch (error) {
    useHandleError().handleCurrentError(router, error as string)
  }
}

const fetchTodos = async () => {
  try {
    const { data } = await axios.get<Todo[]>('https://jsonplaceholder.typicode.com/todos')
    todos.value = data
  } catch (error) {
    useHandleError().handleCurrentError(router, error as string)
  }
}

onMounted(async () => {
  const userId = route.query.userId as string
  if (!userId) {
    useHandleError().handleCurrentError(router, 'No user provided')
    return
  }
  await fetchUserData(userId)
  await fetchTodos()

  const storedFavorites = localStorage.getItem('favoriteTodos')
  if (storedFavorites) {
    favoriteTodos.value = JSON.parse(storedFavorites)
  }
})

const addTodoToList = (todo: Todo) => {
  todos.value.push(todo)
}

const isFavorite = (todoId: number) => {
  return favoriteTodos.value.includes(todoId)
}

const toggleFavorite = (todoId: number) => {
  if (isFavorite(todoId)) {
    favoriteTodos.value = favoriteTodos.value.filter(id => id !== todoId)
  } else {
    favoriteTodos.value.push(todoId)
  }
  localStorage.setItem('favoriteTodos', JSON.stringify(favoriteTodos.value))
}
</script>

<style scoped>

.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  border-color: #519945;
  box-shadow: 0 0 0 1px #519945;
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
  border-color: #519945;
  box-shadow: 0 0 0 1px #519945;
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
