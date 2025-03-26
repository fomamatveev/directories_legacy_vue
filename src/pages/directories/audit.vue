<template>
  <div class="min-h-screen bg-gray-100">
    <Notify ref="notifyRef" />

    <Header>
      Справочник изменений
    </Header>

    <div class="container mx-auto p-8">
      <Table
          :is-show-create-button="false"
          :is-show-edit-button="false"
          :is-show-delete-button="false"
          :columns="columns"
          :data="actions"
          @refresh="handleRefresh"
      >
        <template #cell(changes)="{ value, row }">
          <AuditDiff :changes="value" :operation="row.operation" />
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Header from "@/components/common/Header.vue";
import Table from "@/components/common/Table.vue";
import { getActions } from "@/api/audit.js";
import dayjs from "dayjs";
import Notify from "~/components/common/Notify.vue";
import AuditDiff from "@/components/AuditDiff.vue";

const columns = [
  {
    key: "action",
    label: "Действие",
    formatter: value => {
      const actions = {
        'Create': 'Создание',
        'Update': 'Изменение',
        'Delete': 'Удаление'
      };
      return actions[value] || value;
    }
  },
  { key: "entityName", label: "Наименование сущности" },
  { key: "changes", label: "Изменения" },
  {
    key: "updatedAt",
    label: "Дата действия",
    formatter: value => dayjs(value).format("YYYY.MM.DD HH:mm:ss")
  },
  { key: "updatedBy", label: "Кем изменено" },
];

const actions = ref([]);
const notifyRef = ref(null);

const fetchActions = async () => {
  try {
    const response = await getActions();
    actions.value = response.map(action => ({
      ...action,
      updatedAt: dayjs(action.updatedAt).format("YYYY.MM.DD HH:mm:ss"),
    }));
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
    notifyRef.value?.showNotify("Ошибка загрузки данных", "error");
  }
};

const handleRefresh = () => {
  fetchActions();
};

onMounted(fetchActions);
</script>