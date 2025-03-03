<script setup lang="ts">
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command'
import { config, data, mouseEvent } from '@/lib/global'
import { useVueFlow, type GraphNode } from '@vue-flow/core'

import { useMagicKeys } from '@vueuse/core'
import { ref, watch, onMounted } from 'vue'

function computeCenter(nodesToCopy: GraphNode[]) {
    if (!nodesToCopy.length) return { x: 0, y: 0 };

    let sumX = 0;
    let sumY = 0;
    nodesToCopy.forEach((node) => {
        sumX += node.position.x;
        sumY += node.position.y;
    });
    return {
        x: sumX / nodesToCopy.length,
        y: sumY / nodesToCopy.length,
    };
}


const { Meta_J, Ctrl_J, Meta_V, Ctrl_V, Meta_C, Ctrl_C } = useMagicKeys({
    passive: false,
    onEventFired(e) {
        if (e.key === 'j' && (e.metaKey || e.ctrlKey))
            e.preventDefault()

        if (e.key === 'v' && (e.metaKey || e.ctrlKey))
            e.preventDefault()

        if (e.key === 'c' && (e.metaKey || e.ctrlKey))
            e.preventDefault()
    },
})

const { onPaneClick, project, addNodes, addEdges, nodes, onPaneMouseMove, getSelectedEdges, getSelectedNodes } = useVueFlow();


watch([Meta_J, Ctrl_J], (v) => {
    if (v[0] || v[1])
        handleOpenChange()
})

watch([Meta_C, Ctrl_C], (v) => {
    if (getSelectedNodes.value.length > 0 && (v[0] || v[1])) {
        data.copiedNodes = getSelectedNodes.value;
        data.copiedEdges = getSelectedEdges.value;

        console.log(data.copiedEdges)
    }
})

watch([Meta_V, Ctrl_V], (v) => {
    if (data.copiedNodes && (v[0] || v[1])) {
        const center = computeCenter(data.copiedNodes)
        const mousePos = project({
            x: mouseEvent.value?.offsetX ?? 0,
            y: mouseEvent.value?.offsetY ?? 0,
        });

        const offsetX = mousePos.x - center.x;
        const offsetY = mousePos.y - center.y;
        for (const node of data.copiedNodes) {
            const position = project({
                x: node.position.x + offsetX,
                y: node.position.y + offsetY,
            })

            const newNodeId = (nodes.value.length + 1).toString();
            addNodes({
                id: newNodeId,
                position: position,
                data: { ...node.data },
                type: node.type,
            })

            const edges = data.copiedEdges.filter((edge) => edge.source === node.id || edge.target === node.id);

            for (const edge of edges) {
                if (edge.source === node.id) {
                    addEdges({
                        id: newNodeId + '-' + edge.target,
                        source: newNodeId,
                        target: edge.target
                    })
                    continue;
                }

                addEdges({
                    id: edge.source + '-' + newNodeId,
                    source: edge.source,
                    target: newNodeId
                })
            }

        }

        // data.copiedEdges = [];
        // data.copiedNodes = [];
    }
})



function handleOpenChange() {
    data.openCommandDialog = !data.openCommandDialog
}

let event: MouseEvent | PointerEvent | null = null;

function select(e: any) {
    const position = project({
        x: event?.offsetX ?? e.detail.originalEvent.offsetX ?? 0,
        y: event?.offsetY ?? e.detail.originalEvent.offsetY ?? 0,
    })
    console.log(event, position)
    addNodes({
        id: (nodes.value.length + 1).toString(),
        position: position,
        type: e.detail.value,
    })

    data.openCommandDialog = false;

}

onMounted(() => {
    let timeout: number | null = null;
    let clickCount = 0;

    watch(() => data.openCommandDialog, (v) => {
        if (!v) event = null;
    })

    onPaneClick((e) => {
        clickCount += 1;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            clickCount = 0;
        }, 400)

        if (clickCount === 2) {
            event = e;
            if (data.selectedNodes.length === 0) {
                data.openCommandDialog = true;
            }
            clickCount = 0;
        }

    })

    onPaneMouseMove((e) => {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => {
            mouseEvent.value = e;
        }, 100)
    })
})
</script>

<template>
    <CommandDialog v-model:open="data.openCommandDialog">
        <CommandInput placeholder="Search node name..." />
        <CommandList class="overflow-hidden">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Recent Nodes">
                <CommandItem @select="select" class="capitalize" v-for="recent in data.recent" :value="recent">
                    {{ recent }}
                </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="All Nodes">
                <CommandItem @select="select" class="capitalize" :value="node"
                    v-for="node in Object.keys(config.connections)">
                    {{ node }}
                </CommandItem>
            </CommandGroup>
        </CommandList>
    </CommandDialog>
</template>