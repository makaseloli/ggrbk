<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const articles = ref<Array<{ title: string; description: string; url: string }>>([])

const getArticles = async () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const url = `https://api.wikimedia.org/feed/v1/wikipedia/ja/featured/${year}/${month}/${day}?origin=${encodeURIComponent(window.location.origin)}`
    const res = await fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    })
    if (!res.ok) {
        throw new Error(`Failed to fetch featured articles: ${res.status} ${res.statusText}`)
    }
    const data = await res.json()
    articles.value = data.mostread?.articles?.slice(0, 5).map((article: any) => ({
        title: article.title,
        description: article.description,
        url: `https://ja.wikipedia.org/wiki/${encodeURIComponent(article.title)}`
    })) ?? []
}

onMounted(() => {
    getArticles()
})
</script>

<template>
    <UPageCard class="h-[310px] overflow-y-auto">
        <UPageList>
          <div class="flex flex-col justify-center h-full">
            <div v-if="articles.length === 0" class="text-center text-gray-500 dark:text-gray-400">
                記事を取得中...
                <UProgress animation="swing" class="mx-auto mt-4" />
            </div>
            <div v-else>
                <div v-for="article in articles" :key="article.url" class="mb-4">
                    <ULink :href="article.url" target="_blank" rel="noopener noreferrer" class="text-lg font-medium hover:underline">
                        {{ article.title }}
                        <UIcon name="lucide:external-link" class="size-4" />
                    </ULink>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ article.description }}
                    </p>
                </div>
            </div>
        </div>          
        </UPageList>
    </UPageCard>
</template>
