<script lang="ts" setup>
import { Handle, Position, useVueFlow, type Connection } from '@vue-flow/core'
import { Frame, ChevronRight } from 'lucide-vue-next';
import { onMounted, reactive, watch } from 'vue'
import { NodeResizer } from '@vue-flow/node-resizer'
import common from '@/lib/common';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
} from '@/components/ui/number-field'

// import Collisp
const props = defineProps(['data', 'id'])

const { updateNodeData } = useVueFlow();

const data = reactive({
    name: props.data.name,
    type: props.data.billing_type ?? 'recurring',
    interval: 'month',
    intervalAmount: 1,
    basePrice: 0,
})

onMounted(() => {
    updateNodeData(props.id, {
        options: data
    })
})

console.log('mounted plan node')

</script>

<template>
    <div class="custom-node">
        <!-- <span>{{ id }}</span> -->
        <Handle type="source" :position="Position.Top" />
        <!-- <NodeResizer class="rounded-lg" color="transparent" :min-width="common.node.minWidth"
            :min-height="common.node.minHeight" /> -->
        <div class="flex items-center gap-x-2 bg-[#34a0a4] p-1.5">
            <div class="p-2 rounded bg-[#47b7bb]">
                <Frame :size="common.iconSize" color="white" />
            </div> <input @focusin="data.isFocus = true" @focusout="data.isFocus = false"
                class="nodrag font-semibold text-white" type="text" placeholder="Enter plan name" v-model="data.name" />
        </div>

        <div class="flex flex-col gap-y-2 p-2">

            <Collapsible defaultOpen class="group/collapsible">
                <CollapsibleTrigger class="flex  justify-between items-center w-full">
                    Billing
                    <ChevronRight :size="16"
                        class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent class="mt-2 w-full border-t py-2">
                    <div class="w-full flex items-center gap-x-2 justify-between px-2">
                        <button @click="data.type = 'one-time'"
                            :class="{ 'bg-gray-700 p-1.5 text-gray-100': data.type === 'one-time' }"
                            class="rounded w-full py-1.5 border">One
                            Time</button>
                        <button @click="data.type = 'recurring'"
                            :class="{ 'bg-gray-700 p-1.5  text-gray-100': data.type === 'recurring' }"
                            class="rounded w-full py-1.5 border">Recurring</button>
                    </div>
                    <div class="w-full flex-col gap-y-3 flex gap-x-2 mt-4 px-2">
                        <div v-show="data.type === 'recurring'" class="flex items-center space-x-2">
                            <label class="w-20  text-left">Interval </label>
                            <span class="px-2 mr-2">:</span>
                            <div class="flex items-center gap-x-2">
                                <NumberField class="max-w-[100px] nodrag " v-model="data.intervalAmount"
                                    :default-value="10" :min="1">
                                    <NumberFieldContent>
                                        <NumberFieldDecrement />
                                        <NumberFieldInput class="label-input" />
                                        <NumberFieldIncrement />
                                    </NumberFieldContent>
                                </NumberField>
                                <Select class="p-1 outline-none !focus:ring-0 !focus:outline-none"
                                    v-model="data.interval">
                                    <SelectTrigger class="w-[180px]">
                                        <SelectValue class="label-input" placeholder="Select interval" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="day">
                                                Day
                                            </SelectItem>
                                            <SelectItem value="week">
                                                Week
                                            </SelectItem>
                                            <SelectItem value="month">
                                                Month
                                            </SelectItem>
                                            <SelectItem value="year">
                                                Year
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            <label class="w-20 text-left">Base Price </label>
                            <span class="px-2 mr-2">:</span>
                            <div class="flex">
                                <NumberField class="w-[200px] max-w-max nodrag" v-model="data.basePrice" :step="0.1"
                                    :default-value="1" :format-options="{
                                        style: 'currency',
                                        currency: 'USD',
                                        currencyDisplay: 'code',
                                        currencySign: 'accounting',
                                        maximumFractionDigits: 3
                                    }">
                                    <NumberFieldContent>
                                        <NumberFieldDecrement />
                                        <NumberFieldInput class="label-input" />
                                        <NumberFieldIncrement />
                                    </NumberFieldContent>
                                </NumberField>
                            </div>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
            <Collapsible class="group/collapsible text-sm text-gray-500 p-2 border rounded flex items-start flex-col">
                <CollapsibleTrigger class="flex  justify-between items-center w-full">
                    Features
                    <ChevronRight :size="16"
                        class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent class="mt-2">
                    <div>
                        Hello world
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
        <Handle type="target" :position="Position.Bottom" />
    </div>
</template>

<style></style>
