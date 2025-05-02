<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <Notify ref="notifyRef"/>
    <Header>Поиск</Header>

    <div class="container mx-auto p-4">
      <button
          type="button"
          class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mb-4"
          @click="scanQRCode"
      >
        Отсканировать QR-код
      </button>

      <div v-if="product" class="bg-white p-4 rounded-md shadow-md">
        <h2 class="text-xl font-bold mb-2">{{ product.name }}</h2>
        <p><strong>Категория:</strong> {{ product.productTypeName }}</p>
        <p><strong>Количество:</strong> {{ product.quantity }}</p>
        <p><strong>Место хранения:</strong> {{ product.storageLocationPosition }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { getProduct } from "@/api/product";
import Header from "@/components/common/Header.vue";
import Notify from "@/components/common/Notify.vue";
import { authMiddleware } from "~/middleware/loginMiddleWare.js";

definePageMeta({ middleware:authMiddleware(true) });

const notifyRef = ref(null);
const product = ref(null);

const scanQRCode = () => {
  const scanner = new Html5QrcodeScanner(
      "reader", { fps: 10 });
  scanner.render(async (text) => {
    try {
      const qrData = JSON.parse(text);
      const { productId } = qrData;

      if (productId) {
        const product = await getProduct(productId);
        product.value = product;
      }

      scanner.clear();
    } catch (error) {
      console.error('Ошибка сканирования QR-кода:', error);
      notifyRef.value?.showNotify('Ошибка сканирования QR-кода', 'error');
      scanner.clear();
    }
  });
};
</script>

<style>
#reader {
  width: 100%;
  height: 100%;
}
</style>
