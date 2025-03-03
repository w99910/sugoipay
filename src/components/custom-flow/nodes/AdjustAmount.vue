<script lang="ts" setup>
import { Handle, Position, useVueFlow, } from '@vue-flow/core'
import { CircleDivide } from 'lucide-vue-next';
import { onMounted, reactive, ref, watch, watchEffect } from 'vue'
import common from '@/lib/common';
import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
} from '@/components/ui/number-field'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

const props = defineProps(['data', 'id'])

const { updateNodeData, getNodes } = useVueFlow();
const data = reactive({
    divideBy: props.data.options?.divideBy ?? 1,
    round: props.data.options?.round ?? 'up'
})

onMounted(() => {
    updateNodeData(props.id, {
        options: data
    })

    watch(data, (_) => {

        //     const edges = common.data.edges.filter(({ source, target }) => target === props.id);

        //     if (edges.length > 0) {
        //         const node = findNode(props.id);
        //         if (!node) return;
        //         for (let edge of edges) {
        //             const sourceNode = findNode(edge.source);
        //             if (!sourceNode) continue;

        //             common.applyEffect(vuef, node, sourceNode, false)
        //         }
        //     }

        console.log(getNodes.value)
    })
})

console.log('mounted adjust node')


</script>

<template>
    <div class="custom-node">
        <!-- <span>{{ id }}</span> -->
        <Handle type="source" :position="Position.Top" />
        <!-- <NodeResizer class="rounded-lg" color="transparent" :min-width="common.node.minWidth"
            :min-height="common.node.minHeight" /> -->
        <div class="flex items-center gap-x-2 bg-blue-600 p-1.5">
            <div class="p-2 rounded bg-blue-500">
                <CircleDivide :size="common.iconSize" color="white" />
            </div> <span class="text-white font-semibold text-sm">Adjust Amount</span>
        </div>

        <div class="flex flex-col p-2">

            <div class="flex flex-col gap-y-4 p-2 items-start">
                <div class="flex items-center gap-x-2">
                    <span class="label-text">Divide by </span>
                    <NumberField class="nodrag w-[200px] max-w-max" v-model="data.divideBy" id="divisor"
                        :default-value="10" :min="1">
                        <NumberFieldContent>
                            <NumberFieldDecrement />
                            <NumberFieldInput class="label-input" />
                            <NumberFieldIncrement />
                        </NumberFieldContent>
                    </NumberField>
                </div>

                <div class="flex items-center gap-x-2">
                    <span class="label-text">and round </span>
                    <Select class="p-1 outline-none !focus:ring-0 !focus:outline-none" v-model="data.round">
                        <SelectTrigger class="w-[180px]">
                            <SelectValue class="label-input" placeholder="Select interval" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="up">
                                    up
                                </SelectItem>
                                <SelectItem value="down">
                                    down
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>


            </div>
        </div>
        <Handle type="target" :position="Position.Bottom" />
    </div>
</template>

<style></style>
