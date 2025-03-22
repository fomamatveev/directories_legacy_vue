<template>
  <div class="fixed top-5 right-5 flex flex-col gap-4 z-50">
    <transition-group name="notify" tag="div">
      <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notify-item"
          :class="{
            'bg-red-500': notification.type === 'error',
            'bg-green-500': notification.type === 'success',
            'bg-yellow-500': notification.type === 'warning',
            'bg-blue-500': notification.type === 'info',
          }"
          @click="removeNotification(notification.id)"
      >
        <strong>{{ notification.title }}</strong>
        <p>{{ notification.message }}</p>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from "vue";

const notifications = ref([]);
let idCounter = 0;

const showNotify = (message, type = "info", title = null, duration = 3000) => {
  const id = idCounter++;

  // Автоматически устанавливаем заголовок, если он не передан
  const defaultTitles = {
    error: "Ошибка",
    success: "Успешно",
    warning: "Предупреждение",
    info: "Информация"
  };

  notifications.value.unshift({
    id,
    message,
    type,
    title: title || defaultTitles[type] // Если `title` не передан, подставляем дефолтное
  });

  // Если больше 5 уведомлений, удаляем самое старое
  if (notifications.value.length > 5) {
    notifications.value.pop();
  }

  // Авто-удаление через `duration` мс
  setTimeout(() => {
    removeNotification(id);
  }, duration);
};

const removeNotification = (id) => {
  notifications.value = notifications.value.filter((n) => n.id !== id);
};

// Экспортируем метод `showNotify`
defineExpose({ showNotify });
</script>

<style scoped>
.notify-item {
  width: 320px;
  padding: 14px 18px;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  opacity: 0.9;
  cursor: pointer;
  transition: opacity 0.3s, transform 0.3s;
  margin-bottom: 6px; /* Отступ между уведомлениями */
}

.notify-item:hover {
  opacity: 1;
}

.notify-item.success {
  background: #28a745;
}

.notify-item.error {
  background: #dc3545;
}

.notify-item.warning {
  background: #ffc107;
  color: #333;
}

.notify-item.info {
  background: #17a2b8;
}

/* Анимация появления и удаления */
.notify-enter-active,
.notify-leave-active {
  transition: all 0.5s ease;
}

.notify-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.notify-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
