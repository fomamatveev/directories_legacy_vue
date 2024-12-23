<template>
  <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
    <div class="bg-white p-6 rounded-lg w-1/3">
      <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>
      <form @submit.prevent="handleSubmit">
        <div v-for="(field, index) in fields" :key="index" class="mb-4">
          <label :for="field.name" class="block text-sm font-medium text-gray-700">{{ field.label }}</label>
          <input
              v-model="formData[field.name]"
              :type="field.type || 'text'"
              :id="field.name"
              :name="field.name"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              :placeholder="field.placeholder"
          />
        </div>
        <div v-if="customActionText">
          <p>{{ customActionText }}</p>
        </div>
        <div class="flex justify-end mt-4">
          <button
              @click="close"
              class="bg-gray-300 text-black px-4 py-2 rounded mr-2"
          >
            Отмена
          </button>
          <button
              @click="handleSubmit"
              class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {{ actionButtonText }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// Определяем пропсы с помощью defineProps
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "Создание",
  },
  fields: {
    type: Array,
    required: true,
  },
  actionButtonText: {
    type: String,
    default: 'Создать', // или 'Сохранить', если редактирование
  },
  customActionText: {
    type: String,
    default: '', // по умолчанию пустая строка
  },
});

// Используем ref для хранения данных формы
const formData = ref({});

// Получаем событие с помощью defineEmits
const emit = defineEmits();

// Слежение за изменениями isVisible и сброс формы
watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    resetForm();
  }
});

// Метод для закрытия модального окна
function close() {
  emit('update:isVisible', false);
}

// Метод для отправки данных формы
function handleSubmit() {
  emit('submit', formData.value); // Отправляем данные формы
  close(); // Закрываем окно после отправки
}

// Сброс данных формы при открытии окна
function resetForm() {
  formData.value = props.fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || ''; // Если в поле есть значение по умолчанию
    return acc;
  }, {});
}
</script>
