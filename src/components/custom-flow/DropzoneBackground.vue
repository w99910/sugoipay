<script lang="ts" setup>
import { Background } from '@vue-flow/background'
</script>

<template>
    <div class="dropzone-background">
        <Background pattern-color="#aaa" :gap="8" />

        <div class="overlay">
            <slot />
        </div>
    </div>
</template>
