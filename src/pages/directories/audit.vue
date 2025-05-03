<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <Notify ref="notifyRef" />
    <Header>Справочник изменений</Header>

    <div class="container mx-auto p-8">
      <Table
          :is-show-create-button="false"
          :is-show-edit-button="false"
          :is-show-delete-button="false"
          :is-show-date-filter="true"
          :columns="columns"
          :data="processedActions"
          @refresh="handleRefresh"
      >
        <template #cell(changes)="{ value, row }">
          <AuditDiff
              :changes="value"
              :operation="row.operation"
              :entityName="row.entityName"
          />
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import Header from '@/components/common/Header.vue'
import Table from '@/components/common/Table.vue'
import {getActions} from '@/api/audit.js'
import dayjs from 'dayjs'
import Notify from '~/components/common/Notify.vue'
import AuditDiff from '@/components/AuditDiff.vue'
import { authMiddleware } from "~/middleware/loginMiddleWare.js";

definePageMeta({ middleware:authMiddleware(true) });

const columns = [
  {
    key: 'action',
    label: 'Действие',
    formatter: value => ({
      'Create': 'Создание',
      'Update': 'Изменение',
      'Delete': 'Удаление'
    }[value] || value)
  },
  { key: 'entityName', label: 'Наименование сущности' },
  { key: 'changes', label: 'Изменения' },
  {
    key: 'updatedAt',
    label: 'Дата действия',
    formatter: value => dayjs(value).format('YYYY.MM.DD HH:mm:ss')
  },
  { key: 'updatedBy', label: 'Кем изменено' }
]

const actions = ref([])
const notifyRef = ref(null)

const processedActions = computed(() => {
  return actions.value.map(action => ({
    ...action,
    operation: action.action === 'Создание' ? 'Create' :
        action.action === 'Изменение' ? 'Update' : 'Delete'
  }))
})

const fetchActions = async () => {
  try {
    const response = await getActions();
    actions.value = response.map(action => ({
      ...action,
      updatedAt: dayjs(action.updatedAt).format("YYYY.MM.DD HH:mm:ss"),
    }));
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error)
    notifyRef.value?.showNotify('Ошибка загрузки данных', 'error')
  }
}

const handleRefresh = () => {
  fetchActions()
}

onMounted(fetchActions)
</script>