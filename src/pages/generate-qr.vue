<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <Header>Генерация QR-кодов</Header>

    <div class="container mx-auto p-4">
      <form @submit.prevent="handleGenerateQRCode">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Наименование товара</label>
          <select
              id="name"
              v-model="formData.name"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option v-for="product in productNames" :key="product.value" :value="product.value">{{ product.label }}</option>
          </select>
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

        <div class="mb-4">
          <label for="productType" class="block text-sm font-medium text-gray-700">Категория товара</label>
          <select
              id="productType"
              v-model="formData.productTypeId"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option v-for="type in productTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
          </select>
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
import { ref, onMounted } from 'vue';
import Header from "@/components/common/Header.vue";
import { generateQRCode } from "@/api/qrCode";
import { getProductNames } from "@/api/directories/productName";
import { getProductTypes } from "@/api/directories/productType";
import { authMiddleware } from "~/middleware/loginMiddleWare.js";

definePageMeta({ middleware: authMiddleware(true) });

const formData = ref({
  name: '',
  quantity: '',
  productTypeId: ''
});

const productNames = ref([]);
const productTypes = ref([]);

const fetchProductNames = async () => {
  try {
    const response = await getProductNames();
    productNames.value = response.map(product => ({label: product.name, value: product.id}));
  } catch (error) {
    console.error('Ошибка при загрузке позиций:', error);
  }
};

const fetchProductTypes = async () => {
  try {
    const response = await getProductTypes();
    productTypes.value = response.map(type => ({label: type.name, value: type.id}));
  } catch (error) {
    console.error('Ошибка при загрузке категорий товаров:', error);
  }
};

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

onMounted(() => {
  fetchProductNames();
  fetchProductTypes();
});
</script>
