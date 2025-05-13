<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <Notify ref="notifyRef"/>
    <Header>Поиск</Header>

    <div class="container mx-auto p-4">
      <button
          type="button"
          class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mb-4"
          @click="showDemoData"
      >
        Отсканировать QR-код
      </button>


      <Modal
          :isVisible="showDemo"
          title="Информация о товаре"
          :fields="modalFields"
          :action-button-text="isEditMode ? 'Сохранить' : 'Создать'"
          :show-action-button="false"
          :formData="formData"
          @submit="handleModal"
          @update:isVisible="isModalVisible = $event"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { getProduct } from "~/api/directories/product.js";
import Header from "@/components/common/Header.vue";
import Notify from "@/components/common/Notify.vue";
import { authMiddleware } from "~/middleware/loginMiddleWare.js";
import Modal from "~/components/common/Modal.vue";
import {getProductNames} from "~/api/directories/productName.js";
import {getProductTypes} from "~/api/directories/productType.js";
import {getStorageLocations} from "~/api/directories/storageLocation.js";

definePageMeta({ middleware:authMiddleware(true) });

const notifyRef = ref(null);
const product = ref(null);
const showDemo = ref(false);

const productNames = ref([]);
const productTypes = ref([]);
const storageLocations = ref([]);
const isModalVisible = ref(false);
const isEditMode = ref(false);
const formData = ref({});

const fetchProductNames = async () => {
  try {
    productNames.value = (await getProductNames()).map(type => ({ label: type.name, value: type.id }));
  } catch (error) {
    console.error("Ошибка при загрузке позиций:", error);
    notifyRef.value?.showNotify("Ошибка загрузки позиций", "error");
  }
};

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

const showDemoData = async () => {
  showDemo.value = true;
  setTimeout(async () => {
    formData.value = await getProduct(9);
    await fetchProductNames();
    await fetchProductTypes();
    await fetchStorageLocations();
  }, 3000)
};

const modalFields = ref([
  { name: "productNameId", label: "Позиция", placeholder: "Введите позицию", type: "select", options: productNames },
  { name: "quantity", label: "Кол-во", placeholder: "Введите значение", type: "number" },
  { name: "productTypeId", label: "Категория", placeholder: "Выберите категорию", type: "select", options: productTypes },
  { name: "storageLocationId", label: "Место хранения", placeholder: "Выберите место хранения", type: "select", options: storageLocations },
]);

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