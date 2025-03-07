<script lang="ts" setup>
import common from '@/lib/common';
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import { Text } from 'lucide-vue-next';
import { computed, onMounted, reactive, watch } from 'vue'
// import Collisp
const props = defineProps(['data', 'id'])

const data = reactive({
    plan: props.data.options?.plan ?? null as null | { [key: string]: any },
    addon: props.data.options?.addon ?? null as null | { [key: string]: any },
    explanation: props.data.options?.explanation ?? ''
})

const { findNode } = useVueFlow();

const handleFeature = (feature: { [key: string]: any }) => {
    return '';
}

const generatePlanExplanation = (plan: { [key: string]: any }) => {
    let t = `This is a ${plan.options?.type} plan with a base price of $${plan.options?.basePrice} `;

    if (plan.options.type === 'recurring') {
        t += `billed every ${plan.options?.intervalAmount} ${plan.options?.interval}` + (plan.options?.trialCount ? ` and includes a trial period of ${plan.options?.trialCount} ${plan.options?.trialInterval}(s)` : '');
    }

    t += '.';

    if (plan.feature) {
        for (const featureId of Object.keys(plan.feature)) {
            const feature = plan.feature[featureId];

            console.log(feature);
        }
    }


    return t;
}

const generateAddonExplanation = (addon: { [key: string]: any }) => {
    let t = `This is a ${addon!.options?.type} addon with a base price of $${addon!.options?.basePrice} billed every ${addon!.options?.intervalAmount} ${addon!.options?.interval}.`;

    for (const featureId of Object.keys(addon!.feature)) {
        const feature = data.plan.feature[featureId];

        console.log(feature);
    }

    return t;
}

const node = findNode(props.id);


onMounted(() => {


    // if (node) {
    //     vueFlow.updateNodeData(props.id, {
    //         options: data
    //     })
    //     let watchChangeTl: null | number = null;
    //     const { pause, resume } = watch(() => node.data, (newData) => {
    //         console.log(newData)
    //         // if (watchChangeTl) clearTimeout(watchChangeTl)

    //         // watchChangeTl = setTimeout(() => {
    //         //     resume();
    //         // }, 300)
    //         // data.explanation = ''
    //         // pause();
    //         // if (newData.plan) {
    //         //     data.plan = newData.plan;
    //         //     addon = null;
    //         //     data.explanation = generatePlanExplanation();
    //         // } else {
    //         //     addon = newaddon;
    //         //     data.plan = null;
    //         //     data.explanation = generateAddonExplanation();
    //         // }
    //     }, { deep: true })
    // }
})

const description = computed(() => {
    if (!node) return '';

    if (node.data.plan) return generatePlanExplanation(node.data.plan);

    if (node.data.addon) return generateAddonExplanation(node.data.addon);
})

console.log('mounted explain node')


</script>

<template>
    <div class="custom-node">
        <!-- <span>{{ id }}</span> -->
        <div class="flex items-center gap-x-2 bg-indigo-500 p-1.5">
            <div class="p-2 rounded bg-indigo-400">
                <Text :size="common.iconSize" color="white" />
            </div> <span class="text-white font-semibold text-sm pr-2">Explain</span>
        </div>
        <div class="w-[400px] p-4 text-left">
            {{ description }}
        </div>
        <Handle type="target" :position="Position.Bottom" />
    </div>
</template>

<style></style>
