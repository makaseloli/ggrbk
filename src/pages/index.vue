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
import { onMounted, ref, watch } from 'vue'

const STORAGE_KEY = 'ggrbk:selectedEngine'

const params = new URLSearchParams(window.location.search)
const query = params.get('q') ?? ''

const searchQuery = ref(query)
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

const syncMeta = () => {
  if (typeof document === 'undefined') return

  const keyword = searchQuery.value.trim()
  const displayText = keyword ? `🔍 ${keyword}` : '検索を開始。'

  document.title = displayText

  const ensureMeta = (selector: string, attributes: Record<string, string>) => {
    let meta = document.querySelector<HTMLMetaElement>(selector)
    if (!meta) {
      meta = document.createElement('meta')
      for (const [key, value] of Object.entries(attributes)) {
        meta.setAttribute(key, value)
      }
      document.head.appendChild(meta)
    }
    return meta
  }

  const descriptionMeta = ensureMeta('meta[name="description"]', { name: 'description' })
  descriptionMeta.setAttribute('content', displayText)

  const ogDescriptionMeta = ensureMeta('meta[property="og:description"]', { property: 'og:description' })
  ogDescriptionMeta.setAttribute('content', displayText)
}

onMounted(() => {
  if (typeof window === 'undefined') return

  const savedEngine = window.localStorage.getItem(STORAGE_KEY)
  selectedEngine.value = savedEngine ?? defaultEngineUrl

  syncMeta()
})

watch(selectedEngine, (newValue) => {
  if (typeof window === 'undefined') return

  if (newValue) {
    window.localStorage.setItem(STORAGE_KEY, newValue)
  } else {
    window.localStorage.removeItem(STORAGE_KEY)
  }
})

watch(searchQuery, () => {
  syncMeta()
})

const onSearchSubmit = () => {
  if (!searchQuery.value || !selectedEngine.value) return

  const searchUrl = selectedEngine.value + encodeURIComponent(searchQuery.value)
  window.open(searchUrl, '_blank')
}

</script>