<template>
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
      <ul class="custom-scrollbar bg-white p-4 rounded overflow-y-scroll" style="max-height: 400px;">
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
  </template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StarIcon from '../icons/StarIcon.vue'

  interface Todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  }

const props = defineProps<{
    todos: Todo[];
    favoriteTodos: number[];
  }>()

const emits = defineEmits(['toggle-favorite'])

const statusFilter = ref('all')
const userIdFilter = ref('all')
const searchTerm = ref('')

const userIds = computed(() => {
  return Array.from(new Set(props.todos.map(todo => todo.userId)))
})

const filteredTodos = computed(() => {
  return props.todos.filter(todo => {
    return (
      (statusFilter.value === 'all' || (statusFilter.value === 'completed' && todo.completed) || (statusFilter.value === 'uncompleted' && !todo.completed)) &&
        (userIdFilter.value === 'all' || todo.userId === parseInt(userIdFilter.value)) &&
        todo.title.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  })
})

const isFavorite = (todoId: number) => {
  return props.favoriteTodos.includes(todoId)
}

const toggleFavorite = (todoId: number) => {
  emits('toggle-favorite', todoId)
}
</script>

  <style scoped>
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #519945 #F5F5F5;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: #F5F5F5;
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #519945;
    border-radius: 10px;
    border: 2px solid #F5F5F5;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #519945;
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
    background-color: #519945;
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
  </style>
