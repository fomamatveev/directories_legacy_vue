<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-container">
      <h3 class="modal-title">{{ title }}</h3>
      <form @submit.prevent="handleSubmit">
        <div v-for="field in fields" :key="field.name" class="modal-field">
          <label :for="field.name" class="modal-label">{{ field.label }}</label>

          <!-- Для текстовых полей -->
          <input
              v-if="!field.type || field.type === 'text'"
              :id="field.name"
              :placeholder="field.placeholder"
              v-model="formData[field.name]"
              class="modal-input"
          />

          <!-- Для числовых полей -->
          <input
              v-else-if="field.type === 'number'"
              :id="field.name"
              type="number"
              :placeholder="field.placeholder"
              v-model="formData[field.name]"
              class="modal-input"
          />

          <!-- Для полей select -->
          <select
              v-else-if="field.type === 'select'"
              :id="field.name"
              v-model="formData[field.name]"
              class="modal-select"
          >
            <option v-for="option in field.options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div v-if="customActionText">
          <p>{{ customActionText }}</p>
        </div>

        <div class="flex justify-end mt-4">
          <button
              type="button"
              class="bg-gray-300 text-black px-4 py-2 rounded mr-2"
              @click="handleCancel"
          >
            Отмена
          </button>
          <button v-if="showActionButton" type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
            {{ actionButtonText }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

// Определение пропсов
const props = defineProps({
  isVisible: Boolean,
  title: String,
  fields: Array,
  formData: Object,
  actionButtonText: String,
  customActionText: { type: String, default: "" },
  showActionButton: { type: Boolean, default: true }
});

// Определение событий
const emit = defineEmits(["submit", "update:isVisible"]);

// Методы
const handleSubmit = () => {
  emit("submit", props.formData);
  emit("update:isVisible", false);
};

const handleCancel = () => {
  emit("update:isVisible", false);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-container {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
}
.modal-title {
  font-size: 20px;
  margin-bottom: 20px;
}
.modal-field {
  margin-bottom: 15px;
}
.modal-label {
  display: block;
  margin-bottom: 5px;
}
.modal-input,
.modal-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.modal-action-button {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.modal-cancel-button {
  background-color: #f5f5f5;
  color: #333;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.modal-cancel-button:hover {
  background-color: #e0e0e0;
}
</style>
