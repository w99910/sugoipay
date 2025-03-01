<script setup lang="ts">
import { markRaw, onMounted, watch } from 'vue'
import useDragAndDrop from '@/useDnD'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { VueFlow, useVueFlow, Panel, ConnectionMode, type Connection, useNodesData, type NodeChange, type ConnectionLineType } from '@vue-flow/core'
import ProductNode from '@/components/custom-flow/nodes/ProductNode.vue'
import PlanNode from '@/components/custom-flow/nodes/PlanNode.vue'
import FeatureNode from '@/components/custom-flow/nodes/FeatureNode.vue'
import AddonNode from '@/components/custom-flow/nodes/AddonNode.vue'
import SetMeteredFeature from './nodes/SetMeteredFeature.vue'
import DropzoneBackground from '@/components/custom-flow/DropzoneBackground.vue'
import FeatureCondition from './nodes/FeatureCondition.vue'
import common from '@/lib/common'
import ConfirmationDialog from '../ui/alert-dialog/ConfirmationDialog.vue'
import ChargeSpecificAmountAtEachCondition from './nodes/ChargeSpecificAmountAtEachCondition.vue'
import ExplainNode from './nodes/ExplainNode.vue'
import AdjustAmount from './nodes/AdjustAmount.vue'
import LetCustomerSelectQuantity from './nodes/LetCustomerSelectQuantity.vue'
import { toast } from 'vue-sonner'
import Tree from '@/lib/tree'
const { onDragOver, onDragLeave, isDragOver } = useDragAndDrop()

const vueFlow = useVueFlow();
const { onConnect, addEdges, onNodeDragStop, findEdge, findNode, onNodesChange, applyNodeChanges, onEdgesChange, applyEdgeChanges, } = vueFlow;

let tree: Tree;
onNodesChange(async (changes: any) => {
    const nextChanges = []

    for (const change of changes) {
        // console.log(change.type)
        if (change.type === 'remove') {
            const isConfirmed = await common.confirm();
            if (isConfirmed) {
                nextChanges.push(change)
            }
        } else {
            nextChanges.push(change)
        }
    }

    applyNodeChanges(nextChanges)
})

onEdgesChange(async (changes: any) => {

    const nextChanges = [];
    for (const change of changes) {
        if (change.type === 'add') {
            // console.log(tree, change.item.target, change.item.source)
            const result = tree.addEdge(change.item.target, change.item.source)
            if (!result) continue;
        }

        if (change.type === 'remove') {
            // console.log(change.target, change.source)
            const result = tree.removeEdge(change.target, change.source);
            if (!result) continue
        }

        nextChanges.push(change)
    }
    applyEdgeChanges(nextChanges)
})


const nodeTypes = {
    product: markRaw(ProductNode),
    plan: markRaw(PlanNode),
    addon: markRaw(AddonNode),
    feature: markRaw(FeatureNode),
    setMeteredFeature: markRaw(SetMeteredFeature),
    featureCondition: markRaw(FeatureCondition),
    chargeSpecificAmountAtEachCondition: markRaw(ChargeSpecificAmountAtEachCondition),
    explain: markRaw(ExplainNode),
    adjustAmount: markRaw(AdjustAmount),
    letCustomerSelectQuantity: markRaw(LetCustomerSelectQuantity)
} as any

const _onConnect = (connection: Connection) => {
    const sourceNode = findNode(connection.source);
    const targetNode = findNode(connection.target);
    if (!sourceNode || !targetNode) {
        return;
    }

    if (!common.canConnect(sourceNode, targetNode)) {
        toast.warning('Node is not allowed to connect.')
        return;
    }

    // common.applyEffect(vueFlow, targetNode, sourceNode);

    // if source node is parent node,
    addEdges(connection)
}
onConnect(_onConnect)

onNodeDragStop((drag) => {
    const node = drag.node;

    // make sure that node doesn't have any connection
    for (let edge of vueFlow.edges.value) {
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

                console.log(sourceNode, targetNode)
                if (!sourceNode || !targetNode) {
                    continue;
                }

                if (!common.canConnect(sourceNode, drag.node)) {
                    toast.warning('Node is not allowed to connect.')
                    continue;
                }

                if (!common.canConnect(drag.node, targetNode)) {
                    toast.warning('Node is not allowed to connect.')
                    continue;
                }

                const result = tree.addEdgeBetween(drag.node.id, targetNode.id, sourceNode.id)

                if (!result) return;

                tree.disable = true;

                vueFlow.removeEdges(vueFlow.edges.value.filter((edge) => edge.source === sourceNode.id && edge.target === targetNode.id))

                vueFlow.addEdges({
                    id: sourceNode.id + '-' + drag.node.id,
                    source: sourceNode.id,
                    target: drag.node.id
                })

                vueFlow.addEdges({
                    id: drag.node.id + '-' + targetNode.id,
                    source: drag.node.id,
                    target: targetNode.id,
                });

                tree.disable = false;

                break;
            }
        }
    }
})

onMounted(() => {
    tree = new Tree(vueFlow);

    tree.onApply((effectedNode, sourceNode) => {
        const _effectedNode = vueFlow.findNode(effectedNode);
        const _sourceNode = vueFlow.findNode(sourceNode);

        if (!_effectedNode || !_sourceNode) return;

        const parentNodeType = common.connectable[_effectedNode.type].parent;

        if (_effectedNode.type === parentNodeType) {

        }

        console.log('onapply', _effectedNode, _sourceNode)
    })

    tree.onRemove((effectedNode, sourceNode) => {
        // const _effectedNode = vueFlow.findNode(effectedNode);
        // const _sourceNode = vueFlow.findNode(sourceNode);
        // console.log('onremove', effectedNode, sourceNode, _effectedNode, _sourceNode)
    })

    tree.canConnect((...c) => {
        // console.log(c);
        return true;
    })
})

</script>

<template>
    <VueFlow :connection-radius="60" :apply-default="false" :connection-mode="ConnectionMode.Strict"
        :nodeTypes="nodeTypes" :nodes="common.data.nodes" :edges="common.data.edges" @dragover="onDragOver"
        @dragleave="onDragLeave" fit-view-on-init :default-zoom="1.5" :min-zoom="0.2" :max-zoom="4">
        <MiniMap />
        <Panel position="top-left" class="flex items-center gap-x-4">
            <slot name="panel-left"></slot>
        </Panel>
        <Panel position="top-right" class="flex items-center gap-x-4">
            <slot name="panel-right"></slot>

        </Panel>
        <Controls />
        <ConfirmationDialog />
        <DropzoneBackground :style="{
            backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
            transition: 'background-color 0.2s ease',
        }">
            <p v-if="isDragOver">Drop here</p>
        </DropzoneBackground>
    </VueFlow>
</template>
