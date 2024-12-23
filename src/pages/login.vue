<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Добро пожаловать</h2>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700">Логин</label>
          <input
              type="text"
              id="username"
              v-model="username"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your username"
          />
        </div>

        <div class="mb-4 relative">
          <label for="password" class="block text-sm font-medium text-gray-700">Пароль</label>
          <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
          />
          <!-- Иконка глаза -->
          <button
              type="button"
              class="absolute right-3 flex items-center"
              @click="togglePasswordVisibility"
          >
            <svg
                v-if="!showPassword"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <svg
                v-if="showPassword"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.051 10.051 0 011.307-2.819M15 12a3 3 0 11-6 0 3 3 0 016 0zm7.542 0c-.258.795-.642 1.54-1.135 2.217M9.879 9.879a3 3 0 014.242 4.242M3 3l18 18"
              />
            </svg>
          </button>
        </div>

        <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Войти
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { login } from "@/api/auth";

export default {
  data() {
    return {
      username: '',
      password: '',
      showPassword: false, // Управление видимостью пароля
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await login(this.username, this.password);
        console.log("Login successful:", response);
        this.$router.push('/dashboard')
        // Redirect or handle success
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>
