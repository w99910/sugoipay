<script setup lang="ts">
import { ref, markRaw } from 'vue'

import useDragAndDrop from '@/useDnD'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { VueFlow, useVueFlow, Panel, ConnectionMode } from '@vue-flow/core'
import ProductNode from '@/components/custom-flow/nodes/ProductNode.vue'
import PlanNode from '@/components/custom-flow/nodes/PlanNode.vue'
import FeatureNode from '@/components/custom-flow/nodes/FeatureNode.vue'
import AddonNode from '@/components/custom-flow/nodes/AddonNode.vue'

import DropzoneBackground from '@/components/custom-flow/DropzoneBackground.vue'

const { onDragOver, onDragLeave, isDragOver } = useDragAndDrop()

const { onConnect, addEdges, onNodeDragStop } = useVueFlow()

const nodes = ref([
    {
        id: '1',
        type: 'product',
        data: { name: 'Product A' },
        position: { x: 250, y: 5 },
    },
    {
        id: '2',
        type: 'plan',
        data: { name: 'Plan A' },
        position: { x: 0, y: 100 },
    },
    {
        id: '3',
        type: 'addon',
        data: { name: 'Addon A' },
        position: { x: 450, y: 100 },
    },
    {
        id: '4',
        type: 'feature',
        data: { name: 'Feature A' },
        position: { x: 0, y: 300 },
    },
    {
        id: '5',
        type: 'feature',
        data: { name: 'Feature B' },
        position: { x: 450, y: 300 },
    },
])

const edges = ref([
    { id: 'e1-2', target: '1', source: '2' },
    { id: 'e1-3', target: '1', source: '3' },
    { id: 'e1-4', target: '2', source: '4' },
    { id: 'e1-5', target: '3', source: '5' },
])

const nodeTypes = {
    product: markRaw(ProductNode),
    plan: markRaw(PlanNode),
    addon: markRaw(AddonNode),
    feature: markRaw(FeatureNode)
}


onConnect(addEdges)


onNodeDragStop((a) => {
    // Assume 'a' is defined and a.event.target is the div you want to test.
    const div = a.event.target as HTMLDivElement;
    const divRect = div.getBoundingClientRect();
    const margin: number = 50; // Tolerance in pixels

    // Helper: Check if two DOMRect objects intersect (or are near each other)
    function rectsIntersect(r1: DOMRect, r2: DOMRect, margin: number = 0): boolean {
        return !(
            r2.left > r1.right + margin ||
            r2.right < r1.left - margin ||
            r2.top > r1.bottom + margin ||
            r2.bottom < r1.top - margin
        );
    }

    // Convert a point (x, y) from viewport to SVG coordinate system.
    function convertToSVGCoords(svg: SVGSVGElement, x: number, y: number): DOMPoint {
        const pt = svg.createSVGPoint();
        pt.x = x;
        pt.y = y;
        const ctm = svg.getScreenCTM();
        return ctm ? pt.matrixTransform(ctm.inverse()) : pt;
    }

    // Check whether the given div intersects the SVG path by sampling its area.
    function isDivIntersectingPath(
        div: HTMLDivElement,
        path: SVGGeometryElement,
        svg: SVGSVGElement,
        samples: number = 10
    ): boolean {
        const rect = div.getBoundingClientRect();
        for (let i = 0; i <= samples; i++) {
            for (let j = 0; j <= samples; j++) {
                const x = rect.left + (rect.width * i) / samples;
                const y = rect.top + (rect.height * j) / samples;
                const svgPt = convertToSVGCoords(svg, x, y);
                if (path.isPointInStroke(svgPt)) {
                    return true;
                }
            }
        }
        return false;
    }

    // For each SVG (which should be an SVGSVGElement), check for intersection if it's near the div.
    function check(svg: SVGSVGElement): void {
        const pathEl = svg.querySelector('path') as SVGGeometryElement | null;
        if (!pathEl) return;
        const intersecting = isDivIntersectingPath(div, pathEl, svg, 20);
        console.log("Does the div intersect the path? ", a.node, div, pathEl, intersecting);
    }

    // Query for all elements with class '.vue-flow__edges', and filter for SVG elements.
    const svgElements = Array.from(document.querySelectorAll('.vue-flow__edges'))
        .filter((el): el is SVGSVGElement => el instanceof SVGSVGElement);

    // Only check SVGs whose bounding rects are near the div.
    svgElements.forEach(svg => {
        const svgRect = svg.getBoundingClientRect();
        if (rectsIntersect(divRect, svgRect, margin)) {
            check(svg);
        }
    });
})
</script>

<template>
    <VueFlow :connection-mode="ConnectionMode.Strict" :nodeTypes="nodeTypes" :nodes="nodes" :edges="edges"
        @dragover="onDragOver" @dragleave="onDragLeave" fit-view-on-init :default-zoom="1.5" :min-zoom="0.2"
        :max-zoom="4">
        <MiniMap />
        <Panel position="top-left" class="flex items-center gap-x-4">
            <slot name="panel"></slot>
        </Panel>
        <Controls />
        <DropzoneBackground :style="{
            backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
            transition: 'background-color 0.2s ease',
        }">
            <p v-if="isDragOver">Drop here</p>
        </DropzoneBackground>
    </VueFlow>
</template>
