import { ref, onUnmounted } from 'vue'
import {
    getProductNameForAudit,
    getProductTypeForAudit,
    getStorageLocationForAudit
} from '@/api/auditReferences'

// Глобальное хранилище ссылок
const references = ref({})
const activeRequests = new Map()

// Функция для отмены всех pending-запросов
const cleanup = () => {
    activeRequests.forEach(controller => controller.abort())
    activeRequests.clear()
}

export default function useReferenceService() {
    // Очистка при unmount (если используется в setup)
    onUnmounted(() => {
        cleanup()
    })

    const loadReference = async (entityType, id) => {
        if (!id || references.value[entityType]?.[id]) return

        const requestKey = `${entityType}_${id}`
        const controller = new AbortController()
        activeRequests.set(requestKey, controller)

        try {
            let name
            switch (entityType) {
                case 'ProductName':
                    name = await getProductNameForAudit(id, { signal: controller.signal })
                    break
                case 'ProductType':
                    name = await getProductTypeForAudit(id, { signal: controller.signal })
                    break
                case 'StorageLocation':
                    name = await getStorageLocationForAudit(id, { signal: controller.signal })
                    break
            }

            // Проверяем, не был ли запрос отменён
            if (!controller.signal.aborted) {
                if (!references.value[entityType]) {
                    references.value[entityType] = {}
                }
                references.value[entityType][id] = name || `#${id}`
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error(`Error loading ${entityType}:`, error)
                if (!references.value[entityType]) {
                    references.value[entityType] = {}
                }
                references.value[entityType][id] = `#${id}`
            }
        } finally {
            activeRequests.delete(requestKey)
        }
    }

    const getReferenceName = (entityType, id) => {
        return references.value[entityType]?.[id] || `#${id}`
    }

    return {
        loadReference,
        getReferenceName,
        cleanup
    }
}