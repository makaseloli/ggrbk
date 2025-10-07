<template>
  <NuxtPwaManifest />
  <v-app>
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>


<script lang="ts" setup>
import { computed } from '#imports';
import { useHead, useRouter } from '#app';

const router = useRouter();
const currentPath = computed(
  () => `https://www.ggrbk.com${router.currentRoute.value.path}`
);

useHead({
  meta: [
    { property: 'og:url', content: currentPath },
    { property: 'og:title', content: '検索を開始。' },
  ],
});
</script>
