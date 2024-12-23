<template>
  <div class="min-h-screen bg-gray-100">
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
  getProducts,
  createProduct,
  deleteProduct,
  editProduct,
  getProduct
} from "@/api/product";
import {getProductTypes} from "~/api/productType.js";
import {getStorageLocations} from "~/api/storageLocation.js";

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
        { key: 'quantity', label: 'Кол-во' },
        { key: 'productTypeId', label: 'Категория' },
        { key: 'storageLocationId', label: 'Место хранения' },
        { key: 'createdAt', label: 'Создано в' },
      ],
      products: [], // Список мест хранения
      productTypes: [],
      storageLocations: [],
      isModalVisible: false, // Для отображения модального окна
      isDeleteModalVisible: false, // Для отображения модального окна удаления
      isEditMode: false, // Режим редактирования
      formData: {}, // Данные для формы
      modalFields: [
        { name: "name", label: "Наименование", placeholder: "Введите значение" },
        { name: "shortName", label: "Краткое наименование", placeholder: "Введите значение" },
        { name: "quantity", label: "Количество", placeholder: "Введите значение" },
        { name: "productTypeId", label: "Категория", placeholder: "Выберите категорию" },
        { name: "storageLocationId", label: "Место хранения", placeholder: "Выберите место хранения" },
      ], // Поля для модального окна
      deleteModalFields: [], // Модальные поля для подтверждения удаления
      itemToDelete: null, // Для хранения ID удаляемой записи
    };
  },
  created() {
    this.fetchProducts();
    this.fetchProductTypes();
    this.fetchStorageLocations();
  },
  methods: {
    // Загружаем список мест хранения
    async fetchProducts() {
      try {
        const response = await getProducts();
        this.products = response.data;
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    },
    // Загружаем список категорий
    async fetchProductTypes() {
      try {
        const response = await getProductTypes();  // Замените на реальный API для получения категорий
        this.productTypes = response.data;
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
      }
    },
    // Загружаем список мест хранения
    async fetchStorageLocations() {
      try {
        const response = await getStorageLocations();  // Замените на реальный API для получения мест хранения
        this.storageLocations = response.data;
      } catch (error) {
        console.error("Ошибка при загрузке мест хранения:", error);
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
        const response = await getProduct(row.id); // Получаем данные по ID
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
          const response = await editProduct(this.formData.id, formData);
          console.log("Мест хранения отредактировано:", response);
        } else {
          // Если это создание, то выполняем запрос на создание
          const response = await createProduct(formData);
          console.log("Мест хранения создано:", response);
        }
        this.fetchProducts(); // Обновляем список мест хранения
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
          await deleteProduct(this.itemToDelete); // Удаляем запись
          console.log("Место хранения удалено");
          this.fetchProducts(); // Обновляем список
          this.isDeleteModalVisible = false; // Закрываем модальное окно
        } catch (error) {
          console.error("Ошибка при удалении записи:", error);
        }
      }
    },
    handleRefresh() {
      // Метод для обновления данных
      this.fetchProducts(); // Например, вызываем метод для повторного получения данных
    },
  },
};
</script>
