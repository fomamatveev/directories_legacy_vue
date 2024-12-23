<template>
  <div class="min-h-screen bg-gray-100">
    <Header>
      Справочник мест хранения
    </Header>
    <div class="container mx-auto p-8">
      <Table
          :columns="columns"
          :data="storageLocations"
          @create="openCreateModal"
          @edit="handleEdit"
          @delete="handleDelete"
          @refresh="handleRefresh"
      />

      <!-- Модальное окно для создания или редактирования -->
      <Modal
          :isVisible="isModalVisible"
          :title="isEditMode ? 'Редактирование места хранения' : 'Создание места хранения'"
          :fields="modalFields"
          :action-button-text="isEditMode ? 'Сохранить' : 'Создать'"
          :formData="formData"
          @submit="handleModalSubmit"
          @update:isVisible="isModalVisible = $event"
      />

      <!-- Модальное окно для подтверждения удаления -->
      <Modal
          :isVisible="isDeleteModalVisible"
          title="Подтвердите действие"
          action-button-text="Удалить"
          customActionText="Вы уверены, что хотите удалить эту запись?"
          :fields="deleteModalFields"
          @submit="handleDeleteConfirm"
          @update:isVisible="isDeleteModalVisible = $event"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue';
import Header from "@/components/common/Header.vue";
import Table from "@/components/common/Table.vue";
import Modal from "@/components/common/Modal.vue";
import {
  getStorageLocations,
  createStorageLocation,
  deleteStorageLocation,
  editStorageLocation,
  getStorageLocation
} from "@/api/storageLocation";

export default defineComponent({
  components: {
    Header,
    Table,
    Modal,
  },
  setup() {
    const columns = [
      { key: 'rack', label: 'Стеллаж' },
      { key: 'compartment', label: 'Отсек' },
      { key: 'part', label: 'Часть' },
    ];

    const storageLocations = ref([]); // Список мест хранения
    const isModalVisible = ref(false); // Для отображения модального окна
    const isDeleteModalVisible = ref(false); // Для отображения модального окна удаления
    const isEditMode = ref(false); // Режим редактирования
    const formData = reactive({}); // Данные для формы
    const modalFields = [
      { name: "rack", label: "Стеллаж", placeholder: "Введите значение" },
      { name: "compartment", label: "Отсек", placeholder: "Введите значение" },
      { name: "part", label: "Часть", placeholder: "Введите значение" },
    ]; // Поля для модального окна
    const deleteModalFields = []; // Модальные поля для подтверждения удаления
    const itemToDelete = ref(null); // Для хранения ID удаляемой записи

    // Загружаем список мест хранения
    const fetchLocations = async () => {
      try {
        const response = await getStorageLocations();
        storageLocations.value = response.data;
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    // Открыть модальное окно для создания нового места хранения
    const openCreateModal = () => {
      isEditMode.value = false; // Устанавливаем режим создания
      formData.rack = ''; // Очищаем данные формы
      formData.compartment = '';
      formData.part = '';
      isModalVisible.value = true; // Открываем модальное окно
    };

    // Открыть модальное окно для редактирования
    const handleEdit = async (row) => {
      isEditMode.value = true; // Режим редактирования
      try {
        const response = await getStorageLocation(row.id); // Получаем данные по ID
        formData.rack = response.data.rack;
        formData.compartment = response.data.compartment;
        formData.part = response.data.part;
        isModalVisible.value = true; // Открываем модальное окно
      } catch (error) {
        console.error("Ошибка при редактировании записи:", error);
      }
    };

    // Обработчик для отправки данных из формы
    const handleModalSubmit = async (formData) => {
      try {
        if (isEditMode.value) {
          // Если это редактирование, то выполняем запрос на редактирование
          const response = await editStorageLocation(formData.id, formData);
          console.log("Мест хранения отредактировано:", response);
        } else {
          // Если это создание, то выполняем запрос на создание
          const response = await createStorageLocation(formData);
          console.log("Мест хранения создано:", response);
        }
        fetchLocations(); // Обновляем список мест хранения
      } catch (error) {
        console.error("Ошибка при отправке данных:", error);
      }
    };

    // Обработчик для удаления записи
    const handleDelete = (row) => {
      itemToDelete.value = row.id; // Сохраняем ID удаляемой записи
      isDeleteModalVisible.value = true; // Открываем модальное окно подтверждения
    };

    // Подтверждение удаления
    const handleDeleteConfirm = async () => {
      if (itemToDelete.value !== null) {
        try {
          await deleteStorageLocation(itemToDelete.value); // Удаляем запись
          console.log("Место хранения удалено");
          fetchLocations(); // Обновляем список
          isDeleteModalVisible.value = false; // Закрываем модальное окно
        } catch (error) {
          console.error("Ошибка при удалении записи:", error);
        }
      }
    };

    const handleRefresh = () => {
      // Метод для обновления данных
      fetchLocations(); // Например, вызываем метод для повторного получения данных
    };

    // Загружаем данные при монтировании компонента
    onMounted(() => {
      fetchLocations();
    });

    return {
      columns,
      storageLocations,
      isModalVisible,
      isDeleteModalVisible,
      isEditMode,
      formData,
      modalFields,
      deleteModalFields,
      itemToDelete,
      openCreateModal,
      handleEdit,
      handleModalSubmit,
      handleDelete,
      handleDeleteConfirm,
      handleRefresh,
    };
  },
});
</script>
