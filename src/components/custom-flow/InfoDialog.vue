<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { data } from '@/lib/global'
import Skeleton from '../ui/skeleton/Skeleton.vue'
</script>

<template>
    <Dialog v-model:open="data.openInfoDialog">
        <DialogContent class="h-[80vh] flex flex-col w-[80vw] max-w-auto">
            <DialogHeader>
                <DialogTitle>Documentation</DialogTitle>
                <DialogDescription>

                </DialogDescription>
            </DialogHeader>
            <Skeleton class="h-full w-full" />
            <DialogFooter>
                <Button type="submit" @click="data.openInfoDialog = false" :variant="'outline'">
                    Close
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>