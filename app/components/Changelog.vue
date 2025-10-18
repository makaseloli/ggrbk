<script lang="ts" setup>
import type { TimelineItem } from '@nuxt/ui'

const items = ref<TimelineItem[]>([
    {
        date: '2025/10/18',
        title: '3.5.0',
        description: '設定のエクスポート/インポート機能を追加。',
        icon: 'lucide:package-open'
    },
    {
        date: '2025/10/18',
        title: '3.4.1',
        description: '全てのカードにぼかし効果を追加。',
        icon: 'lucide:waves'
    },
    {
        date: '2025/10/18',
        title: '3.4.0',
        description: 'アプリのカラーモード設定と壁紙機能を追加。',
        icon: 'lucide:paintbrush'
    },
    {
        date: '2025/10/18',
        title: '3.3.1',
        description: 'バージョンの表記方法を統一。',
        icon: 'lucide:hash'
    },
    {
        date: '2025/10/18',
        title: '3.3.0',
        description: '更新情報を表示する機能を追加。',
        icon: 'lucide:history'
    },
    {
        date: '2025/10/10',
        title: '3.2.0',
        description: 'ライフゲームウィジェットを追加。',
        icon: 'lucide:life-buoy'
    },
    {
        date: '2025/10/10',
        title: '3.1.0',
        description: '設定画面を追加。',
        icon: 'lucide:settings'
    },
    {
        date: '2025/10/10',
        title: '3.0.3',
        description: '人気記事ウィジェットを修正。',
        icon: 'lucide:newspaper'
    },
    {
        date: '2025/10/9',
        title: '3.0.2',
        description: 'フッターの情報を変更。',
        icon: 'lucide:info'
    },
    {
        date: '2025/10/9',
        title: '3.0.1',
        description: 'ナビゲーションバーを改善。',
        icon: 'lucide:navigation'
    },
    {
    date: '2025/10/9',
    title: '3.0.0',
    description: 'Nuxt UIへ移行。',
    icon: 'lucide:dock'
    }
])
</script>

<template>
  <UTimeline :default-value="0" :items="items" />
</template>
