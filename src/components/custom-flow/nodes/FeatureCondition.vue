<script lang="ts" setup>
import { Handle, Position, } from '@vue-flow/core'
import { Braces } from 'lucide-vue-next';
import { reactive, ref } from 'vue'
import { NodeResizer } from '@vue-flow/node-resizer'
import common from '@/lib/common';
import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
} from '@/components/ui/number-field'

const props = defineProps(['data'])

const data = reactive({
    name: props.data.name,
    amount: 1,
    until: 1,
})

</script>

<template>
    <div class="custom-node">
        <Handle type="source" :position="Position.Top" />
        <!-- <NodeResizer class="rounded-lg" color="transparent" :min-width="common.node.minWidth"
            :min-height="common.node.minHeight" /> -->
        <div class="flex items-center gap-x-2 bg-gray-100 p-1.5">
            <div class="p-2 rounded bg-[#3753d1]">
                <Braces :size="common.iconSize" color="white" />
            </div> <span class="text-[#3753d1] font-semibold text-sm">Feature Condition</span>
        </div>

        <div class="flex flex-col gap-y-2 p-2">

            <div class="flex flex-col gap-2 p-2 items-start">
                <div class="flex items-center gap-x-2">
                    <span class="text-gray-600">Charge</span>
                    <NumberField class="w-[200px] max-w-max nodrag" v-model="data.amount" id="balance" :step="0.001"
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
