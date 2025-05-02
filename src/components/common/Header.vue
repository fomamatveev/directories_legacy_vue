<template>
  <nav class="bg-blue-600 text-white p-4">
    <div class="container mx-auto flex items-center justify-between">
      <!-- Левый блок -->
      <NuxtLink to="/dashboard" class="text-lg font-medium hover:text-gray-200 mr-4 header-link" @click="navigateToMobileNavigation">
        Панель управления
      </NuxtLink>

      <!-- Динамический заголовок -->
      <div class="flex-grow flex justify-center">
        <span v-if="$slots.default" class="header-title">
          <slot />
        </span>
      </div>

      <!-- Правый блок -->
      <div>
        <button @click="handleLogout" class="text-white hover:text-gray-200 px-4 py-2 rounded header-text font-medium">
          Выйти
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { logout } from "~/api/auth.js";

// Используем `useRouter` для навигации
const router = useRouter();

const handleLogout = () => {
  logout();

  // Очистка локальных данных авторизации (например, удаление токена)
  localStorage.removeItem("authToken");

  // Перенаправление на страницу логина
  router.push("/login");
};

const navigateToMobileNavigation = (event) => {
  // Проверка, является ли устройство мобильным
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    event.preventDefault(); // Предотвращаем стандартное поведение ссылки
    router.push("/mobile/navigation");
  }
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

.header-link,
.header-text {
  font-size: 1.25rem; /* Базовый размер текста */
}

.header-title {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: 2px solid oklch(54.6% 0.245 262.881); /* Цвет рамки чуть темнее фона шапки */
  background-color: white; /* Белый фон */
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2); /* Внутренняя тень */
  color: oklch(50% 0.243 264.376); /* Цвет текста рамки */
  font-size: 1rem; /* Размер текста */
  border-radius: 20px; /* Скругленные углы */
  font-weight: 500;
}

@media (max-width: 768px) {
  .header-link,
  .header-text {
    font-size: 0.75rem; /* Уменьшенный размер текста для мобильных устройств */
  }

  .header-title {
    font-size: 0.875rem; /* Уменьшенный размер текста для мобильных устройств */
  }
}
</style>
