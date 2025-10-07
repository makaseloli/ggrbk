<template>
    <v-card prepend-icon="mdi-timer-outline" title="ストップウォッチ" variant="outlined" height="310px">
        <v-card-text class="d-flex justify-center">
            <v-progress-circular :model-value="progress" size="150" width="15">
                <span>{{ formattedNowTime }}</span>
            </v-progress-circular>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
            <v-btn variant="flat" rounded @click="startStopwatch()" :disabled="isRunning">スタート</v-btn>
            <v-btn variant="flat" rounded @click="pauseStopwatch()" :disabled="!isRunning">ストップ</v-btn>
            <v-btn variant="flat" rounded @click="resetStopwatch()">リセット</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue'

const MAX_DURATION_MS = 60 * 60 * 1000 // 1 hour

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max)

function formatDuration(durationMs: number): string {
    const totalMilliseconds = Math.max(durationMs, 0)
    const totalSeconds = Math.floor(totalMilliseconds / 1000)
    const milliseconds = Math.floor(totalMilliseconds % 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds
        .toString()
        .padStart(3, '0')}`
}

const elapsedMs = ref(0)
const isRunning = ref(false)
let startTimestamp = 0
let rafId: number | null = null

const progress = computed(() => {
    if (elapsedMs.value <= 0) return 0
    const percentage = (elapsedMs.value / MAX_DURATION_MS) * 100
    return clamp(percentage, 0, 100)
})

const formattedNowTime = computed(() => formatDuration(elapsedMs.value))

const startStopwatch = () => {
    if (isRunning.value) return

    isRunning.value = true
    startTimestamp = performance.now() - elapsedMs.value
    scheduleNextFrame()
}

const pauseStopwatch = () => {
    if (!isRunning.value) return

    updateElapsedFromNow()
    isRunning.value = false
    stopAnimation()
}

const resetStopwatch = () => {
    stopAnimation()
    elapsedMs.value = 0
    isRunning.value = false
}

const updateElapsedFromNow = () => {
    elapsedMs.value = performance.now() - startTimestamp
}

const stopAnimation = () => {
    if (rafId === null) return
    window.cancelAnimationFrame(rafId)
    rafId = null
}

const scheduleNextFrame = () => {
    rafId = window.requestAnimationFrame(handleFrame)
}

function handleFrame(timestamp: number) {
    elapsedMs.value = timestamp - startTimestamp
    if (!isRunning.value) {
        stopAnimation()
        return
    }
    scheduleNextFrame()
}

onBeforeUnmount(() => {
    stopAnimation()
})
</script>