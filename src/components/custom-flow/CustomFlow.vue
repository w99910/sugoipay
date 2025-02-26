<script setup lang="ts">
import { ref, markRaw } from 'vue'

import useDragAndDrop from '@/useDnD'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { VueFlow, useVueFlow, Panel, ConnectionMode, type Connection } from '@vue-flow/core'
import ProductNode from '@/components/custom-flow/nodes/ProductNode.vue'
import PlanNode from '@/components/custom-flow/nodes/PlanNode.vue'
import FeatureNode from '@/components/custom-flow/nodes/FeatureNode.vue'
import AddonNode from '@/components/custom-flow/nodes/AddonNode.vue'
import SetMeteredFeature from './nodes/SetMeteredFeature.vue'
import DropzoneBackground from '@/components/custom-flow/DropzoneBackground.vue'
import FeatureCondition from './nodes/FeatureCondition.vue'
import common from '@/lib/common'

const { onDragOver, onDragLeave, isDragOver } = useDragAndDrop()

const { onConnect, addEdges, onNodeDragStop, findEdge, findNode } = useVueFlow()


const nodeTypes = {
    product: markRaw(ProductNode),
    plan: markRaw(PlanNode),
    addon: markRaw(AddonNode),
    feature: markRaw(FeatureNode),
    setMeteredFeature: markRaw(SetMeteredFeature),
    featureCondition: markRaw(FeatureCondition)
} as any


onConnect((connection: Connection) => {
    const sourceNode = findNode(connection.source);
    const targetNode = findNode(connection.target);

    if (!sourceNode || !targetNode) {
        return;
    }

    if (!common.canConnect(sourceNode, targetNode)) {
        return;
    }
    addEdges(connection)
})


onNodeDragStop((drag) => {
    const node = drag.node;

    // make sure that node doesn't have any connection
    for (let edge of common.data.edges) {
        if (edge.source === node.id || edge.target === node.id) {
            return;
        }
    }

    // Assume 'a' is defined and a.event.target is the div you want to test.
    const div = document.querySelector('.vue-flow__nodes')?.querySelector(`[data-id="${drag.node.id}"]`) as HTMLDivElement;
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

    const rect = div.getBoundingClientRect();

    // Check whether the given div intersects the SVG path by sampling its area.
    function isDivIntersectingPath(
        path: SVGGeometryElement,
        svg: SVGSVGElement,
        samples: number = 10
    ): boolean {

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
    function check(svg: SVGSVGElement): boolean {
        const pathEl = svg.querySelector('path.vue-flow__edge-interaction') as SVGGeometryElement | null;
        if (!pathEl) return false;
        return isDivIntersectingPath(pathEl, svg, 20);
    }

    // Query for all elements with class '.vue-flow__edges', and filter for SVG elements.
    const svgElements = document.querySelectorAll('svg.vue-flow__edges');

    // Only check SVGs whose bounding rects are near the div.
    for (let svg of svgElements) {
        if (!(svg instanceof SVGSVGElement)) {
            continue;
        }

        const svgRect = svg.getBoundingClientRect();
        if (rectsIntersect(divRect, svgRect, margin)) {
            if (check(svg)) {
                const g = svg.querySelector('g');
                if (!g) {
                    continue;
                }
                const edgeId = g.getAttribute('data-id');
                const edge = findEdge(edgeId);

                if (!edge) {
                    continue;
                }

                const sourceNode = findNode(edge.source);
                const targetNode = findNode(edge.target)

                if (!sourceNode || !targetNode) {
                    continue;
                }

                if (!common.canConnect(sourceNode, drag.node)) {
                    continue;
                }

                common.data.edges.push({
                    id: sourceNode.id + '-' + drag.node.id,
                    source: sourceNode.id,
                    target: drag.node.id,
                })

                common.data.edges.push({
                    id: drag.node.id + '-' + targetNode.id,
                    source: drag.node.id,
                    target: targetNode.id,
                })

                // remove current edge
                common.data.edges = common.data.edges.filter(({ id }) => id !== (sourceNode.id + '-' + targetNode.id));

                break;
            }
        }
    }
})
</script>

<template>
    <VueFlow :connection-mode="ConnectionMode.Strict" :nodeTypes="nodeTypes" :nodes="common.data.nodes"
        :edges="common.data.edges" @dragover="onDragOver" @dragleave="onDragLeave" fit-view-on-init :default-zoom="1.5"
        :min-zoom="0.2" :max-zoom="4">
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
