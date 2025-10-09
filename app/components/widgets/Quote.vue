<script lang="ts" setup>
import { onMounted, ref } from 'vue'

type Quote = { text: string; author: string }

const quotes: Quote[] = [
    {
        "text": "偉大な仕事を成し遂げる唯一の方法は、自分の仕事を愛することだ。",
        "author": "Steve Jobs"
    },
    {
        "text": "できると思えばできるし、できないと思えばできない。",
        "author": "Henry Ford"
    },
    {
        "text": "人生は自転車のようなものだ。バランスを取るためには、進み続けなければならない。",
        "author": "Albert Einstein"
    },
    {
        "text": "あなたの時間は限られている。他人の人生を生きることで無駄にしてはいけない。",
        "author": "Steve Jobs"
    },
    {
        "text": "夢を追いかける勇気があれば、すべての夢は叶う。",
        "author": "Walt Disney"
    },
    {
        "text": "私は失敗したのではない。うまくいかない1万通りの方法を見つけただけだ。",
        "author": "Thomas Edison"
    },
    {
        "text": "未来は今日始まる。明日からではない。",
        "author": "Pope John Paul II"
    },
    {
        "text": "人生は一度きり。だからこそ、全力で生きる価値がある。",
        "author": "Mae West"
    }
]

const selectedQuote = ref<Quote | undefined>(quotes[0])

const pickRandomQuote = () => {
    if (quotes.length === 0) {
        selectedQuote.value = undefined
        return
    }
    const randomIndex = Math.floor(Math.random() * quotes.length)
    selectedQuote.value = quotes[randomIndex]
}

onMounted(() => {
    pickRandomQuote()
})
</script>


<template>
    <UPageCard class="h-[310px]">
        <div class="flex flex-col justify-center h-full">
            <div class="text-center px-4" v-if="selectedQuote">
                <p class="text-h2 text-xl mb-4">"{{ selectedQuote.text }}"</p>
                <p class="text-subtitle-1">- {{ selectedQuote.author }}</p>
            </div>
        </div>
    </UPageCard>
</template>
