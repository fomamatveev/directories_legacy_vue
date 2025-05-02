<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <Header />
    <!-- Основной контент -->
    <div class="container mx-auto p-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <!-- Карточка 1 - Справочник товаров -->
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Справочник товаров</h2>
          <p class="text-gray-600 mb-4">Управляйте всеми товарами на складе</p>
          <router-link
              to="/directories/product"
              class="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Перейти к справочнику
          </router-link>
        </div>

        <!-- Карточка 2 - Справочник категорий -->
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Справочник категорий</h2>
          <p class="text-gray-600 mb-4">Управляйте категориями товаров</p>
          <router-link
              to="/directories/product-type"
              class="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Перейти к справочнику
          </router-link>
        </div>

        <!-- Карточка 3 - Справочник мест хранения -->
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Справочник мест хранения</h2>
          <p class="text-gray-600 mb-4">Управляйте местом хранения</p>
          <router-link
              to="/directories/storage-location"
              class="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Перейти к справочнику
          </router-link>
        </div>

        <!-- Карточка 4 - Движение товаров -->
        <div class="bg-white shadow-lg rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Справочник изменений</h2>
          <p class="text-gray-600 mb-4">Следите за изменениями</p>
          <router-link
              to="/directories/audit"
              class="text-blue-500 hover:text-blue-700 font-semibold"
          >
            Перейти к справочнику
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Header from "@/components/common/Header.vue";
import { authMiddleware } from "~/middleware/loginMiddleWare.js";

definePageMeta({ middleware:authMiddleware(true) });

export default defineComponent({
  components: {
    Header,
  },
});
</script>
