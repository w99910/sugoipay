<script lang="ts" setup>
import { Handle, Position, } from '@vue-flow/core'
import { Shield } from 'lucide-vue-next';
import { reactive, onMounted, watch } from 'vue'
import common from '@/lib/common';
import { Textarea } from '@/components/ui/textarea'
import { useVueFlow } from '@vue-flow/core';
import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
} from '@/components/ui/number-field'
import { config, data } from '@/lib/global';

const props = defineProps(['data', 'id'])

const _data = reactive({
    name: props.data.name,
    total: 100,
    type: props.data.type ?? 'ability',
    description: '',

})

onMounted(() => {
    const { updateNodeData, findNode } = useVueFlow();
    const node = findNode(props.id);

    if (node) {
        updateNodeData(props.id, {
            options: _data
        })

        const whiteListAttributes = ['references', 'options'];

        whiteListAttributes.push(...Object.keys(_data));

        watch(() => _data.type, () => {
            config.connections.feature.validate(node);
        })
    }

})

console.log('mounted feature node')

</script>

<template>
    <div class="custom-node" :class="{ '!border-red-500': data.errors[id] }">
        <div v-show="data.errors[id]"
            class="absolute z-[100] bg-red-500 text-sm px-2 py-1 rounded right-0 -top-2 transform -translate-y-full">{{
                data.errors[id] }}</div>
        <!-- <NodeResizer class="rounded-lg" color="transparent" :min-width="common.node.minWidth"
            :min-height="common.node.minHeight" /> -->
        <div class="flex items-center gap-x-2 bg-indigo-500 p-1.5">
            <div class="p-2 rounded bg-indigo-400">
                <Shield :size="common.iconSize" color="white" />
            </div> <input class="nodrag font-semibold text-white" type="text" placeholder="Enter feature name"
                v-model="_data.name" />
        </div>
        <div class="p-3 flex items-center gap-y-2 flex-col h-full">
            <div class="w-full flex items-center gap-x-2 justify-between">
                <button @click="_data.type = 'ability'"
                    :class="{ 'bg-gray-700 p-1.5 text-gray-100': _data.type === 'ability' }"
                    class="rounded w-full py-1.5 border">Ability</button>
                <button @click="_data.type = 'usage'"
                    :class="{ 'bg-gray-700 p-1.5  text-gray-100': _data.type === 'usage' }"
                    class="rounded w-full py-1.5 border">Usage</button>
            </div>
            <div v-show="_data.type === 'usage'" class="flex items-center gap-x-4 mt-2">
                <span class="label-text">Maximum</span>
                <NumberField class="max-w-[200px] nodrag" v-model="_data.total" id="threshold" :default-value="-1"
                    :min="-1">
                    <NumberFieldContent>
                        <NumberFieldDecrement />
                        <NumberFieldInput class="label-input" />
                        <NumberFieldIncrement />
                    </NumberFieldContent>
                </NumberField>
            </div>
            <Textarea class="nodrag" v-model="_data.description" placeholder="Enter description" />
        </div>

        <Handle type="source" :position="Position.Top" />
    </div>
</template>

<style></style>
