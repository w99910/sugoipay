<script lang="ts" setup>
import { Handle, Position, useVueFlow, type Connection } from '@vue-flow/core'
import { Frame, ChevronRight } from 'lucide-vue-next';
import { onMounted, reactive, watch } from 'vue'
import { NodeResizer } from '@vue-flow/node-resizer'
import { config, data } from '@/lib/global';
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
const { updateNodeData, findNode } = useVueFlow();

// import Collisp
const props = defineProps(['data', 'id'])
const _data = reactive({
    name: props.data.options?.name,
    type: props.data.options?.billing_type ?? 'recurring',
    interval: props.data.options?.interval ?? 'month',
    intervalAmount: props.data.options?.intervalAmount ?? 1,
    basePrice: props.data.options?.basePrice ?? 0,
    trialCount: props.data.options?.trialCount,
    trialInterval: props.data.options?.trialInterval ?? 'day',
})

const node = findNode(props.id)


onMounted(() => {
    updateNodeData(props.id, {
        options: _data
    })


    if (node) {
        watch(_data, () => {
            config.connections.plan.validate(node)
        })

        watch(() => node, () => {
            console.log('change')
        })
    }


})

console.log('mounted plan node')

</script>

<template>
    <div class="custom-node" :class="{ '!border-red-500': data.errors[id] }">
        <div v-show="data.errors[id]"
            class="absolute z-[100] bg-red-500 text-sm px-2 py-1 rounded right-0 -top-2 transform -translate-y-full">{{
                data.errors[id] }}</div>
        <!-- <span>{{ id }}</span> -->
        <Handle type="source" :position="Position.Top" />
        <!-- <NodeResizer class="rounded-lg" color="transparent" :min-width="common.node.minWidth"
            :min-height="common.node.minHeight" /> -->
        <div class="flex items-center gap-x-2 bg-rose-500 p-1.5">
            <div class="p-2 rounded bg-rose-400">
                <Frame :size="common.iconSize" color="white" />
            </div> <input class="nodrag font-semibold text-white" type="text" placeholder="Enter plan name"
                v-model="_data.name" />
        </div>

        <div class="flex flex-col gap-y-2 p-2">

            <Collapsible defaultOpen class="group/collapsible">
                <CollapsibleTrigger class="flex dark:text-white text-black  justify-between items-center w-full">
                    Billing
                    <ChevronRight :size="16"
                        class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent class="mt-2 w-full border-t py-2">
                    <div class="w-full flex items-center gap-x-2 justify-between px-2">
                        <button @click="_data.type = 'one-time'"
                            :class="{ 'bg-gray-700 p-1.5 text-gray-100': _data.type === 'one-time' }"
                            class="rounded w-full py-1.5 border">One
                            Time</button>
                        <button @click="_data.type = 'recurring'"
                            :class="{ 'bg-gray-700 p-1.5  text-gray-100': _data.type === 'recurring' }"
                            class="rounded w-full py-1.5 border">Recurring</button>
                    </div>
                    <div class="w-full flex-col gap-y-3 flex gap-x-2 mt-4 px-2">
                        <div v-show="_data.type === 'recurring'" class="flex items-center space-x-2">
                            <label class="w-20  text-left">Interval </label>
                            <span class="px-2 mr-2">:</span>
                            <div class="flex items-center gap-x-2">
                                <NumberField class="max-w-[100px] nodrag " v-model="_data.intervalAmount"
                                    :default-value="10" :min="1">
                                    <NumberFieldContent>
                                        <NumberFieldDecrement />
                                        <NumberFieldInput class="label-input" />
                                        <NumberFieldIncrement />
                                    </NumberFieldContent>
                                </NumberField>
                                <Select class="p-1 outline-none !focus:ring-0 !focus:outline-none"
                                    v-model="_data.interval">
                                    <SelectTrigger class="w-[160px]">
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
                                <NumberField class=" nodrag" v-model="_data.basePrice" :step="0.1" :default-value="1"
                                    :format-options="{
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
                        <div v-show="_data.type === 'recurring'" class="flex items-center space-x-2 w-full">
                            <label class="w-20  text-left">Trial Days </label>
                            <span class="px-2 mr-2">:</span>
                            <div class="flex items-center gap-x-2">
                                <NumberField class="max-w-[100px] nodrag " v-model="_data.trialCount" :default-value="0"
                                    :min="0">
                                    <NumberFieldContent>
                                        <NumberFieldDecrement />
                                        <NumberFieldInput class="label-input" />
                                        <NumberFieldIncrement />
                                    </NumberFieldContent>
                                </NumberField>
                                <Select class="p-1 outline-none !focus:ring-0 !focus:outline-none"
                                    v-model="_data.trialInterval">
                                    <SelectTrigger class="w-[160px]">
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
                    </div>
                </CollapsibleContent>
            </Collapsible>
            <Collapsible class="group/collapsible text-sm text-gray-500 border rounded flex items-start flex-col">
                <CollapsibleTrigger class="flex justify-between dark:text-white text-black items-center w-full">
                    Features
                    <ChevronRight :size="16"
                        class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent class="gap-y-2 mt-2 w-full">
                    <div class="flex flex-col border-t items-start gap-y-1 py-2"
                        v-for="featureId in Object.keys(node?.data.feature)">
                        <h1 class="font-semibold">{{ node?.data.feature[featureId].options.name }}</h1>
                        <span class="text-xs">{{ node?.data.feature[featureId].options.description }}</span>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
        <Handle type="target" :position="Position.Bottom" />
    </div>
</template>

<style></style>
