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
          :title="isEditMode ? 'Редактирование товара' : 'Создание товара'"
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
  getProducts,
  createProduct,
  deleteProduct,
  editProduct,
  getProduct
} from "@/api/product";
import {getProductTypes} from "~/api/productType.js";
import {getStorageLocations} from "~/api/storageLocation.js";

export default defineComponent({
  components: {
    Header,
    Table,
    Modal,
  },
  setup() {
    const columns = [
      {key: 'name', label: 'Наименование'},
      {key: 'shortName', label: 'Краткое наименование'},
      {key: 'quantity', label: 'Кол-во'},
      {key: 'productTypeId', label: 'Категория'},
      {key: 'storageLocationId', label: 'Место хранения'},
      {key: 'createdAt', label: 'Создано в'},
    ];

    const products = ref([]); // Список товаров
    const productTypes = ref([]); // Список категорий
    const storageLocations = ref([]); // Список мест хранения
    const isModalVisible = ref(false); // Для отображения модального окна
    const isDeleteModalVisible = ref(false); // Для отображения модального окна удаления
    const isEditMode = ref(false); // Режим редактирования
    const formData = reactive({}); // Данные для формы
    const modalFields = [
      {name: "name", label: "Наименование", placeholder: "Введите значение"},
      {name: "shortName", label: "Краткое наименование", placeholder: "Введите значение"},
      {name: "quantity", label: "Количество", placeholder: "Введите значение"},
      {name: "productTypeId", label: "Категория", placeholder: "Выберите категорию"},
      {name: "storageLocationId", label: "Место хранения", placeholder: "Выберите место хранения"},
    ]; // Поля для модального окна
    const deleteModalFields = []; // Модальные поля для подтверждения удаления
    const itemToDelete = ref(null); // Для хранения ID удаляемой записи

    // Загружаем список товаров
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        products.value = response.data;
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    // Загружаем список категорий
    const fetchProductTypes = async () => {
      try {
        const response = await getProductTypes();
        productTypes.value = response.data;
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
      }
    };

    // Загружаем список мест хранения
    const fetchStorageLocations = async () => {
      try {
        const response = await getStorageLocations();
        storageLocations.value = response.data;
      } catch (error) {
        console.error("Ошибка при загрузке мест хранения:", error);
      }
    };

    // Открыть модальное окно для создания нового товара
    const openCreateModal = () => {
      isEditMode.value = false; // Устанавливаем режим создания
      formData.name = ''; // Очищаем данные формы
      formData.shortName = '';
      formData.quantity = '';
      formData.productTypeId = '';
      formData.storageLocationId = '';
      isModalVisible.value = true; // Открываем модальное окно
    };

    // Открыть модальное окно для редактирования
    const handleEdit = async (row) => {
      isEditMode.value = true; // Режим редактирования
      try {
        const response = await getProduct(row.id); // Получаем данные по ID
        formData.name = response.data.name;
        formData.shortName = response.data.shortName;
        formData.quantity = response.data.quantity;
        formData.productTypeId = response.data.productTypeId;
        formData.storageLocationId = response.data.storageLocationId;
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
          const response = await editProduct(formData.id, formData);
          console.log("Продукт отредактирован:", response);
        } else {
          // Если это создание, то выполняем запрос на создание
          const response = await createProduct(formData);
          console.log("Продукт создан:", response);
        }
        fetchProducts(); // Обновляем список товаров
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
          await deleteProduct(itemToDelete.value); // Удаляем запись
          console.log("Продукт удален");
          fetchProducts(); // Обновляем список
          isDeleteModalVisible.value = false; // Закрываем модальное окно
        } catch (error) {
          console.error("Ошибка при удалении записи:", error);
        }
      }
    };

    // Метод для обновления данных
    const handleRefresh = () => {
      fetchProducts(); // Например, вызываем метод для повторного получения данных
    };

    // Загружаем данные при монтировании компонента
    onMounted(() => {
      fetchProducts();
      fetchProductTypes();
      fetchStorageLocations();
    });

    return {
      columns,
      products,
      productTypes,
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
