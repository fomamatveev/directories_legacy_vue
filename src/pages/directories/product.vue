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
          custom-action-text="Вы уверены, что хотите удалить эту запись?"
          :fields="deleteModalFields"
          @submit="handleDeleteConfirm"
          @update:isVisible="isDeleteModalVisible = $event"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import Header from "@/components/common/Header.vue";
import Table from "@/components/common/Table.vue";
import Modal from "@/components/common/Modal.vue";
import {
  getProducts,
  createProduct,
  editProduct,
  deleteProduct,
  getProduct,
} from "@/api/product.js";
import { getProductTypes } from "@/api/productType.js";
import { getStorageLocations } from "@/api/storageLocation.js";
import dayjs from "dayjs";

export default defineComponent({
  components: {
    Header,
    Table,
    Modal,
  },
  setup() {
    const columns = ref([
      { key: "name", label: "Наименование" },
      { key: "quantity", label: "Кол-во" },
      { key: "productTypeName", label: "Категория" },
      { key: "storageLocationPosition", label: "Место хранения" },
      { key: "createdAt", label: "Создано в" },
    ]);

    const products = ref([]);
    const productTypes = ref([]);
    const storageLocations = ref([]);
    const isModalVisible = ref(false);
    const isDeleteModalVisible = ref(false); // Для отображения модального окна удаления
    const isEditMode = ref(false);
    const formData = ref({});
    const modalFields = ref([
      { name: "name", label: "Наименование", placeholder: "Введите значение" },
      { name: "quantity", label: "Кол-во", placeholder: "Введите значение", type: "number" },
      {
        name: "productTypeId",
        label: "Категория",
        placeholder: "Выберите категорию",
        type: "select",
        options: productTypes,
      },
      {
        name: "storageLocationId",
        label: "Место хранения",
        placeholder: "Выберите место хранения",
        type: "select",
        options: storageLocations,
      },
    ]);
    const deleteModalFields = []; // Модальные поля для подтверждения удаления
    const itemToDelete = ref(null); // Для хранения ID удаляемой записи

    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        products.value = response.data.map((product) => ({
          ...product,
          createdAt: dayjs(product.createdAt).format("YYYY.MM.DD HH:mm:ss"),
        }));
      } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
      }
    };

    const fetchProductTypes = async () => {
      try {
        const response = await getProductTypes();
        productTypes.value = response.data.map((type) => ({
          label: type.name,
          value: type.id,
        }));
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
      }
    };

    const fetchStorageLocations = async () => {
      try {
        const response = await getStorageLocations();
        storageLocations.value = response.data.map((location) => ({
          label: `${location.rack}/${location.compartment}/${location.part}`,
          value: location.id,
        }));
      } catch (error) {
        console.error("Ошибка при загрузке мест хранения:", error);
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
        const response = await getProduct(row.id);
        formData.value = response.data;
        await fetchProductTypes();
        await fetchStorageLocations();
        isModalVisible.value = true;
      } catch (error) {
        console.error("Ошибка при редактировании товара:", error);
      }
    };

    const handleModalSubmit = async (data) => {
      try {
        if (isEditMode.value) {
          await editProduct(formData.value.id, data);
        } else {
          await createProduct(data);
        }
        await fetchProducts();
        isModalVisible.value = false;
      } catch (error) {
        console.error("Ошибка при сохранении товара:", error);
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
          console.log("Место хранения удалено");
          fetchProducts(); // Обновляем список
          isDeleteModalVisible.value = false; // Закрываем модальное окно
        } catch (error) {
          console.error("Ошибка при удалении записи:", error);
        }
      }
    };

    const handleRefresh = () => {
      fetchProducts();
    };

    onMounted(() => {
      fetchProducts();
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
      fetchProducts,
      openCreateModal,
      handleEdit,
      handleModalSubmit,
      handleRefresh,
      handleDelete,
      handleDeleteConfirm
    };
  },
});
</script>
