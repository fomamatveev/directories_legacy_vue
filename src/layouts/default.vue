<script setup lang="ts">
import {onMounted, ref} from "vue";
import {navigateTo, useNuxtApp, useRouter} from "#app";
import {useAuthState} from "~/api/auth2";

const loading = ref(true);
const auth = ref()


onMounted(async () => {
  auth.value = useAuthState();
  await auth.value.load();
  loading.value = false;


  if (!auth.value.isAuthenticated) {
    return navigateTo('/login');
  }

  const route = useRouter();
  if (route.currentRoute.value.path == '/') {
    return navigateTo('/');
  }
});


</script>

<template>

  <div v-if="!loading">
    <NuxtPage/>
  </div>

</template>