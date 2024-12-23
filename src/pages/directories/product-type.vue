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
import { defineComponent, ref, onCreated } from 'vue';
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

export default defineComponent({
  components: {
    Header,
    Table,
    Modal,
  },
  setup() {
    // Reactive state
    const columns = ref([
      { key: 'name', label: 'Наименование' },
      { key: 'shortName', label: 'Краткое наименование' },
      { key: 'createdAt', label: 'Создано в' },
    ]);
    const productTypes = ref([]);
    const isModalVisible = ref(false);
    const isDeleteModalVisible = ref(false);
    const isEditMode = ref(false);
    const formData = ref({});
    const modalFields = ref([
      { name: "name", label: "Наименование", placeholder: "Введите значение" },
      { name: "shortName", label: "Краткое наименование", placeholder: "Введите значение" },
    ]);
    const deleteModalFields = ref([]);
    const itemToDelete = ref(null);

    // Fetch data on component creation
    const fetchProductType = async () => {
      try {
        const response = await getProductTypes();
        productTypes.value = response.data;
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    // Open modal for creating a new product type
    const openCreateModal = () => {
      isEditMode.value = false;
      formData.value = {};
      isModalVisible.value = true;
    };

    // Handle editing a product type
    const handleEdit = async (row) => {
      isEditMode.value = true;
      try {
        const response = await getProductType(row.id);
        formData.value = response.data;
        isModalVisible.value = true;
      } catch (error) {
        console.error("Ошибка при редактировании записи:", error);
      }
    };

    // Submit form data for creating or editing
    const handleModalSubmit = async (formData) => {
      try {
        if (isEditMode.value) {
          const response = await editProductType(formData.id, formData);
          console.log("Категория товара отредактирована:", response);
        } else {
          const response = await createProductType(formData);
          console.log("Категория товара создана:", response);
        }
        fetchProductType();
      } catch (error) {
        console.error("Ошибка при отправке данных:", error);
      }
    };

    // Handle deletion
    const handleDelete = (row) => {
      itemToDelete.value = row.id;
      isDeleteModalVisible.value = true;
    };

    // Confirm deletion
    const handleDeleteConfirm = async () => {
      if (itemToDelete.value !== null) {
        try {
          await deleteProductType(itemToDelete.value);
          console.log("Категория товара удалена");
          fetchProductType();
          isDeleteModalVisible.value = false;
        } catch (error) {
          console.error("Ошибка при удалении записи:", error);
        }
      }
    };

    // Refresh data
    const handleRefresh = () => {
      fetchProductType();
    };

    // Load data on creation
    onCreated(() => {
      fetchProductType();
    });

    return {
      columns,
      productTypes,
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
      handleRefresh
    };
  }
});
</script>
