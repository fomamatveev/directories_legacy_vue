<template>
  <div class="bg-white shadow-lg rounded-lg p-6">
    <div class="flex justify-self-auto items-center mb-4">
      <button
          class="bg-blue-600 text-white py-2 px-4 mr-2 rounded-md hover:bg-blue-700 focus:outline-none"
          @click="create"
      >
        Создать
      </button>
      <button
          class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none"
          @click="refresh"
      >
        Обновить
      </button>
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
        <th class="py-2 px-4 text-left text-gray-700">Действия</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(row, index) in data"
          :key="index"
          class="hover:bg-gray-100"
      >
        <td
            v-for="column in columns"
            :key="column.key"
            class="py-2 px-4 border-b border-gray-300"
        >
          {{ row[column.key] }}
        </td>
        <td class="py-2 px-4 border-b border-gray-300 flex space-x-2">
          <button
              class="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 focus:outline-none"
              @click="edit(row)"
          >
            Редактировать
          </button>
          <button
              class="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 focus:outline-none"
              @click="deleteItem(row)"
          >
            Удалить
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    columns: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const create = () => {
      emit('create');
    };

    const refresh = () => {
      emit('refresh');
    };

    const edit = (row) => {
      emit('edit', row);
    };

    const deleteItem = (row) => {
      emit('delete', row);
    };

    return {
      create,
      refresh,
      edit,
      deleteItem,
    };
  },
});
</script>
