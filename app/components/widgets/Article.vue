<template>
    <v-card prepend-icon="mdi-star-outline" title="今アツい記事" variant="outlined" height="310px">
        <v-card-text class="py-0" style="height: calc(100% - 64px); overflow-y: auto;">
            <v-list v-if="articles.length > 0">
                <v-list-item v-for="article in articles" :key="article.url" :href="article.url" target="_blank"
                    density="compact" link>
                    <v-list-item-title>{{ article.title }}</v-list-item-title>
                    <v-list-item-subtitle class="text--secondary">{{ article.description }}</v-list-item-subtitle>
                    <v-icon icon="mdi-open-in-new" size="16"></v-icon>
                </v-list-item>
            </v-list>

            <div v-else class="d-flex justify-center align-center" style="height: 100%;">
                <v-progress-circular indeterminate size="40"></v-progress-circular>
            </div>
        </v-card-text>
    </v-card>
</template>

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