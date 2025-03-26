<template>
  <div class="diff-container">
    <template v-if="!hasVisibleChanges">Нет изменений</template>
    <template v-else>
      <template v-for="(change, field, index) in visibleChanges" :key="field">
        <div class="change-row">
          <div class="field-name">{{ getFieldName(field) }}:</div>
          <div class="change-values">
            <div v-if="shouldShowOldValue(change)" class="old-value">
              <span class="diff-sign">-</span>
              <span>{{ formatValue(change.oldValue) }}</span>
            </div>
            <div v-if="shouldShowNewValue(change)" class="new-value">
              <span class="diff-sign">+</span>
              <span>{{ formatValue(change.newValue) }}</span>
            </div>
          </div>
        </div>
        <div v-if="index < Object.keys(visibleChanges).length - 1" class="divider"></div>
      </template>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import dayjs from 'dayjs';
import fieldNames from '@/utils/fieldNames';
import auditConfig from '@/utils/auditConfig';

const props = defineProps({
  changes: String,
  operation: String
});

// Парсим изменения
const changesData = computed(() => {
  try {
    return props.changes ? JSON.parse(props.changes)?.changes : null;
  } catch {
    return null;
  }
});

// Проверяем, является ли значение "пустым"
const isEmptyValue = (value) => {
  return value === null ||
      value === undefined ||
      value === '' ||
      (typeof value === 'object' && Object.keys(value).length === 0);
};

// Фильтруем изменения, оставляя только значимые
const visibleChanges = computed(() => {
  if (!changesData.value) return {};

  const result = {};

  for (const [field, change] of Object.entries(changesData.value)) {
    // Пропускаем технические поля
    if (auditConfig.ignoredFields.includes(field)) continue;

    const oldEmpty = isEmptyValue(change.oldValue);
    const newEmpty = isEmptyValue(change.newValue);

    // Пропускаем поля, где оба значения пустые
    if (oldEmpty && newEmpty) continue;

    // Пропускаем поля без изменений (кроме случаев, когда одно из значений undefined)
    if (change.oldValue === change.newValue &&
        change.oldValue !== undefined &&
        change.newValue !== undefined) continue;

    result[field] = change;
  }

  return result;
});

// Проверяем есть ли вообще изменения для отображения
const hasVisibleChanges = computed(() => {
  return Object.keys(visibleChanges.value).length > 0;
});

// Проверяем нужно ли показывать старое значение
const shouldShowOldValue = (change) => {
  return change.oldValue !== undefined && !isEmptyValue(change.oldValue);
};

// Проверяем нужно ли показывать новое значение
const shouldShowNewValue = (change) => {
  return change.newValue !== undefined && !isEmptyValue(change.newValue);
};

// Получаем читаемое имя поля
const getFieldName = (field) => {
  return fieldNames[field] || field;
};

// Форматируем значение для отображения
const formatValue = (value) => {
  if (isEmptyValue(value)) return 'не указано';

  // Проверяем, является ли значение датой
  const isDate = (val) => {
    // Исключаем числа и булевы значения
    if (typeof val !== 'string') return false;

    // Проверяем стандартные форматы дат
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;
    return isoDatePattern.test(val) && !isNaN(Date.parse(val));
  };

  if (isDate(value)) {
    return dayjs(value).format('YYYY.MM.DD HH:mm:ss');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return value.toString();
};
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

.divider {
  height: 1px;
  background-color: #f0f0f0;
  margin: 4px 12px;
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

.value-text {
  padding-left: 4px;
  word-break: break-word;
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