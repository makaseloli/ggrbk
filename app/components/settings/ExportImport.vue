<script lang="ts" setup>
import { ref } from 'vue'

const toast = useToast()

interface Format {
    version: number
    exportedAt: string
    settings: SettingsData
}

interface SettingsData {
    engine: string | null
    widgets: string[] | null
    color: string | null
    wallpaper: string | null
    darkMode: 'light' | 'dark' | 'system'
}

const ENGINE = 'ggrbk:selectedEngine'
const WIDGETS = 'ggrbk:isActiveWidgets'
const COLOR = 'ggrbk:primaryColor'
const WALLPAPER = 'ggrbk:backgroundImage'
const DARK_MODE = 'nuxt-color-mode'

const fileInputRef = ref<HTMLInputElement | null>(null)

const exportSettings = () => {
    if (!import.meta.client) {
        return
    }

    const storedWidgets = localStorage.getItem(WIDGETS)
    let widgets: string[] | null = null

    if (storedWidgets) {
        try {
            widgets = JSON.parse(storedWidgets)
        } catch (error) {
            console.error('Failed to parse stored widgets:', error)
        }
    }

    const settingsData: SettingsData = {
        engine: localStorage.getItem(ENGINE) || null,
        widgets,
        color: localStorage.getItem(COLOR) || null,
        darkMode: (localStorage.getItem(DARK_MODE) as 'light' | 'dark' | 'system') || 'system',
        wallpaper: localStorage.getItem(WALLPAPER) || null,
    }

    const exportData: Format = {
        version: 1,
        exportedAt: new Date().toISOString(),
        settings: settingsData
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `ggrbk_settings_${new Date().toISOString()}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
}

const importSettings = (file: File) =>
    new Promise<void>((resolve, reject) => {
        if (!import.meta.client) {
            resolve()
            return
        }

        const reader = new FileReader()

        reader.onload = event => {
            try {
                const result = event.target?.result

                if (typeof result !== 'string') {
                    throw new Error('Invalid file content')
                }

                const parsed: Format = JSON.parse(result)

                if (parsed.version !== 1) {
                    throw new Error('Unsupported format version')
                }

                const settings = parsed.settings

                if (settings.engine !== null) {
                    localStorage.setItem(ENGINE, settings.engine)
                } else {
                    localStorage.removeItem(ENGINE)
                }

                if (settings.widgets !== null) {
                    localStorage.setItem(WIDGETS, JSON.stringify(settings.widgets))
                } else {
                    localStorage.removeItem(WIDGETS)
                }

                if (settings.color !== null) {
                    localStorage.setItem(COLOR, settings.color)
                } else {
                    localStorage.removeItem(COLOR)
                }

                if (settings.wallpaper !== null) {
                    localStorage.setItem(WALLPAPER, settings.wallpaper)
                } else {
                    localStorage.removeItem(WALLPAPER)
                }

                localStorage.setItem(DARK_MODE, settings.darkMode)

                resolve()
                location.reload()
            } catch (error) {
                console.error('Failed to import settings:', error)
                toast.add({
                    title: '設定のインポートに失敗しました。無効なファイルの可能性があります。',
                    icon: 'lucide:alert-circle',
                    color: 'error',
                })
                reject(error)
            }
        }

        reader.onerror = () => {
            toast.add({
                title: 'ファイルの読み込み中にエラーが発生しました。',
                icon: 'lucide:alert-circle',
                color: 'error',
            })
            reject(reader.error)
        }

        reader.readAsText(file)
    })

const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) {
        return
    }

    try {
        await importSettings(file)
    } finally {
        target.value = ''
    }
}

const pickFile = () => {
    if (!import.meta.client) {
        return
    }

    fileInputRef.value?.click()
}
</script>

<template>
    <UPageList>
        <UButton label="設定をエクスポートする。" color="primary" variant="solid" icon="lucide:upload" @click="exportSettings" />
        <UButton label="設定をインポートする。" color="primary" variant="solid" icon="lucide:download" @click="pickFile"
            class="mt-4" />
        <input ref="fileInputRef" type="file" accept="application/json" class="hidden" @change="handleFileChange" />
    </UPageList>
</template>
