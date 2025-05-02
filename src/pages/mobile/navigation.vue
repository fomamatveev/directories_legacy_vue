<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <Header>Навигация</Header>
    <div class="container mx-auto p-4">
      <div class="space-y-4">
        <NuxtLink to="/mobile/storage-location" class="block p-4 border border-blue-600 text-black rounded-md shadow-md hover:bg-blue-100">
          Добавить товар
        </NuxtLink>
        <NuxtLink to="/mobile/product-search" class="block p-4 border border-blue-600 text-black rounded-md shadow-md hover:bg-blue-100">
          Поиск товара
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from "@/components/common/Header.vue";
import { authMiddleware } from "~/middleware/loginMiddleWare.js";

definePageMeta({ middleware:authMiddleware(true) });
</script>

<style scoped>
.hover\:bg-blue-100:hover {
  background-color: #ebf8ff; /* Светло-голубой фон при наведении */
}
</style>
