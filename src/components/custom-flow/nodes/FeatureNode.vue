<script lang="ts" setup>
import { Handle, Position, } from '@vue-flow/core'
import { Shield } from 'lucide-vue-next';
import { reactive, ref } from 'vue'
import common from '@/lib/common';
import { Textarea } from '@/components/ui/textarea'
const props = defineProps(['data', 'id'])
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
    type: 'ability',
    description: ''
})

console.log('mounted feature node')

</script>

<template>
    <div class="custom-node">
        <!-- <span>{{ id }}</span> -->
        <!-- <NodeResizer class="rounded-lg" color="transparent" :min-width="common.node.minWidth"
            :min-height="common.node.minHeight" /> -->
        <div class="flex items-center gap-x-2 bg-[#4a48bb] p-1.5">
            <div class="p-2 rounded bg-[#5e5cd3]">
                <Shield :size="common.iconSize" color="white" />
            </div> <input class="nodrag font-semibold text-white" type="text" placeholder="Enter feature name"
                v-model="data.name" />
        </div>
        <div class="p-3 flex items-center gap-y-2 flex-col h-full">
            <div class="w-full flex items-center gap-x-2 justify-between">
                <button @click="data.type = 'ability'"
                    :class="{ 'bg-gray-700 p-1.5 text-gray-100': data.type === 'ability' }"
                    class="rounded w-full py-1.5 border">Ability</button>
                <button @click="data.type = 'usage'"
                    :class="{ 'bg-gray-700 p-1.5  text-gray-100': data.type === 'usage' }"
                    class="rounded w-full py-1.5 border">Usage</button>
            </div>
            <div v-show="data.type === 'usage'" class="flex items-center gap-x-4 mt-2">
                <span class="label-text">Limit Threshold</span>
                <NumberField class="max-w-[200px] nodrag" v-model="data.total" id="threshold" :default-value="10"
                    :min="-1">
                    <NumberFieldContent>
                        <NumberFieldDecrement />
                        <NumberFieldInput class="label-input" />
                        <NumberFieldIncrement />
                    </NumberFieldContent>
                </NumberField>
            </div>
            <Textarea class="nodrag" v-model="data.description" placeholder="Enter feature description" />
        </div>

        <Handle type="source" :position="Position.Top" />
    </div>
</template>

<style></style>
