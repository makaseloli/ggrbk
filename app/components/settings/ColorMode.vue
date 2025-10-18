<script setup lang="ts">
import { computed } from 'vue'
import colors from 'tailwindcss/colors'

type TailwindColorName = keyof typeof colors
type TailwindPalette = Record<string, string> & { 500: string }

interface ColorSelectItem {
    label: string
    value: TailwindColorName
    hex: string
}

const formatLabel = (name: string) =>
    name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, char => char.toUpperCase())

const isTailwindPalette = (value: string | TailwindPalette): value is TailwindPalette =>
    typeof value === 'object' && value !== null && typeof value['500'] === 'string'

const colorItems = computed<ColorSelectItem[]>(() =>
    (Object.entries(colors) as [TailwindColorName, string | TailwindPalette][])
        .filter(([, value]) => isTailwindPalette(value))
        .map(([name, palette]) => ({
            label: formatLabel(name),
            value: name,
            hex: palette['500']
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
)


const STORAGE_KEY = 'ggrbk:primaryColor'
const primaryColor = useState<TailwindColorName>('primaryColor', () => 'teal' as TailwindColorName)

const selectedColor = computed<TailwindColorName>({
    get: () => primaryColor.value,
    set: value => {
        if (!value) {
            return
        }

        primaryColor.value = value

        if (import.meta.client) {
            localStorage.setItem(STORAGE_KEY, value)
        }
    }
})

const selectedItem = computed(() =>
    colorItems.value.find(item => item.value === selectedColor.value)
)
</script>

<template>
    <USelect v-model="selectedColor" :items="colorItems" item-text="label" item-value="value"
        placeholder="Primary color を選択">
        <template #leading>
            <span v-if="selectedItem" class="h-4 w-4 rounded-full border border-gray-200 dark:border-gray-700"
                :style="{ backgroundColor: selectedItem.hex }"></span>
        </template>
        <template #item="{ item }">
            <div class="flex items-center gap-2">
                <span class="h-4 w-4 rounded-full border border-gray-200 dark:border-gray-700"
                    :style="{ backgroundColor: item.hex }"></span>
                <span>{{ item.label }}</span>
            </div>
        </template>
    </USelect>
</template>
