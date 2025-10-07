<template>
    <v-app-bar elevation="0">
        <v-app-bar-title><span class="gg">Googl</span><span class="bg">ing</span><span class="go">Go</span><span class="ex">!</span><span class="jp"> Japan</span></v-app-bar-title>

        <v-btn icon="mdi-share-variant-outline" @click="share = true"></v-btn>

        <v-dialog max-width="500">
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn icon="mdi-help-circle-outline" v-bind="activatorProps"></v-btn>
            </template>

            <template v-slot:default="{ isActive }">
                <v-card prepend-icon="mdi-help-circle-outline" title="ヒント">
                    <v-card-text>
                        URLパラメータを使って、検索クエリを指定できます。<br>
                        例えば、以下のようにURLを指定します。<br>
                        <code>{{ locationOrigin }}/?q=Vue.js</code><br>
                        これで、検索ボックスに「Vue.js」が自動的に入力されます。
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn variant="outlined" rounded text="わかった。" @click="isActive.value = false"></v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>

        <v-btn icon="mdi-github" @click="openGitHub"></v-btn>
    </v-app-bar>

    <v-bottom-sheet v-model="share" style="max-width: 500px;">
        <v-card>
            <v-card-title>
                <v-list>
                    <v-list-subheader title="このサイトを共有する"></v-list-subheader>
                    <v-list-item title="リンクをコピー" prepend-icon="mdi-link"
                        @click="copySnackbar = true; share = false; copyHref()"></v-list-item>
                </v-list>
            </v-card-title>
        </v-card>
    </v-bottom-sheet>

    <v-snackbar v-model="copySnackbar" timeout="1000" location="bottom center">
        リンクがコピーされました
        <template v-slot:actions>
            <v-btn text @click="copySnackbar = false">閉じる</v-btn>
        </template>
    </v-snackbar>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const share = ref(false)
const copySnackbar = ref(false)
const locationOrigin = typeof window !== 'undefined' ? window.location.origin : ''

const copyHref = async () => {
    try {
        await navigator.clipboard.writeText(window.location.href)
    } catch (err) {
    }
}

const openGitHub = () => {
    if (typeof window !== 'undefined') {
        window.location.href = 'https://github.com/makaseloli/ggrbk-vue'
    }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,800;1,14..32,800&family=Kaisei+Decol:wght@700&family=Montserrat:ital,wght@0,700;1,700&family=Work+Sans:ital,wght@0,700;1,700&display=swap');

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