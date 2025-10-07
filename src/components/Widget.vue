<template>
    <v-container max-width="750px">
        <v-row class="widgets-grid" align="stretch" dense>
            <v-col v-for="widget in activeWidgets" :key="widget" cols="12" sm="6">
                <component :is="widgetComponents[widget]" />
            </v-col>
        </v-row>
        <br>
        <v-dialog max-width="500">
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn variant="outlined" rounded v-bind="activatorProps"><v-icon>mdi-pencil</v-icon>カスタマイズ</v-btn>
            </template>

            <template v-slot:default="{ isActive }">
                <v-card prepend-icon="mdi-pencil" title="ウィジェットのカスタマイズ">
                    <v-card-text>
                        <div v-for="widget in widgets" :key="widget">
                            <v-checkbox :label="widget" :value="widget" v-model="isActiveWidgets" density="compact"
                                hide-details></v-checkbox>
                        </div>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn variant="outlined" rounded text="閉じる" @click="isActive.value = false"></v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
    </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import type { Component } from 'vue'
import Weather from '@/components/widgets/Weather.vue'
import Timer from '@/components/widgets/Timer.vue'
import Clock from '@/components/widgets/Clock.vue'
import StopWatch from '@/components/widgets/StopWatch.vue'
import GGRBK from '@/components/widgets/GGRBK.vue'
import Quote from '@/components/widgets/Quote.vue'

const STORAGE_KEY = 'ggrbk:isActiveWidgets'

const widgets = ['Weather', 'Timer', 'Clock', 'StopWatch', 'GGRBK', 'Quote'] as const
type WidgetName = typeof widgets[number]

const allWidgets: WidgetName[] = [...widgets]

const widgetComponents: Record<WidgetName, Component> = {
    Weather,
    Timer,
    Clock,
    StopWatch,
    GGRBK,
    Quote,
}

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

<style scoped></style>