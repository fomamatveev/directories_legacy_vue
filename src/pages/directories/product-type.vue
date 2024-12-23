<template>
  <div class="min-h-screen bg-gray-100">
    <Header>
      Справочник категорий
    </Header>
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
          :title="isEditMode ? 'Редактирование категории товара' : 'Создание категории товара'"
          :fields="modalFields"
          :action-button-text="isEditMode ? 'Сохранить' : 'Создать'"
          :formData="formData"
          @submit="handleModalSubmit"
          @update:isVisible="isModalVisible = $event"
      />

      <!-- Модальное окно для создания или редактирования -->
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
import Header from "@/components/common/Header.vue";
import Table from "@/components/common/Table.vue";
import Modal from "@/components/common/Modal.vue";
import {
  getProductTypes,
  createProductType,
  deleteProductType,
  editProductType,
  getProductType
} from "@/api/productType.js";

export default {
  components: {
    Header,
    Table,
    Modal,
  },
  data() {
    return {
      columns: [
        { key: 'name', label: 'Наименование' },
        { key: 'shortName', label: 'Краткое наименование' },
        { key: 'createdAt', label: 'Создано в' },
      ],
      productTypes: [], // Список мест хранения
      isModalVisible: false, // Для отображения модального окна
      isDeleteModalVisible: false, // Для отображения модального окна удаления
      isEditMode: false, // Режим редактирования
      formData: {}, // Данные для формы
      modalFields: [
        { name: "name", label: "Наименование", placeholder: "Введите значение" },
        { name: "shortName", label: "Краткое наименование", placeholder: "Введите значение" },
      ], // Поля для модального окна
      deleteModalFields: [], // Модальные поля для подтверждения удаления
      itemToDelete: null, // Для хранения ID удаляемой записи
    };
  },
  created() {
    this.fetchProductType();
  },
  methods: {
    // Загружаем список мест хранения
    async fetchProductType() {
      try {
        const response = await getProductTypes();
        this.productTypes = response.data;
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    },
    // Открыть модальное окно для создания нового места хранения
    openCreateModal() {
      this.isEditMode = false; // Устанавливаем режим создания
      this.formData = {}; // Очищаем данные формы
      this.isModalVisible = true; // Открываем модальное окно
    },
    // Открыть модальное окно для редактирования
    async handleEdit(row) {
      this.isEditMode = true; // Режим редактирования
      try {
        const response = await getProductType(row.id); // Получаем данные по ID
        this.formData = response.data; // Заполняем форму данными
        this.isModalVisible = true; // Открываем модальное окно
      } catch (error) {
        console.error("Ошибка при редактировании записи:", error);
      }
    },
    // Обработчик для отправки данных из формы
    async handleModalSubmit(formData) {
      try {
        if (this.isEditMode) {
          // Если это редактирование, то выполняем запрос на редактирование
          const response = await editProductType(this.formData.id, formData);
          console.log("Мест хранения отредактировано:", response);
        } else {
          // Если это создание, то выполняем запрос на создание
          const response = await createProductType(formData);
          console.log("Мест хранения создано:", response);
        }
        this.fetchProductType(); // Обновляем список мест хранения
      } catch (error) {
        console.error("Ошибка при отправке данных:", error);
      }
    },
    // Обработчик для удаления записи
    handleDelete(row) {
      this.itemToDelete = row.id; // Сохраняем ID удаляемой записи
      this.isDeleteModalVisible = true; // Открываем модальное окно подтверждения
    },
    // Подтверждение удаления
    async handleDeleteConfirm() {
      if (this.itemToDelete !== null) {
        try {
          await deleteProductType(this.itemToDelete); // Удаляем запись
          console.log("Место хранения удалено");
          this.fetchProductType(); // Обновляем список
          this.isDeleteModalVisible = false; // Закрываем модальное окно
        } catch (error) {
          console.error("Ошибка при удалении записи:", error);
        }
      }
    },
    handleRefresh() {
      // Метод для обновления данных
      this.fetchProductType(); // Например, вызываем метод для повторного получения данных
    },
  },
};
</script>
