<script lang="ts" setup>
import { Handle, Position, } from '@vue-flow/core'
import { Shield } from 'lucide-vue-next';
import { reactive, ref } from 'vue'
import common from '@/lib/common';
const props = defineProps(['data'])
import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
} from '@/components/ui/number-field'

const data = reactive({
    name: props.data.name,
    total: 10,
    type: 'ability'
})

console.log('mounted feature node')

</script>

<template>
    <div class="custom-node">
        <!-- <NodeResizer class="rounded-lg" color="transparent" :min-width="common.node.minWidth"
            :min-height="common.node.minHeight" /> -->
        <div class="flex items-center gap-x-2 bg-gray-100 p-1.5">
            <div class="p-2 rounded bg-[#1e6091]">
                <Shield :size="common.iconSize" color="white" />
            </div> <input class="nodrag font-semibold text-[#1e6091]" type="text" placeholder="Enter feature name"
                v-model="data.name" />
        </div>
        <div class="p-3 flex items-center gap-y-2 flex-col h-full">
            <div class="w-full flex items-center gap-x-2 justify-between px-2">
                <button @click="data.type = 'ability'"
                    :class="{ 'bg-gray-700 p-1.5 text-gray-100': data.type === 'ability' }"
                    class="rounded w-full py-1.5 border">Ability</button>
                <button @click="data.type = 'usage'"
                    :class="{ 'bg-gray-700 p-1.5  text-gray-100': data.type === 'usage' }"
                    class="rounded w-full py-1.5 border">Usage</button>
            </div>
            <div v-show="data.type === 'usage'" class="flex items-center gap-x-2 mt-2">
                <span class="text-gray-600">Limit Threshold</span>
                <NumberField class="max-w-[200px] nodrag" v-model="data.total" id="threshold" :default-value="10"
                    :min="-1">
                    <NumberFieldContent>
                        <NumberFieldDecrement />
                        <NumberFieldInput />
                        <NumberFieldIncrement />
                    </NumberFieldContent>
                </NumberField>
            </div>
        </div>

        <Handle type="source" :position="Position.Top" />
    </div>
</template>

<style></style>
