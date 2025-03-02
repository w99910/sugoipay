<script lang="ts" setup>
import common from '@/lib/common';
import { Handle, Position, useVueFlow, type Connection, type GraphEdge } from '@vue-flow/core'
import { CloudDownload } from 'lucide-vue-next';
import { onMounted, reactive } from 'vue'
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
// import Collisp
const props = defineProps(['data', 'id'])

const { updateNodeData } = useVueFlow();

const _data = reactive({
    limit: 60,
    interval: 'minute'
})


onMounted(() => {
    updateNodeData(props.id, {
        options: {
            isMeteredFeature: true,
        }
    })
})

</script>

<template>
    <div class="custom-node">
        <!-- <span>{{ id }}</span> -->
        <Handle type="source" :position="Position.Top" />
        <div class="flex items-center gap-x-2 bg-blue-600 p-1.5">
            <div class="p-2 rounded bg-blue-500">
                <CloudDownload :size="common.iconSize" color="white" />
            </div> <span class="text-white font-semibold text-sm pr-2">Limit Requests</span>
        </div>
        <div class="flex flex-col gap-y-2 p-2">

            <div class="flex flex-col gap-2 p-2 items-start">
                <div class="flex items-center gap-x-2">
                    <span class="label-text">Limit </span>
                    <NumberField class="w-[200px] max-w-max nodrag" v-model="_data.limit" :default-value="10" :min="1">
                        <NumberFieldContent>
                            <NumberFieldDecrement />
                            <NumberFieldInput class="label-input" />
                            <NumberFieldIncrement />
                        </NumberFieldContent>
                    </NumberField>
                </div>

                <span class="label-text">requests per </span>
                <Select class="p-1 outline-none !focus:ring-0 !focus:outline-none" v-model="_data.interval">
                    <SelectTrigger class="nodrag">
                        <SelectValue class="label-input" placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="minute">
                                Minute
                            </SelectItem>
                            <SelectItem value="hour">
                                Hour
                            </SelectItem>
                            <SelectItem value="day">
                                Day
                            </SelectItem>
                            <SelectItem value="week">
                                Week
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
        <Handle type="target" :position="Position.Bottom" />
    </div>
</template>

<style></style>
