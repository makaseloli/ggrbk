<script lang="ts" setup>
import { computed, onMounted, useAppConfig, useHead, useRouter, useState, watchEffect } from '#imports';
import colors from 'tailwindcss/colors';

type TailwindColorName = keyof typeof colors;
type TailwindPalette = Record<string, string> & { 500: string };

const router = useRouter();
const appConfig = useAppConfig();
const STORAGE_KEY = 'ggrbk:primaryColor';
const primaryColor = useState<TailwindColorName>('primaryColor', () => 'teal' as TailwindColorName);

const currentPath = computed(
  () => `https://www.ggrbk.com${router.currentRoute.value.path}`
);

const isTailwindPalette = (value: unknown): value is TailwindPalette =>
  typeof value === 'object' && value !== null && typeof (value as TailwindPalette)['500'] === 'string';

const isValidTailwindColor = (name: string): name is TailwindColorName => {
  const entry = (colors as Record<string, string | TailwindPalette>)[name];

  if (!entry) {
    return false;
  }

  return isTailwindPalette(entry);
};

onMounted(() => {
  if (!import.meta.client) {
    return;
  }

  const storedColor = localStorage.getItem(STORAGE_KEY);

  if (storedColor && isValidTailwindColor(storedColor)) {
    primaryColor.value = storedColor;
  }
});

watchEffect(() => {
  if (!appConfig.ui?.colors) {
    return;
  }

  const color = primaryColor.value;

  if (color && appConfig.ui.colors.primary !== color) {
    appConfig.ui.colors.primary = color;
  }
});

useHead({
  meta: [
    { property: 'og:url', content: currentPath },
    { property: 'og:title', content: '検索を開始。' },
  ],
});
</script>


<template>
  <NuxtPwaManifest />
  <UApp>
    <Appbar />
    <NuxtPage />
    <Footer />
  </UApp>
</template>
