<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <Notify ref="notifyRef" />

    <Header>Справочник позиций</Header>

    <div class="container mx-auto p-8">
      <Table
          :columns="columns"
          :data="productNames"
          @create="openCreateModal"
          @edit="handleEdit"
          @delete="handleDelete"
          @refresh="handleRefresh"
      />

      <Modal
          :isVisible="isModalVisible"
          :title="modalTitle"
          :fields="modalFields"
          :action-button-text="modalActionText"
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
import { ref, computed, onMounted } from "vue";
import Header from "@/components/common/Header.vue";
import Table from "@/components/common/Table.vue";
import Modal from "@/components/common/Modal.vue";
import Notify from "@/components/common/Notify.vue";
import dayjs from "dayjs";
import { authMiddleware } from "~/middleware/loginMiddleWare.js";
import {
  createProductName,
  deleteProductName,
  editProductName,
  getProductName,
  getProductNames
} from "~/api/directories/productName.js";

definePageMeta({ middleware:authMiddleware(true) });

const notifyRef = ref(null);

const columns = ref([
  { key: "name", label: "Наименование" },
  { key: "shortName", label: "Краткое наименование" },
  { key: "createdAt", label: "Создано в" },
]);

const productNames = ref([]);
const isModalVisible = ref(false);
const isDeleteModalVisible = ref(false);
const isEditMode = ref(false);
const formData = ref({});
const itemToDelete = ref(null);

const modalFields = ref([
  { name: "name", label: "Наименование", placeholder: "Введите значение" },
  { name: "shortName", label: "Краткое наименование", placeholder: "Введите значение" },
]);

const modalTitle = computed(() =>
    isEditMode.value ? "Редактирование позиции" : "Создание позиции"
);

const modalActionText = computed(() =>
    isEditMode.value ? "Сохранить" : "Создать"
);

const fetchProductNames = async () => {
  try {
    const response = await getProductNames();
    if (Array.isArray(response)) {
      productNames.value = response.map(item => ({
        ...item,
        createdAt: dayjs(item.createdAt).format("YYYY.MM.DD HH:mm:ss"),
      }));
    }
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
    notifyRef.value?.showNotify("Ошибка загрузки позиции", "error");
  }
};

const openCreateModal = () => {
  isEditMode.value = false;
  formData.value = {};
  isModalVisible.value = true;
};

const handleEdit = async (row) => {
  isEditMode.value = true;
  try {
    formData.value = await getProductName(row.id);
    isModalVisible.value = true;
  } catch (error) {
    console.error("Ошибка при редактировании:", error);
    notifyRef.value?.showNotify("Ошибка при редактировании позиции", "error");
  }
};

const handleModalSubmit = async (data) => {
  try {
    if (isEditMode.value) {
      await editProductName(formData.value.id, data);
      notifyRef.value?.showNotify("Позиция успешно обновлена", "success");
    } else {
      await createProductName(data);
      notifyRef.value?.showNotify("Позиция успешно добавлена", "success");
    }
    await fetchProductNames();
    isModalVisible.value = false;
  } catch (error) {
    console.error("Ошибка при сохранении:", error);
    notifyRef.value?.showNotify("Ошибка при позиции", "error");
  }
};

const handleDelete = (row) => {
  itemToDelete.value = row.id;
  isDeleteModalVisible.value = true;
};

const handleDeleteConfirm = async () => {
  try {
    await deleteProductName(itemToDelete.value);
    notifyRef.value?.showNotify("Позиция успешно удалена", "success");
    await fetchProductNames();
    isDeleteModalVisible.value = false;
  } catch (error) {
    console.error("Ошибка при удалении:", error);
    notifyRef.value?.showNotify("Ошибка при удалении позиции", "error");
  }
};

const handleRefresh = async () => {
  await fetchProductNames();
};

onMounted(fetchProductNames);
</script>
