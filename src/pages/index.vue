<template>
  <Appbar />
  <v-container>
    <v-row>
      <v-col>
        <v-alert title="知識はここから" type="info" text="人に聞くのは最終手段です。一通り調べてから聞くようにしましょう。"></v-alert>
        <br>
        <v-select v-model="selectedEngine" :items="Engines" item-title="name" item-value="url"
          label="検索エンジンを選択"></v-select>
        <v-text-field v-model="searchQuery" append-inner-icon="mdi-magnify" label="検索" @keyup.enter="onSearchSubmit" @click:append-inner="onSearchSubmit"></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

const STORAGE_KEY = 'ggrbk:selectedEngine'

const route = useRoute()

const resolveQueryParam = (rawQuery: unknown): string => {
  if (Array.isArray(rawQuery)) {
    return rawQuery[0] ?? ''
  }
  return typeof rawQuery === 'string' ? rawQuery : ''
}

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
  { name: 'Perplexity', url: 'https://www.perplexity.ai/search?q=' }
])

const defaultEngineUrl = Engines.value[0]?.url ?? null

const metaDescription = computed(() => {
  const keyword = searchQuery.value.trim()
  return keyword ? `🔍 ${keyword}` : '検索を開始。'
})

useHead(() => ({
  title: metaDescription.value,
  meta: [
    {
      name: 'description',
      content: metaDescription.value
    },
    {
      property: 'og:description',
      content: metaDescription.value
    }
  ]
}))

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
  window.open(searchUrl, '_blank', 'noopener,noreferrer')
}

</script>