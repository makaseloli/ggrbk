<template>
    <v-card height="310px">
        <v-card-item title="タイマー" class="pb-0"></v-card-item>
        <v-card-text class="d-flex justify-center">
            <v-progress-circular :model-value="progress" size="150" width="15">
                <span>{{ formattedNowTime }}</span>
            </v-progress-circular>
        </v-card-text>
        <v-card-actions class="d-flex justify-center">
            <v-text-field v-model.number="setTime" label="秒" type="number" min="0" max="3600" step="1"
                style="max-width: 200px;"></v-text-field>
            <v-btn @click="nowTime = setTime; startTimer()">スタート</v-btn>
            <v-btn @click="nowTime = 0">リセット</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const setTime = ref(0)
const nowTime = ref(0)

const progress = computed(() => {
    if (setTime.value <= 0) return 0
    const percentage = (nowTime.value / setTime.value) * 100
    return Math.min(Math.max(percentage, 0), 100)
})

const formattedNowTime = computed(() => {
    const totalSeconds = Math.max(nowTime.value, 0)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

const startTimer = () => {
    if (nowTime.value <= 0) return

    const interval = setInterval(() => {
        if (nowTime.value > 0) {
            nowTime.value -= 1
        } else {
            clearInterval(interval)
        }
    }, 1000)
}
</script>