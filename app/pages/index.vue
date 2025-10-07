<template>
  <Appbar />
  <v-container max-width="750px">
    <v-row>
      <v-col>
        <v-select variant="outlined" v-model="selectedEngine" :items="Engines" item-title="name" item-value="url"
          label="検索エンジンを選択"></v-select>
        <v-text-field variant="outlined" v-model="searchQuery" append-inner-icon="mdi-magnify" label="検索"
          @keyup.enter="onSearchSubmit" @click:append-inner="onSearchSubmit"></v-text-field>
      </v-col>
    </v-row>
  </v-container>
  <Widget />
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from "#app";

const STORAGE_KEY = 'ggrbk:selectedEngine'

const route = useRoute()

const resolveQueryParam = (rawQuery: unknown): string => {
  if (Array.isArray(rawQuery)) {
    return rawQuery[0] ?? ''
  }
  return typeof rawQuery === 'string' ? rawQuery : ''
}

const defaultDescription = '次世代検索ツール「GooglingGo! Japan」を使って、より効率的に情報を検索しましょう。'
const metaDescription = computed(() => {
  const query = searchQuery.value?.trim()
  return query ?  query + "🔍" : defaultDescription
})

const searchQuery = ref(resolveQueryParam(route.query.q))
const selectedEngine = ref<string | null>(null)
const Engines = ref([
  { name: 'Google', url: 'https://www.google.com/search?q=' },
  { name: 'Bing', url: 'https://www.bing.com/search?q=' },
  { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
  { name: 'Yahoo!', url: 'https://search.yahoo.com/search?p=' },
  { name: 'Yahoo! Japan', url: 'https://search.yahoo.co.jp/search?p=' },
  { name: 'Ecosia', url: 'https://www.ecosia.org/search?q=' },
  { name: 'Brave', url: 'https://search.brave.com/search?q=' },
  { name: 'Startpage', url: 'https://www.startpage.com/do/dsearch?query=' },
  { name: 'Karama', url: 'https://karmasearch.org/search?q=' },
  { name: 'Perplexity', url: 'https://www.perplexity.ai/search?q=' },
  { name: 'ChatGPT', url: 'https://chatgpt.com/?q=' },
  { name: 'Copilot', url: 'https://copilot.microsoft.com/?q=' },
])

const defaultEngineUrl = Engines.value[0]?.url ?? null

onMounted(() => {
  if (typeof window === 'undefined') return

  const savedEngine = window.localStorage.getItem(STORAGE_KEY)
  selectedEngine.value = savedEngine ?? defaultEngineUrl
})

watch(selectedEngine, (newValue) => {
  if (typeof window === 'undefined') return

  if (newValue) {
    window.localStorage.setItem(STORAGE_KEY, newValue)
  } else {
    window.localStorage.removeItem(STORAGE_KEY)
  }
})

watch(
  () => route.query.q,
  (newQuery) => {
    searchQuery.value = resolveQueryParam(newQuery)
  }
)

const onSearchSubmit = () => {
  if (!searchQuery.value || !selectedEngine.value) return

  const searchUrl = selectedEngine.value + encodeURIComponent(searchQuery.value)
  window.location.href = searchUrl
}

useHead(() => ({
  title: 'GooglingGo! Japan',
  meta: [
    { property: 'og:description', content: metaDescription.value }
  ]
}))
</script>
