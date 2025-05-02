<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <Notify ref="notifyRef"/>
    <Header>Товар</Header>

    <div class="container mx-auto p-4">
      <form @submit.prevent="handleAddItem">
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

        <div class="mb-4">
          <label for="storageLocation" class="block text-sm font-medium text-gray-700">Место хранения</label>
          <select
              id="storageLocation"
              v-model="formData.storageLocationId"
              required
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option v-for="location in storageLocations" :key="location.value" :value="location.value">{{ location.label }}</option>
          </select>
        </div>

        <button
            type="button"
            class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mb-4"
            @click="scanQRCode"
        >
          Отсканировать QR-код
        </button>

        <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Добавить товар
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { getProductTypes } from "@/api/productType";
import { getStorageLocations } from "@/api/storageLocation";
import { createProduct } from "@/api/product";
import Header from "@/components/common/Header.vue";
import Notify from "@/components/common/Notify.vue";
import { authMiddleware } from "~/middleware/loginMiddleWare.js";

definePageMeta({ middleware:authMiddleware(true) });

const notifyRef = ref(null);

const formData = ref({
  name: '',
  quantity: '',
  productTypeId: '',
  storageLocationId: ''
});

const productTypes = ref([]);
const storageLocations = ref([]);

const fetchProductTypes = async () => {
  try {
    productTypes.value = (await getProductTypes()).map(type => ({ label: type.name, value: type.id }));
  } catch (error) {
    console.error("Ошибка при загрузке категорий:", error);
    notifyRef.value?.showNotify("Ошибка загрузки категорий", "error");
  }
};

const fetchStorageLocations = async () => {
  try {
    storageLocations.value = (await getStorageLocations()).map(location => ({
      label: `${location.rack}/${location.compartment}/${location.part}`,
      value: location.id,
    }));
  } catch (error) {
    console.error("Ошибка при загрузке мест хранения:", error);
    notifyRef.value?.showNotify("Ошибка загрузки мест хранения", "error");
  }
};

const handleAddItem = async () => {
  try {
    await createProduct(formData.value);
    notifyRef.value?.showNotify('Товар добавлен', 'success');
    formData.value = {name: '', quantity: '', productTypeId: '', storageLocationId: ''};
  } catch (error) {
    console.error('Ошибка добавления товара:', error);
    notifyRef.value?.showNotify('Ошибка добавления товара', 'error');
  }
};

const scanQRCode = () => {
  const scanner = new Html5QrcodeScanner(
      "reader", {fps: 10});
  scanner.render(async (text) => {
    try {
      const qrData = JSON.parse(text);
      const {name, quantity, productTypeId, rack, compartment, part} = qrData;

      if (name) {
        formData.value.name = name;
      }
      if (quantity) {
        formData.value.quantity = quantity;
      }
      if (productTypeId && productTypes.value.some(type => type.value === productTypeId)) {
        formData.value.productTypeId = productTypeId;
      }
      if (rack && compartment && part) {
        const locationLabel = `${rack}/${compartment}/${part}`;
        const location = storageLocations.value.find(loc => loc.label === locationLabel);
        if (location) {
          formData.value.storageLocationId = location.value;
        }
      }

      scanner.clear();
    } catch (error) {
      console.error('Ошибка сканирования QR-кода:', error);
      notifyRef.value?.showNotify('Ошибка сканирования QR-кода', 'error');
      scanner.clear();
    }
  });
};

onMounted(() => {
  fetchProductTypes();
  fetchStorageLocations();
});
</script>

<style>
#reader {
  width: 100%;
  height: 100%;
}
</style>
