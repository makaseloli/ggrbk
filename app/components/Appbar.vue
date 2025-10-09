<script lang="ts" setup>
const toast = useToast()

const share = ref(false)
const hint = ref(false)

const locationOrigin = typeof window !== 'undefined' ? window.location.origin : ''

const copyHref = async () => {
    try {
        await navigator.clipboard.writeText(window.location.href)
        toast.add({
            title: 'URLをコピーしました!',
            icon: 'lucide:clipboard-copy'
        })
    } catch (err) {
    }
}

const navItems = ref([
    {
        label: 'ヒント',
        icon: 'lucide:circle-help',
        onClick: () => { hint.value = true },
    },
    {
        label: 'GitHub',
        icon: 'lucide:github',
        to: 'https://github.com/makaseloli/ggrbk',
        target: '_blank',
    }
])
</script>

<template>
    <UHeader mode="drawer" :menu="{
        inset: true,
    }">
        <template #title>
            <p><span class="gg">Googl</span><span class="bg">ing</span><span class="go">Go</span><span
                    class="ex">!</span><span class="jp"> Japan</span></p>
        </template>

        <UNavigationMenu :items="navItems" />

        <template #right>
            <UColorModeButton />


            <div>
                <UDrawer v-model:open="share" title="共有する。" inset>
                    <UButton color="neutral" variant="ghost" icon="lucide:share" />

                    <template #body>
                        <UPageList>
                            <UButton label="URLをコピーする。" color="primary" variant="solid" icon="lucide:clipboard-copy"
                                @click="copyHref(); share = false" class="my-2" />
                        </UPageList>
                    </template>
                </UDrawer>
            </div>
        </template>

        <template #body>
            <UNavigationMenu :items="navItems" orientation="vertical" class="my-2" />
        </template>
    </UHeader>

    <UModal v-model:open="hint" title="ヒント">
        <template #body>
            URLパラメータを使って、検索クエリを指定できます。<br>
            例えば、以下のようにURLを指定します。<br>
            <code>{{ locationOrigin }}/?q=Vue.js</code><br>
            これで、検索ボックスに「Vue.js」が自動的に入力されます。
        </template>
    </UModal>
</template>

<style>
.gg {
    font-family: "Inter", serif;
    color: #4286F5;
}

.bg {
    font-family: "Work Sans", serif;
    color: #078675;
}

.go {
    font-family: "Montserrat", serif;
    color: #DF5C39;
}

.ex {
    font-family: "Inter", sans-serif;
    font-style: italic;
    color: #570DCA;
}

.jp {
    font-family: "Kaisei Decol", serif;
    color: #FF0739;
}
</style>
