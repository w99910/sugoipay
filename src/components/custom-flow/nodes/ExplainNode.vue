<script lang="ts" setup>
import common from '@/lib/common';
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import { Text } from 'lucide-vue-next';
import { onMounted, reactive, watch } from 'vue'
// import Collisp
const props = defineProps(['data', 'id'])

const data = reactive({
    plan: props.data.options?.plan ?? null as null | { [key: string]: any },
    addon: props.data.options?.addon ?? null as null | { [key: string]: any },
    explanation: props.data.options?.explanation ?? ''
})
const generatePlanExplanation = () => {
    if (!data.plan) return;
    let t = `This is a ${data.plan.options?.type} plan with a base price of $${data.plan.options?.basePrice} `;

    if (data.plan.options.type === 'recurring') {
        t += `billed every ${data.plan.options?.intervalAmount} ${data.plan.options?.interval}` + (data.plan.options?.trialCount ? ` and includes a trial period of ${data.plan.options?.trialCount} ${data.plan.options?.trialInterval}(s)` : '');
    }

    t += '.'

    return t;
}

const generateAddonExplanation = () => {
    return `This is a ${data.addon!.options?.type} addon with a base price of $${data.addon!.options?.basePrice} billed every ${data.addon!.options?.intervalAmount} ${data.addon!.options?.interval}.`;
}


onMounted(() => {
    const vueFlow = useVueFlow();

    const node = vueFlow.findNode(props.id);

    if (node) {
        vueFlow.updateNodeData(props.id, {
            options: data
        })
        let watchChangeTl: null | number = null;
        const { pause, resume } = watch(() => node.data, (newData) => {
            if (watchChangeTl) clearTimeout(watchChangeTl)

            watchChangeTl = setTimeout(() => {
                resume();
            }, 300)
            data.explanation = ''
            pause();
            if (newData.plan) {
                data.plan = newData.plan;
                data.addon = null;
                data.explanation = generatePlanExplanation();
            } else {
                data.addon = newData.addon;
                data.plan = null;
                data.explanation = generateAddonExplanation();
            }
        }, { deep: true })
    }
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
        <div v-show="data.explanation" class="w-[250px] p-4 text-left">
            {{ data.explanation }}
        </div>
        <Handle type="target" :position="Position.Bottom" />
    </div>
</template>

<style></style>
