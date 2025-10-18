<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

const hour = ref('')
const minute = ref('')
const second = ref('')

const isColonVisible = ref(true)

let intervalId: number | undefined
let fadeTimeoutId: number | undefined

const triggerBlink = () => {
    isColonVisible.value = true

    if (fadeTimeoutId !== undefined) {
        window.clearTimeout(fadeTimeoutId)
    }

    fadeTimeoutId = window.setTimeout(() => {
        isColonVisible.value = false
    }, 1000)
}

const updateTime = () => {
    const now = new Date()
    hour.value = String(now.getHours()).padStart(2, '0')
    minute.value = String(now.getMinutes()).padStart(2, '0')
    second.value = String(now.getSeconds()).padStart(2, '0')
    if (Number(second.value) % 2 === 0) {
        triggerBlink()
    }
}
onMounted(() => {
    updateTime()
    intervalId = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
    if (intervalId !== undefined) {
        window.clearInterval(intervalId)
    }

    if (fadeTimeoutId !== undefined) {
        window.clearTimeout(fadeTimeoutId)
    }
})
</script>

<template>
    <UPageCard class="h-[310px] bg-default/60 backdrop-blur">
        <div class="flex flex-col justify-center h-full">
            <p class="text-center text-h2 text-4xl font-mono">
                {{ hour }}<span class="dot" :class="{ 'dot--visible': isColonVisible }">:</span>{{ minute }}<span
                    class="dot" :class="{ 'dot--visible': isColonVisible }">:</span>{{ second }}
            </p>
        </div>
    </UPageCard>
</template>

<style scoped>
.dot {
    opacity: 0;
}

.dot--visible {
    opacity: 1;
    transition: opacity 0s ease-out;
}
</style>
