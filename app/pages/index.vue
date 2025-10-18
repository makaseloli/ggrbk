<script lang="ts" setup>
import { onMounted, ref, watch, computed } from 'vue'
import type { CSSProperties } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from "#app";
import type { SelectItem } from '@nuxt/ui'

const ENGINE_KEY = 'ggrbk:selectedEngine'
const BG_KEY = 'ggrbk:backgroundImage'

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
  return query ? query + "🔍" : defaultDescription
})

const searchQuery = ref(resolveQueryParam(route.query.q))
const backgroundImage = useState<string | null>('backgroundImage', () => null)
const selectedEngine = ref<string | undefined>(undefined)
const Engines = ref<SelectItem[]>([
  { label: 'Google', value: 'https://www.google.com/search?q=' },
  { label: 'Bing', value: 'https://www.bing.com/search?q=' },
  { label: 'DuckDuckGo', value: 'https://duckduckgo.com/?q=' },
  { label: 'Yahoo!', value: 'https://search.yahoo.com/search?p=' },
  { label: 'Yahoo! Japan', value: 'https://search.yahoo.co.jp/search?p=' },
  { label: 'Ecosia', value: 'https://www.ecosia.org/search?q=' },
  { label: 'Brave', value: 'https://search.brave.com/search?q=' },
  { label: 'Startpage', value: 'https://www.startpage.com/do/dsearch?query=' },
  { label: 'Karama', value: 'https://karmasearch.org/search?q=' },
  { label: 'Perplexity', value: 'https://www.perplexity.ai/search?q=' },
  { label: 'ChatGPT', value: 'https://chatgpt.com/?q=' },
  { label: 'Copilot', value: 'https://copilot.microsoft.com/?q=' },
])

onMounted(() => {
  if (typeof window === 'undefined') return

  const savedEngine = window.localStorage.getItem(ENGINE_KEY)
  if (savedEngine) {
    selectedEngine.value = savedEngine
  }

  backgroundImage.value = window.localStorage.getItem(BG_KEY)
})

watch(selectedEngine, (newValue) => {
  if (typeof window === 'undefined') return

  if (newValue) {
    window.localStorage.setItem(ENGINE_KEY, newValue)
  } else {
    window.localStorage.removeItem(ENGINE_KEY)
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

const backgroundStyle = computed<CSSProperties>(() => {
  if (!backgroundImage.value) {
    return {}
  }

  return {
    backgroundImage: `url(${backgroundImage.value})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'fixed',
    inset: '0',
    zIndex: -1,
    opacity: 0.3
  }
})
</script>

<template>
  <UContainer class="mx-auto my-8 max-w-[750px]">
    <UCard>
      <template #header>
        <h2 class="text-2xl font-bold text-center">検索を開始。</h2>
      </template>
      <UPageList class="space-y-6">
        <USelect v-model="selectedEngine" :items="Engines" item-text="label" placeholder="検索エンジンを選択。" />
        <UInput v-model="searchQuery" placeholder="検索ワードを入力。" trailing-icon="lucide:search"
          @keyup.enter="onSearchSubmit" @click:trailing-icon="onSearchSubmit" />
      </UPageList>
    </UCard>
  </UContainer>
  <Widget />
  <div :style="backgroundStyle"></div>
</template>
