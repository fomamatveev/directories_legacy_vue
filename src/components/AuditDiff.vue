<template>
  <div class="diff-container">
    <template v-if="!hasVisibleChanges">Нет изменений</template>
    <template v-else>
      <div class="summary-row" @click="toggleDiff">
        <div class="summary-value">
          <span :class="operationClass">{{ operationLabel }}</span>
        </div>
      </div>
      <div class="diff-content" :class="{ 'expanded': isDiffVisible }">
        <template v-for="(change, field, index) in visibleChanges" :key="field">
          <div class="change-row">
            <div class="field-name">{{ getFieldName(field) }}:</div>
            <div class="change-values">
              <div v-if="showOldValue(change)" class="old-value">
                <span class="diff-sign">-</span>
                <span class="value-text">{{ formatValue(field, change.oldValue) }}</span>
              </div>
              <div v-if="showNewValue(change)" class="new-value">
                <span class="diff-sign">+</span>
                <span class="value-text">{{ formatValue(field, change.newValue) }}</span>
              </div>
            </div>
          </div>
          <div v-if="index < Object.keys(visibleChanges).length - 1" class="divider"></div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onUnmounted, ref } from 'vue'
import dayjs from 'dayjs'
import fieldNames from '@/utils/fieldNames'
import auditConfig from '@/utils/auditConfig'
import useReferenceService from '@/services/referenceService'

const props = defineProps({
  changes: String,
  operation: String,
  entityName: String
})

const { loadReference, getReferenceName, cleanup } = useReferenceService()

// Очистка при размонтировании компонента
onUnmounted(() => {
  cleanup()
})

const changesData = computed(() => {
  try {
    return props.changes ? JSON.parse(props.changes)?.changes : null
  } catch {
    return null
  }
})

const isEmptyValue = (value) => {
  return value === null || value === undefined || value === ''
}

const isDate = (value) => {
  return typeof value === 'string' && !isNaN(Date.parse(value)) && value.includes('-')
}

const visibleChanges = computed(() => {
  if (!changesData.value) return {}
  const result = {}
  for (const [field, change] of Object.entries(changesData.value)) {
    if (auditConfig.ignoredFields.includes(field)) continue

    const oldValue = change.oldValue
    const newValue = change.newValue

    // Проверка на изменение значений
    if (oldValue !== newValue) {
      result[field] = change
      // Предзагрузка reference данных с обработкой ошибок
      if (field.endsWith('Id')) {
        const id = newValue || oldValue
        if (id) {
          const entityType = getEntityType(field)
          loadReference(entityType, id).catch(() => {
            // Ошибки уже обрабатываются в referenceService
          })
        }
      }
    }
  }
  return result
})

const hasVisibleChanges = computed(() => {
  return Object.keys(visibleChanges.value).length > 0
})

const showOldValue = (change) => {
  return change.oldValue !== undefined && !isEmptyValue(change.oldValue)
}

const showNewValue = (change) => {
  return change.newValue !== undefined && !isEmptyValue(change.newValue)
}

const getFieldName = (field) => {
  return fieldNames[field] || field
}

const getEntityType = (field) => {
  switch (field) {
    case 'ProductTypeId':
      return 'ProductType'
    case 'StorageLocationId':
      return 'StorageLocation'
    case 'ProductNameId':
      return 'ProductName'
    default:
      return null
  }
}

const formatValue = (field, value) => {
  if (isEmptyValue(value)) return 'не указано'

  // Обработка reference полей
  if (field.endsWith('Id') && typeof value === 'number') {
    const entityType = getEntityType(field)
    const name = getReferenceName(entityType, value)
    return name || value.toString()
  }

  if (isDate(value)) {
    return dayjs(value).format('DD.MM.YYYY HH:mm:ss')
  }

  if (typeof value === 'object') return JSON.stringify(value)
  return value.toString()
}

const isDiffVisible = ref(false)

const toggleDiff = () => {
  isDiffVisible.value = !isDiffVisible.value
}

const getEntityName = computed(() => {
  return props.entityName || 'Сущность'
})

const operationLabel = computed(() => {
  switch (props.operation) {
    case 'Create':
      return 'Создание'
    case 'Update':
      return 'Изменение'
    case 'Delete':
      return 'Удаление'
    default:
      return props.operation
  }
})

const operationClass = computed(() => {
  switch (props.operation) {
    case 'Create':
      return 'operation-create'
    case 'Update':
      return 'operation-update'
    case 'Delete':
      return 'operation-delete'
    default:
      return ''
  }
})
</script>

<style scoped>
.diff-container {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 13px;
  line-height: 1.5;
  padding: 8px 0;
}

.summary-row {
  display: flex;
  padding: 8px 16px;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.summary-row:hover {
  background-color: white;
  border-radius: 6px;
}

.diff-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.diff-content.expanded {
  max-height: 1000px;
}

.change-row {
  display: flex;
  padding: 8px 16px;
  align-items: flex-start;
  transition: background-color 0.2s;
}

.change-row:hover {
  background-color: white;
  border-radius: 6px;
}

.divider {
  height: 1px;
  background-color: #eaeaea;
  margin: 4px 16px;
}

.field-name {
  font-weight: 500;
  color: #555;
  min-width: 160px;
  padding-right: 16px;
  text-align: left;
}

.summary-value {
  display: flex;
  align-items: center;
}

.change-values {
  flex: 1;
  min-width: 0;
}

.old-value, .new-value, .operation-create, .operation-update, .operation-delete {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  padding: 6px 10px;
  border-radius: 4px;
}

.old-value {
  background-color: #fff0f0;
  color: #d32f2f;
  border-left: 3px solid #ffcdd2;
}

.new-value {
  background-color: #f0fff0;
  color: #388e3c;
  border-left: 3px solid #c8e6c9;
}

.diff-sign {
  font-weight: bold;
  margin-right: 6px;
  min-width: 16px;
  text-align: center;
  font-size: 14px;
}

.value-text {
  padding-left: 4px;
  word-break: break-word;
}

.operation-create {
  background-color: #f0fff0;
  color: #388e3c;
  border-left: 3px solid #c8e6c9;
}

.operation-update {
  background-color: #fffbdb;
  color: #ff9800;
  border-left: 3px solid #ffda9c;
}

.operation-delete {
  background-color: #fff0f0;
  color: #d32f2f;
  border-left: 3px solid #ffcdd2;
}

/* Анимация */
@keyframes fadeIn {
  from {
    opacity: 0.5;
    transform: translateY(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.old-value, .new-value {
  animation: fadeIn 0.3s ease-out;
}
</style>
