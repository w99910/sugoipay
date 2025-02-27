<script lang="ts" setup>
import { Handle, Position, } from '@vue-flow/core'
import { CircleDivide } from 'lucide-vue-next';
import { reactive, ref } from 'vue'
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

const props = defineProps(['data'])

const data = reactive({
    name: props.data.name,
    divideBy: 1,
    round: 'up'
})

</script>

<template>
    <div class="custom-node">
        <Handle type="source" :position="Position.Top" />
        <!-- <NodeResizer class="rounded-lg" color="transparent" :min-width="common.node.minWidth"
            :min-height="common.node.minHeight" /> -->
        <div class="flex items-center gap-x-2 bg-gray-100 p-1.5">
            <div class="p-2 rounded bg-[#3753d1]">
                <CircleDivide :size="common.iconSize" color="white" />
            </div> <span class="text-[#3753d1] font-semibold text-sm">Adjust Amount</span>
        </div>

        <div class="flex flex-col p-2">

            <div class="flex flex-col gap-y-4 p-2 items-start">
                <div class="flex items-center gap-x-2">
                    <span class="text-gray-600">Divide by </span>
                    <NumberField class="nodrag w-[200px] max-w-max" v-model="data.divideBy" id="divisor"
                        :default-value="10" :min="1">
                        <NumberFieldContent>
                            <NumberFieldDecrement />
                            <NumberFieldInput />
                            <NumberFieldIncrement />
                        </NumberFieldContent>
                    </NumberField>
                </div>

                <div class="flex items-center gap-x-2">
                    <span class="text-gray-600">and round </span>
                    <Select class="p-1 outline-none !focus:ring-0 !focus:outline-none" v-model="data.round">
                        <SelectTrigger class="w-[180px]">
                            <SelectValue placeholder="Select interval" />
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
