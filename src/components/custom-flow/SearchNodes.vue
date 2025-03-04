<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxList } from '@/components/ui/combobox'
import { Check, Search } from 'lucide-vue-next'

const frameworks = ["Laravel", "Vue", "React", "Javascript", "Typescript", "Vite"]

const props = defineProps(['data', 'disableIcon', 'placeholder']);

const items = props.data ?? frameworks;

const emits = defineEmits(['select'])

</script>

<template>
    <Combobox by="label">
        <ComboboxAnchor>
            <div class="relative w-full max-w-sm items-center">
                <ComboboxInput :class="{ 'pl-9': !disableIcon }" :display-value="(val) => val ?? ''"
                    :placeholder="placeholder ?? 'Search...'" />
                <span v-if="!disableIcon" class="absolute start-0 inset-y-0 flex items-center justify-center px-3">
                    <Search class="size-4 text-muted-foreground" />
                </span>
            </div>
        </ComboboxAnchor>

        <ComboboxList>
            <ComboboxEmpty>
                No result found.
            </ComboboxEmpty>

            <ComboboxGroup>
                <ComboboxItem @select="(...args) => emits('select', ...args)" v-for="item in items" :key="item"
                    :value="item" class="capitalize">
                    {{ item }}

                    <ComboboxItemIndicator>
                        <Check :class="cn('ml-auto h-4 w-4')" />
                    </ComboboxItemIndicator>
                </ComboboxItem>
            </ComboboxGroup>
        </ComboboxList>
    </Combobox>
</template>