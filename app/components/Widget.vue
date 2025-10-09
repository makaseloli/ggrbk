<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import type { Component } from 'vue'

const STORAGE_KEY = 'ggrbk:isActiveWidgets'

defineOptions({
    name: 'WidgetsPanel'
})

const widgets = [
    { name: '天気', loader: () => import('@/components/widgets/Weather.vue') },
    { name: '時計', loader: () => import('@/components/widgets/Clock.vue') },
    { name: '名言', loader: () => import('@/components/widgets/Quote.vue') },
    { name: '今アツい記事', loader: () => import('@/components/widgets/Article.vue') }
] as const

type WidgetName = typeof widgets[number]['name']

const allWidgets: WidgetName[] = widgets.map(({ name }) => name) as WidgetName[]

const widgetComponents = widgets.reduce<Record<WidgetName, Component>>((acc, { name, loader }) => {
    acc[name] = defineAsyncComponent(loader)
    return acc
}, {} as Record<WidgetName, Component>)

const isActiveWidgets = ref<WidgetName[]>([])

const activeWidgets = computed<WidgetName[]>(() => {
    const seen = new Set<WidgetName>()

    return isActiveWidgets.value.filter((value): value is WidgetName => {
        if (!allWidgets.includes(value)) return false
        if (seen.has(value)) return false

        seen.add(value)
        return true
    })
})

const loadSavedWidgets = (): WidgetName[] => {
    if (typeof window === 'undefined') return []

    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
            const valid = parsed.filter((value): value is WidgetName => typeof value === 'string' && allWidgets.includes(value as WidgetName))
            const unique = Array.from(new Set(valid)) as WidgetName[]

            return unique
        }
    } catch (error) {
    }

    return []
}

onMounted(() => {
    isActiveWidgets.value = loadSavedWidgets()
})

watch(
    isActiveWidgets,
    (newValue) => {
        if (typeof window === 'undefined') return

        const filtered = newValue.filter((value): value is WidgetName => allWidgets.includes(value))
        const unique = Array.from(new Set(filtered))

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(unique))
    },
    { deep: true }
)

</script>

<template>
    <UContainer class="mx-auto my-8 max-w-[750px]">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <template v-for="widgetName in activeWidgets" :key="widgetName">
                <component :is="widgetComponents[widgetName]" />
            </template>
        </div>
        <UDrawer title="ウィジェットを追加。" inset>
            <UButton label="カスタマイズする。" color="primary" variant="solid" icon="lucide:pencil" />

            <template #body>
                <UCheckboxGroup v-model="isActiveWidgets" :items="allWidgets" class="my-2" />
            </template>
        </UDrawer>
    </UContainer>
</template>
