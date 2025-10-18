<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

const toast = useToast()

const acceptedTypes = 'image/png,image/jpeg,image/gif,image/webp,image/jxl'
const maxFileSize = 4 * 1024 * 1024

const file = ref<File | null>(null)
const isProcessing = ref(false)

const STORAGE_KEY = 'ggrbk:backgroundImage'
const backgroundImage = useState<string | null>('backgroundImage', () => null)

const hasStoredBackground = computed(() => Boolean(backgroundImage.value))
const backgroundImageSrc = computed(() => backgroundImage.value ?? '')

const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result)
            } else {
                reject(new Error('Failed to read file'))
            }
        }

        reader.onerror = () => {
            reject(reader.error ?? new Error('Failed to read file'))
        }

        reader.readAsDataURL(file)
    })

const isImageFile = (candidate: File) => {
    if (candidate.type) {
        return candidate.type.startsWith('image/')
    }

    return /\.(png|jpe?g|gif|svg|webp|jxl)$/i.test(candidate.name)
}

const handleFileChange = async (selected: File) => {
    if (!import.meta.client) {
        return
    }

    if (!isImageFile(selected)) {
        toast.add({
            title: '有効な画像ファイルを選択してください。',
            icon: 'lucide:alert-circle',
            color: 'error',
        })
        return
    }

    if (selected.size > maxFileSize) {
        toast.add({
            title: 'ファイルサイズが大きすぎます。4MB 以下の画像を選択してください。',
            icon: 'lucide:alert-circle',
            color: 'error',
        })
        return
    }

    try {
        isProcessing.value = true
        const base64 = await readFileAsDataUrl(selected)
        backgroundImage.value = base64
        localStorage.setItem(STORAGE_KEY, base64)
    } catch (error) {
        console.error(error)
        toast.add({
            title: '画像の読み込み中にエラーが発生しました。',
            icon: 'lucide:alert-circle',
            color: 'error',
        })
    } finally {
        isProcessing.value = false
        file.value = null
    }
}

const clearBackground = () => {
    if (!import.meta.client) {
        return
    }

    backgroundImage.value = null
    localStorage.removeItem(STORAGE_KEY)
}

onMounted(() => {
    if (!import.meta.client) {
        return
    }

    const storedImage = localStorage.getItem(STORAGE_KEY)

    if (storedImage) {
        backgroundImage.value = storedImage
    }
})

watch(file, selected => {
    if (!selected) {
        return
    }

    handleFileChange(selected)
})
</script>

<template>
    <div class="space-y-4">
        <UFileUpload v-model="file" :accept="acceptedTypes" label="画像をここへ。"
            description="PNG, JPG, WEBP または JXL (最大 4MB)" :disabled="isProcessing" />

        <div v-if="hasStoredBackground" class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <img :src="backgroundImageSrc" alt="現在の壁紙" class="h-40 w-full object-cover" />
            <div class="flex justify-end bg-gray-50 p-2 dark:bg-gray-800">
                <UButton color="neutral" variant="ghost" size="sm" :disabled="isProcessing" @click="clearBackground">
                    壁紙を削除
                </UButton>
            </div>
        </div>
    </div>
</template>
