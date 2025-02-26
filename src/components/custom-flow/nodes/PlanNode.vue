<script lang="ts" setup>
import { Handle, Position, type Connection, useVueFlow } from '@vue-flow/core'
import { Frame, ChevronDown } from 'lucide-vue-next';
import { reactive, ref } from 'vue'
import { NodeResizer } from '@vue-flow/node-resizer'
import common from '@/lib/common';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu, SidebarMenuItem
} from "@/components/ui/sidebar"
// import Collisp
const props = defineProps(['data'])

const data = reactive({
    name: props.data.name
})

const { findNode } = useVueFlow();

function isValidConnection(connection: Connection) {
    const targetNode = findNode(connection.target);
    if (!targetNode) {
        return false;
    }
    return targetNode.type === 'product';
}
</script>

<template>
    <div class="custom-node">
        <Handle type="source" :position="Position.Top" :is-valid-connection="isValidConnection" />
        <NodeResizer class="rounded-lg" color="transparent" :min-width="common.node.minWidth"
            :min-height="common.node.minHeight" />
        <div class="flex items-center gap-x-2 bg-gray-100 p-2">
            <div class="p-2 rounded bg-[#34a0a4]">
                <Frame :size="16" color="white" />
            </div> <input class="nodrag text-[#34a0a4]" type="text" placeholder="Enter plan name" v-model="data.name" />
        </div>

        <div class="flex flex-col gap-y-2 p-2">

            <Collapsible defaultOpen
                class="group/collapsible text-sm text-gray-500 p-2 border rounded flex items-start flex-col">
                <CollapsibleTrigger class="flex  justify-between items-center w-full">
                    Billing Cycle
                    <ChevronDown class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
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
                    <ChevronDown class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent class="mt-2">
                    <div>
                        Hello world
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
        <Handle type="target" :position="Position.Bottom" :is-valid-connection="isValidConnection" />
    </div>
</template>

<style></style>
