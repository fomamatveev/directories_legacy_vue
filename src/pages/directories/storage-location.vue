<template>
  <div class="min-h-screen bg-gray-100">
    <Notify ref="notifyRef"/>
    <Header>Справочник мест хранения</Header>

    <div class="container mx-auto p-8">
      <Table
          :columns="columns"
          :data="storageLocations"
          @create="openCreateModal"
          @edit="handleEdit"
          @delete="handleDelete"
          @refresh="handleRefresh"
      />

      <!-- Модальное окно создания/редактирования -->
      <Modal
          :isVisible="isModalVisible"
          :title="isEditMode ? 'Редактирование' : 'Создание'"
          :fields="modalFields"
          :action-button-text="isEditMode ? 'Сохранить' : 'Создать'"
          :formData="formData"
          @submit="handleModalSubmit"
          @update:isVisible="isModalVisible = $event"
      />

      <!-- Модальное окно подтверждения удаления -->
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
import { ref } from "vue";
import { getStorageLocations, getStorageLocation, createStorageLocation, editStorageLocation, deleteStorageLocation } from "@/api/storageLocation";
import Header from "@/components/common/Header.vue";
import Table from "@/components/common/Table.vue";
import Modal from "@/components/common/Modal.vue";
import Notify from "@/components/common/Notify.vue";
import dayjs from "dayjs";
import { authMiddleware } from "~/middleware/loginMiddleWare.js";

definePageMeta({ middleware:authMiddleware(true) });

// Уведомления
const notifyRef = ref(null);

// Колонки таблицы
const columns = [
  { key: "rack", label: "Стеллаж" },
  { key: "compartment", label: "Отсек" },
  { key: "part", label: "Часть" },
  { key: "createdAt", label: "Дата создания" }
];

// Флаги для модальных окон
const isModalVisible = ref(false);
const isDeleteModalVisible = ref(false);
const isEditMode = ref(false);

// Данные формы и удаляемого элемента
const formData = ref({});
const itemToDelete = ref(null);

// Поля формы
const modalFields = [
  { name: "rack", label: "Стеллаж", placeholder: "Введите значение" },
  { name: "compartment", label: "Отсек", placeholder: "Введите значение" },
  { name: "part", label: "Часть", placeholder: "Введите значение" },
];

// Загрузка данных с сервера
const { data: storageLocations, refresh } = useAsyncData("storage-locations", async () => {
  try {
    const response = await getStorageLocations();
    return response.map((item) => ({
      ...item,
      createdAt: dayjs(item.createdAt).format("YYYY.MM.DD HH:mm:ss"),
    }));
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    notifyRef.value?.showNotify("Ошибка загрузки данных", "error");
    return [];
  }
});

// Открыть модальное окно создания
const openCreateModal = () => {
  isEditMode.value = false;
  formData.value = {};
  isModalVisible.value = true;
};

// Открыть модальное окно редактирования
const handleEdit = async (row) => {
  isEditMode.value = true;
  try {
    formData.value = await getStorageLocation(row.id);
    isModalVisible.value = true;
  } catch (error) {
    notifyRef.value?.showNotify("Ошибка при редактировании", "error");
  }
};

// Отправка формы (создание/редактирование)
const handleModalSubmit = async (data) => {
  try {
    if (isEditMode.value) {
      await editStorageLocation(formData.value.id, data);
      notifyRef.value?.showNotify("Место хранения обновлено", "success");
    } else {
      await createStorageLocation(data);
      notifyRef.value?.showNotify("Место хранения добавлено", "success");
    }
    refresh();
    isModalVisible.value = false;
  } catch (error) {
    notifyRef.value?.showNotify("Ошибка сохранения", "error");
  }
};

// Открыть модальное окно удаления
const handleDelete = (row) => {
  itemToDelete.value = row.id;
  isDeleteModalVisible.value = true;
};

// Подтвердить удаление
const handleDeleteConfirm = async () => {
  try {
    await deleteStorageLocation(itemToDelete.value);
    notifyRef.value?.showNotify("Место хранения удалено", "success");
    refresh();
    isDeleteModalVisible.value = false;
  } catch (error) {
    notifyRef.value?.showNotify("Ошибка удаления", "error");
  }
};

// Обновление данных
const handleRefresh = () => {
  refresh();
};
</script>
