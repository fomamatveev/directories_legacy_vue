<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <Header>Генерация QR-кодов</Header>

    <div class="container mx-auto p-4">
      <form @submit.prevent="handleGenerateQRCode">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Название товара</label>
          <input
              type="text"
              id="name"
              v-model="formData.name"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Введите название товара"
          />
        </div>

        <div class="mb-4">
          <label for="quantity" class="block text-sm font-medium text-gray-700">Количество</label>
          <input
              type="number"
              id="quantity"
              v-model="formData.quantity"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Введите количество"
          />
        </div>

        <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Сгенерировать QR-код
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from "@/components/common/Header.vue";
import { generateQRCode } from "@/api/qrCode";
import { authMiddleware } from "~/middleware/loginMiddleWare.js";

definePageMeta({ middleware: authMiddleware(true) });

const formData = ref({
  name: '',
  quantity: ''
});

const handleGenerateQRCode = async () => {
  try {
    const response = await generateQRCode(formData.value);
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.value.name}_QR.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Ошибка генерации QR-кода:', error);
  }
};
</script>
