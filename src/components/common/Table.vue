<template>
  <div class="bg-white shadow-lg rounded-lg p-6">
    <div v-if="isShowCreateButton || isShowRefreshButton" class="flex items-center mb-4">
      <button
          v-if="isShowCreateButton"
          class="bg-blue-600 text-white py-2 px-4 mr-2 rounded-md hover:bg-blue-700 focus:outline-none"
          @click="emit('create')"
      >
        Создать
      </button>
      <button
          v-if="isShowRefreshButton"
          class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none"
          @click="emit('refresh')"
      >
        Обновить
      </button>
    </div>

    <div class="filter-container mb-4">
      <label for="startDate" class="filter-label">От:</label>
      <input
          type="date"
          id="startDate"
          v-model="startDate"
          class="filter-input"
      />
      <label for="endDate" class="filter-label">До:</label>
      <input
          type="date"
          id="endDate"
          v-model="endDate"
          class="filter-input"
      />
      <button @click="resetFilter" class="filter-button">Сбросить</button>
    </div>

    <table class="min-w-full border border-gray-300">
      <thead>
      <tr class="bg-gray-200">
        <th
            v-for="column in columns"
            :key="column.key"
            class="py-2 px-4 text-left text-gray-700"
        >
          {{ column.label }}
        </th>
        <th v-if="isShowEditButton || isShowDeleteButton" class="py-2 px-4 text-left text-gray-700">Действия</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(row, index) in filteredData"
          :key="index"
          class="hover:bg-gray-100"
      >
        <td
            v-for="column in columns"
            :key="column.key"
            class="py-2 px-4 border-b border-gray-300"
        >
          <!-- Поддержка кастомных слотов -->
          <slot :name="'cell(' + column.key + ')'" :value="row[column.key]" :row="row">
            {{ row[column.key] }}
          </slot>
        </td>
        <td v-if="isShowEditButton || isShowDeleteButton" class="py-2 px-4 border-b border-gray-300 flex space-x-2">
          <button
              v-if="isShowEditButton"
              class="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 focus:outline-none"
              @click="emit('edit', row)"
          >
            Редактировать
          </button>
          <button
              v-if="isShowDeleteButton"
              class="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 focus:outline-none"
              @click="emit('delete', row)"
          >
            Удалить
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from "vue";
import dayjs from 'dayjs';

const props = defineProps({
  columns: Array,
  data: Array,
  isShowCreateButton: { type: Boolean, default: true },
  isShowRefreshButton: { type: Boolean, default: true },
  isShowEditButton: { type: Boolean, default: true },
  isShowDeleteButton: { type: Boolean, default: true },
});

const emit = defineEmits(["create", "refresh", "edit", "delete"]);

const startDate = ref(null);
const endDate = ref(null);

const filteredData = computed(() => {
  return props.data.filter(row => {
    const rowDate = dayjs(row.updatedAt);
    const start = startDate.value ? dayjs(startDate.value) : null;
    const end = endDate.value ? dayjs(endDate.value) : null;

    if (start && end) {
      return rowDate.isBetween(start, end, null, '[]');
    } else if (start) {
      return rowDate.isAfter(start, 'day') || rowDate.isSame(start, 'day');
    } else if (end) {
      return rowDate.isBefore(end, 'day') || rowDate.isSame(end, 'day');
    }

    return true;
  });
});

const resetFilter = () => {
  startDate.value = null;
  endDate.value = null;
};
</script>

<style scoped>
.filter-container {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.filter-label {
  margin-right: 8px;
}

.filter-input {
  margin-right: 16px;
}

.filter-button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.filter-button:hover {
  background-color: #0056b3;
}
</style>
