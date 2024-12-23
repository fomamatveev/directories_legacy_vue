<template>
  <nav class="bg-blue-600 text-white p-4">
    <div class="container mx-auto flex items-center">
      <!-- Левый блок -->
      <router-link
          to="/dashboard"
          class="text-lg font-semibold hover:text-gray-200 mr-4"
      >
        Панель управления
      </router-link>
      <!-- Динамический заголовок -->
      <span class="text-lg" v-if="$slots.default">
        <slot />
      </span>
      <!-- Правый блок -->
      <div class="ml-auto">
        <button
            @click="logout"
            class="text-white hover:text-gray-200 px-4 py-2 rounded"
        >
          Выйти
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  methods: {
    logout() {
      // Очистка локальных данных авторизации (например, удаление токена)
      localStorage.removeItem("authToken");
      this.$router.push("/login"); // Перенаправление на страницу логина
    },
  },
};
</script>

<style scoped>
nav {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button {
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
