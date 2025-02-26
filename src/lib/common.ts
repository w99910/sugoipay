import type { GraphNode } from "@vue-flow/core";
import { reactive } from "vue";

export default {
    node:{
        minWidth: 240,
        minHeight: 30,
    },
    data: reactive({
        nodes: [
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
                position: { x: 0, y: 550 },
            },
            {
                id: '5',
                type: 'feature',
                data: { name: 'Feature B' },
                position: { x: 450, y: 300 },
            },
            {
                id: '6',
                type: 'setMeteredFeature',
                data: { name: 'Feature B' },
                position: { x: 200, y: 350 },
            },
            {
                id: '7',
                type: 'featureCondition',
                position: { x: -250, y: 300 },
            },
        ],
        edges: [{ id: '2-1', target: '1', source: '2' },
            { id: '3-1', target: '1', source: '3' },
            { id: '4-2', target: '2', source: '4' },
            { id: '5-3', target: '3', source: '5' },],
    }),
    canConnect: function(source: GraphNode, target: GraphNode){
        return this.connectable[source.type].to?.includes(target.type);
    },
    connectable:{
        product: {
            to: null,
            from: ['plan','addon']
        },
        plan: {
            to: ['product'],
            from: ['feature','setMeteredFeature','featureCondition']
        },
        addon: {
            to: ['product'],
            from: ['feature','setMeteredFeature','featureCondition']
        },
        feature: {
            to: ['setMeteredFeature','plan','addon','featureCondition'],
            from: null
        },
        setMeteredFeature:{
            to: ['featureCondition','plan','addon'],
            from: ['feature','featureCondition']
        },
        featureCondition:{
            to: ['setMeteredFeature','plan','addon'],
            from: ['feature','featureCondition','setMeteredFeature']
        },
    } as any
}