<template>
  <div class="min-h-screen bg-gray-100">
    <Notify ref="notifyRef" />

    <Header>Справочник категорий</Header>

    <div class="container mx-auto p-8">
      <Table
          :columns="columns"
          :data="productTypes"
          @create="openCreateModal"
          @edit="handleEdit"
          @delete="handleDelete"
          @refresh="handleRefresh"
      />

      <!-- Модальное окно для создания или редактирования -->
      <Modal
          :isVisible="isModalVisible"
          :title="modalTitle"
          :fields="modalFields"
          :action-button-text="modalActionText"
          :formData="formData"
          @submit="handleModalSubmit"
          @update:isVisible="isModalVisible = $event"
      />

      <!-- Модальное окно для удаления -->
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
import {
  getProductTypes,
  createProductType,
  deleteProductType,
  editProductType,
  getProductType,
} from "@/api/productType.js";
import dayjs from "dayjs";
import { authMiddleware } from "~/middleware/loginMiddleWare.js";

definePageMeta({ middleware:authMiddleware(true) });

const notifyRef = ref(null);

// Колонки таблицы
const columns = ref([
  { key: "name", label: "Наименование" },
  { key: "shortName", label: "Краткое наименование" },
  { key: "createdAt", label: "Создано в" },
]);

// Состояния
const productTypes = ref([]);
const isModalVisible = ref(false);
const isDeleteModalVisible = ref(false);
const isEditMode = ref(false);
const formData = ref({});
const itemToDelete = ref(null);

// Поля модального окна
const modalFields = ref([
  { name: "name", label: "Наименование", placeholder: "Введите значение" },
  { name: "shortName", label: "Краткое наименование", placeholder: "Введите значение" },
]);

// Вычисляемые свойства для заголовка и кнопки модального окна
const modalTitle = computed(() =>
    isEditMode.value ? "Редактирование категории товара" : "Создание категории товара"
);

const modalActionText = computed(() =>
    isEditMode.value ? "Сохранить" : "Создать"
);

// Загрузка данных
const fetchProductTypes = async () => {
  try {
    const response = await getProductTypes();
    if (Array.isArray(response)) {
      productTypes.value = response.map(item => ({
        ...item,
        createdAt: dayjs(item.createdAt).format("YYYY.MM.DD HH:mm:ss"),
      }));
    }
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
    notifyRef.value?.showNotify("Ошибка загрузки категорий", "error");
  }
};

// Открытие модального окна для создания
const openCreateModal = () => {
  isEditMode.value = false;
  formData.value = {};
  isModalVisible.value = true;
};

// Открытие модального окна для редактирования
const handleEdit = async (row) => {
  isEditMode.value = true;
  try {
    formData.value = await getProductType(row.id);
    isModalVisible.value = true;
  } catch (error) {
    console.error("Ошибка при редактировании:", error);
    notifyRef.value?.showNotify("Ошибка при редактировании категории", "error");
  }
};

// Обработка создания/редактирования
const handleModalSubmit = async (data) => {
  try {
    if (isEditMode.value) {
      await editProductType(formData.value.id, data);
      notifyRef.value?.showNotify("Категория успешно обновлена", "success");
    } else {
      await createProductType(data);
      notifyRef.value?.showNotify("Категория успешно добавлена", "success");
    }
    await fetchProductTypes();
    isModalVisible.value = false;
  } catch (error) {
    console.error("Ошибка при сохранении:", error);
    notifyRef.value?.showNotify("Ошибка при сохранении категории", "error");
  }
};

// Обработка удаления
const handleDelete = (row) => {
  itemToDelete.value = row.id;
  isDeleteModalVisible.value = true;
};

// Подтверждение удаления
const handleDeleteConfirm = async () => {
  try {
    await deleteProductType(itemToDelete.value);
    notifyRef.value?.showNotify("Категория успешно удалена", "success");
    await fetchProductTypes();
    isDeleteModalVisible.value = false;
  } catch (error) {
    console.error("Ошибка при удалении:", error);
    notifyRef.value?.showNotify("Ошибка при удалении категории", "error");
  }
};

// Обновление данных
const handleRefresh = async () => {
  await fetchProductTypes();
};

// Загрузка данных при монтировании
onMounted(fetchProductTypes);
</script>
