<template>
  <div class="diff-container">
    <template v-if="!hasVisibleChanges">Нет изменений</template>
    <template v-else>
      <div v-for="(change, field) in visibleChanges" :key="field" class="change-row">
        <div class="field-name">{{ getFieldName(field) }}:</div>
        <div class="change-values">
          <div v-if="showOldValue(change)" class="old-value">
            <span class="diff-sign">-</span>
            <span>{{ formatValue(field, change.oldValue) }}</span>
          </div>
          <div v-if="showNewValue(change)" class="new-value">
            <span class="diff-sign">+</span>
            <span>{{ formatValue(field, change.newValue) }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import fieldNames from '@/utils/fieldNames'
import auditConfig from '@/utils/auditConfig'
import referenceService from '@/services/referenceService'

const props = defineProps({
  changes: String,
  operation: String,
  entityName: String
})

const loadedReferences = ref({})

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

    const oldEmpty = isEmptyValue(change.oldValue)
    const newEmpty = isEmptyValue(change.newValue)

    if (!oldEmpty || !newEmpty) {
      result[field] = change
      // Предзагрузка reference данных
      if (field.endsWith('Id')) {
        const id = change.newValue || change.oldValue
        if (id) {
          const entityType = field === 'ProductTypeId' ? 'ProductType' : 'StorageLocation'
          referenceService.loadReference(entityType, id)
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

const formatValue = (field, value) => {
  if (isEmptyValue(value)) return 'не указано'

  // Обработка reference полей
  if (field.endsWith('Id') && typeof value === 'number') {
    const entityType = field === 'ProductTypeId' ? 'ProductType' : 'StorageLocation'
    const name = referenceService.getReferenceName(entityType, value)
    return `${value} (${name})`
  }

  if (isDate(value)) {
    return dayjs(value).format('DD.MM.YYYY HH:mm:ss')
  }

  if (typeof value === 'object') return JSON.stringify(value)
  return value.toString()
}
</script>

<style scoped>
.diff-container {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 13px;
  line-height: 1.5;
  padding: 8px 0;
}

.change-row {
  display: flex;
  padding: 6px 12px;
  align-items: flex-start;
  transition: background-color 0.2s;
}

.change-row:hover {
  background-color: white;
  border-radius: 6px;
}

.field-name {
  font-weight: 500;
  color: #555;
  min-width: 140px;
  padding-right: 12px;
  text-align: left;
}

.change-values {
  flex: 1;
  min-width: 0;
}

.old-value, .new-value {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  padding: 4px 8px;
  border-radius: 4px;
}

.old-value {
  background-color: #fff0f0;
  color: #d32f2f;
}

.old-value .diff-sign {
  color: #d32f2f;
  font-size: 14px;
}

.new-value {
  background-color: #f0fff0;
  color: #388e3c;
}

.new-value .diff-sign {
  color: #388e3c;
  font-size: 14px;
}

/* Анимация для изменённых значений */
@keyframes fadeIn {
  from { opacity: 0.5; }
  to { opacity: 1; }
}

.old-value, .new-value {
  animation: fadeIn 0.3s ease-out;
}
</style>