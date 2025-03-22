<template>
  <div class="min-h-screen bg-gray-100">
    <Notify ref="notifyRef" />

    <Header>
      Справочник товаров
    </Header>

    <div class="container mx-auto p-8">
      <Table
          :columns="columns"
          :data="products"
          @create="openCreateModal"
          @edit="handleEdit"
          @delete="handleDelete"
          @refresh="handleRefresh"
      />

      <Modal
          :isVisible="isModalVisible"
          :title="isEditMode ? 'Редактирование товара' : 'Создание товара'"
          :fields="modalFields"
          :action-button-text="isEditMode ? 'Сохранить' : 'Создать'"
          :formData="formData"
          @submit="handleModalSubmit"
          @update:isVisible="isModalVisible = $event"
      />

      <Modal
          :isVisible="isDeleteModalVisible"
          title="Подтвердите действие"
          action-button-text="Удалить"
          custom-action-text="Вы уверены, что хотите удалить эту запись?"
          @submit="handleDeleteConfirm"
          @update:isVisible="isDeleteModalVisible = $event"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Header from "@/components/common/Header.vue";
import Table from "@/components/common/Table.vue";
import Modal from "@/components/common/Modal.vue";
import Notify from "@/components/common/Notify.vue";
import { getProducts, createProduct, editProduct, deleteProduct, getProduct } from "@/api/product.js";
import { getProductTypes } from "@/api/productType.js";
import { getStorageLocations } from "@/api/storageLocation.js";
import dayjs from "dayjs";

const notifyRef = ref(null);

const columns = [
  { key: "name", label: "Наименование" },
  { key: "quantity", label: "Кол-во" },
  { key: "productTypeName", label: "Категория" },
  { key: "storageLocationPosition", label: "Место хранения" },
  { key: "createdAt", label: "Создано в" },
];

const products = ref([]);
const productTypes = ref([]);
const storageLocations = ref([]);
const isModalVisible = ref(false);
const isDeleteModalVisible = ref(false);
const isEditMode = ref(false);
const formData = ref({});
const itemToDelete = ref(null);

const modalFields = ref([
  { name: "name", label: "Наименование", placeholder: "Введите значение" },
  { name: "quantity", label: "Кол-во", placeholder: "Введите значение", type: "number" },
  { name: "productTypeId", label: "Категория", placeholder: "Выберите категорию", type: "select", options: productTypes },
  { name: "storageLocationId", label: "Место хранения", placeholder: "Выберите место хранения", type: "select", options: storageLocations },
]);

const fetchProducts = async () => {
  try {
    const response = await getProducts();
    products.value = response.map(product => ({
      ...product,
      createdAt: dayjs(product.createdAt).format("YYYY.MM.DD HH:mm:ss"),
    }));
  } catch (error) {
    console.error("Ошибка при загрузке товаров:", error);
    notifyRef.value?.showNotify("Ошибка загрузки товаров", "error");
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

const openCreateModal = async () => {
  isEditMode.value = false;
  formData.value = {};
  await fetchProductTypes();
  await fetchStorageLocations();
  isModalVisible.value = true;
};

const handleEdit = async (row) => {
  isEditMode.value = true;
  try {
    formData.value = await getProduct(row.id);
    await fetchProductTypes();
    await fetchStorageLocations();
    isModalVisible.value = true;
  } catch (error) {
    console.error("Ошибка при редактировании товара:", error);
    notifyRef.value?.showNotify("Ошибка при редактировании товара", "error");
  }
};

const handleModalSubmit = async (data) => {
  try {
    isEditMode.value ? await editProduct(formData.value.id, data) : await createProduct(data);
    notifyRef.value?.showNotify("Операция выполнена", "success");
    await fetchProducts();
    isModalVisible.value = false;
  } catch (error) {
    console.error("Ошибка при сохранении товара:", error);
    notifyRef.value?.showNotify("Ошибка при сохранении товара", "error");
  }
};

const handleDelete = (row) => {
  itemToDelete.value = row.id;
  isDeleteModalVisible.value = true;
};

const handleDeleteConfirm = async () => {
  try {
    await deleteProduct(itemToDelete.value);
    notifyRef.value?.showNotify("Товар удален", "success");
    await fetchProducts();
    isDeleteModalVisible.value = false;
  } catch (error) {
    console.error("Ошибка при удалении товара:", error);
    notifyRef.value?.showNotify("Ошибка при удалении товара", "error");
  }
};

const handleRefresh = () => {
  fetchProducts();
};

onMounted(fetchProducts);
</script>
