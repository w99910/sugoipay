<script lang="ts" setup>
import { Background } from '@vue-flow/background'
import { useColorMode } from '@vueuse/core';

const mode = useColorMode()
</script>

<template>
    <div class="dropzone-background">
        <Background :pattern-color="mode === 'dark' ? '#aaa' : '#000'" :gap="24" />

        <div class="overlay">
            <slot />
        </div>
    </div>
</template>
