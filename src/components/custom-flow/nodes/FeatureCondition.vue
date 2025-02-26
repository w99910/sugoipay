<script lang="ts" setup>
import { Handle, Position, } from '@vue-flow/core'
import { Braces, ChevronDown } from 'lucide-vue-next';
import { reactive, ref } from 'vue'
import { NodeResizer } from '@vue-flow/node-resizer'
import common from '@/lib/common';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

// import Collisp
const props = defineProps(['data'])

const data = reactive({
    name: props.data.name,
})

</script>

<template>
    <div class="custom-node">
        <Handle type="source" :position="Position.Top" />
        <NodeResizer class="rounded-lg" color="transparent" :min-width="common.node.minWidth"
            :min-height="common.node.minHeight" />
        <div class="flex items-center gap-x-2 bg-gray-100 p-1.5">
            <div class="p-2 rounded bg-[#3753d1]">
                <Braces :size="common.iconSize" color="white" />
            </div> <span class="text-[#3753d1] font-semibold text-sm">Feature Condition</span>
        </div>

        <div class="flex flex-col gap-y-2 p-2">

            <Collapsible defaultOpen
                class="group/collapsible text-sm text-gray-500 p-2 border rounded flex items-start flex-col">
                <CollapsibleTrigger class="flex  justify-between items-center w-full">
                    Billing Cycle
                    <ChevronDown :size="common.iconSize"
                        class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent class="mt-2">
                    <div>
                        Hello world
                    </div>
                </CollapsibleContent>
            </Collapsible>
            <Collapsible class="group/collapsible text-sm text-gray-500 p-2 border rounded flex items-start flex-col">
                <CollapsibleTrigger class="flex  justify-between items-center w-full">
                    Pricing
                    <ChevronDown :size="common.iconSize"
                        class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
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
