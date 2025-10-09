<script setup lang="ts">
const config = useRuntimeConfig()
</script>

<template>
    <USeparator icon="lucide:flag" />
    <UFooter>
        <p>Version: {{ config.public.appVersion }}</p>
    </UFooter>
</template>
