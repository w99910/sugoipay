<script lang="ts" setup>
import { Handle, Position, useVueFlow, } from '@vue-flow/core'
import { Braces } from 'lucide-vue-next';
import { reactive, onMounted, watch } from 'vue'
import { NodeResizer } from '@vue-flow/node-resizer'
import common from '@/lib/common';
import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
} from '@/components/ui/number-field'

const props = defineProps(['data', 'id']);

const vueFlow = useVueFlow();

const data = reactive({
    amount: props.data.amount ?? 1,
    until: props.data.until ?? 1,
})

onMounted(() => {
    vueFlow.updateNodeData(props.id, {
        options: data
    })

    watch(data, (_) => {

        const edges = common.data.edges.filter(({ target }) => target === props.id);

        if (edges.length > 0) {
            const node = vueFlow.findNode(props.id);
            if (!node) return;
            for (let edge of edges) {
                const sourceNode = vueFlow.findNode(edge.source);
                if (!sourceNode) continue;

                // common.applyEffect(vueFlow, node, sourceNode, false)
            }
        }

        console.log(vueFlow.getNodes.value)
    })
})

console.log('mounted feature condition node')


</script>

<template>
    <div class="custom-node">
        <Handle type="source" :position="Position.Top" />
        <!-- <NodeResizer class="rounded-lg" color="transparent" :min-width="common.node.minWidth"
            :min-height="common.node.minHeight" /> -->
        <div class="flex items-center gap-x-2 bg-gray-100 p-1.5">
            <div class="p-2 rounded bg-[#3753d1]">
                <Braces :size="common.iconSize" color="white" />
            </div> <span class="text-[#3753d1] font-semibold text-sm">Feature Billing Condition</span>
        </div>

        <div class="flex flex-col gap-y-2 p-2">

            <div class="flex flex-col gap-2 p-2 items-start">
                <div class="flex items-center gap-x-2">
                    <span class="text-gray-600">Charge</span>
                    <NumberField class="w-[200px] max-w-max nodrag" v-model="data.amount" :step="0.001"
                        :default-value="1" :format-options="{
                            style: 'currency',
                            currency: 'USD',
                            currencyDisplay: 'code',
                            currencySign: 'accounting',
                            maximumFractionDigits: 3
                        }">
                        <NumberFieldContent>
                            <NumberFieldDecrement />
                            <NumberFieldInput />
                            <NumberFieldIncrement />
                        </NumberFieldContent>
                    </NumberField>
                </div>

                <span class="text-gray-600">until amount reaches </span>
                <NumberField class="nodrag" v-model="data.until" id="age" :default-value="10" :min="1">
                    <NumberFieldContent>
                        <NumberFieldDecrement />
                        <NumberFieldInput />
                        <NumberFieldIncrement />
                    </NumberFieldContent>
                </NumberField>
            </div>
        </div>
        <Handle type="target" :position="Position.Bottom" />
    </div>
</template>

<style></style>
