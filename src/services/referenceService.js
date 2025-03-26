import { ref } from 'vue'
import {
    getProductTypeForAudit,
    getStorageLocationForAudit
} from '@/api/auditReferences'

const references = ref({})

export default {
    async loadReference(entityType, id) {
        if (!id || references.value[entityType]?.[id]) return

        try {
            let name
            switch (entityType) {
                case 'ProductType':
                    name = await getProductTypeForAudit(id)
                    break
                case 'StorageLocation':
                    name = await getStorageLocationForAudit(id)
                    break
            }

            if (!references.value[entityType]) {
                references.value[entityType] = {}
            }
            references.value[entityType][id] = name || `#${id}`
        } catch (error) {
            console.error(`Error loading ${entityType}:`, error)
            references.value[entityType] = {
                ...references.value[entityType],
                [id]: `#${id}`
            }
        }
    },

    getReferenceName(entityType, id) {
        return references.value[entityType]?.[id] || `#${id}`
    }
}