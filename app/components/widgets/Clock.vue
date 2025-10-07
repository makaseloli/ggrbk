<template>
    <v-card prepend-icon="mdi-clock-outline" title="時計" variant="outlined" height="310px">
        <v-card-text class="py-0">
            <v-col class="text-h2 text-center" cols="5.5">
                {{ hour }}<span class="dot" :class="{ 'dot--visible': isColonVisible }">:</span>{{ minute }}<span
                    class="dot" :class="{ 'dot--visible': isColonVisible }">:</span>{{ second }}
            </v-col>
        </v-card-text>
    </v-card>
</template>

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

<style scoped>
.dot {
    opacity: 0;
}

.dot--visible {
    opacity: 1;
    transition: opacity 0s ease-out;
}
</style>
