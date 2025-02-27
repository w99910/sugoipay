import { type GraphNode, type VueFlowStore } from "@vue-flow/core";
import { reactive, watch } from "vue";

export default {
  node: {
    minWidth: 260,
    minHeight: 45,
  },
  iconSize: 14,
  confirm: async function () {
    this.data.showConfirmation = true;

    return new Promise((resolve) => {
      const { stop } = watch(
        () => this.data.confirmationResult,
        (result) => {
          stop();
          this.data.showConfirmation = false;
          this.data.confirmationResult = null;
          resolve(result);
        }
      );
    });
  },
  data: reactive({
    confirmationResult: null as null | boolean,
    showConfirmation: false,
    nodes: [
      {
        id: "1",
        type: "product",
        data: { name: "Product A" },
        position: { x: 250, y: 5 },
      },
      {
        id: "2",
        type: "plan",
        data: { name: "Plan A" },
        position: { x: 0, y: 100 },
      },
      {
        id: "3",
        type: "addon",
        data: { name: "Addon A" },
        position: { x: 500, y: 100 },
      },
      {
        id: "4",
        type: "feature",
        data: { name: "Feature A" },
        position: { x: 0, y: 780 },
      },
      {
        id: "5",
        type: "feature",
        data: { name: "Feature B" },
        position: { x: 500, y: 350 },
      },
      {
        id: "6",
        type: "setMeteredFeature",
        data: { name: "Feature B" },
        position: { x: 200, y: 450 },
      },
      {
        id: "7",
        type: "featureCondition",
        position: { x: -320, y: 350 },
      },
      {
        id: "8",
        type: "chargeSpecificAmountAtEachCondition",
        position: { x: 650, y: 580 },
      },
      {
        id: "9",
        type: "letCustomerSelectQuantity",
        position: { x: 700, y: 500 },
      },
      {
        id: "10",
        type: "explain",
        position: { x: -100, y: -100 },
      },
      {
        id: "11",
        type: "adjustAmount",
        position: { x: 200, y: 550 },
      },
      {
        id: "12",
        type: "featureCondition",
        data: { amount: 12 },
        position: { x: -320, y: 100 },
      },
    ],
    edges: [
      { id: "2-1", target: "1", source: "2" },
      { id: "3-1", target: "1", source: "3" },
      { id: "4-2", target: "2", source: "4" },
      { id: "5-3", target: "3", source: "5" },
      { id: "7-12", target: "12", source: "7" },
    ],
  }),
  canConnect: function (source: GraphNode, target: GraphNode) {
    return this.connectable[source.type].to?.includes(target.type);
  },
  lookupAndApply: function (
    vueFlow: VueFlowStore,
    targetNode: GraphNode,
    sourceNode: GraphNode,
    shouldFindLinkedNodes = true
  ) {
    const multiple = this.connectable[sourceNode.type].multiple;

    let dataToUpdate: { [key: string]: any } = {};
    if (multiple.includes(targetNode.type)) {
      dataToUpdate[targetNode.type] = sourceNode.data[targetNode.type] ?? [];
      dataToUpdate[targetNode.type].push(targetNode.data.options);
    } else {
      dataToUpdate = {
        ...targetNode.data.options,
      };
    }
    // attach data of parent node
    vueFlow.updateNodeData(sourceNode.id, dataToUpdate);

    const parentNodes = targetNode.data.parentNodes ?? [];
    parentNodes.push(sourceNode.id);
    // add parent node id to target node
    vueFlow.updateNodeData(targetNode.id, {
      parentNodes,
    });

    // console.log("lookupAndApply", arguments);

    if (!shouldFindLinkedNodes) return;
    let edges = this.data.edges.filter((edge) => edge.source === targetNode.id);
    console.log(edges);
    for (let edge of edges) {
      const _targetNode = vueFlow.findNode(edge.target);
      if (!_targetNode || ["plan", "addon"].includes(_targetNode.type))
        continue;

      this.applyEffect(vueFlow, _targetNode, targetNode);
    }
  },
  applyEffect: function (
    vueFlow: VueFlowStore,
    targetNode: GraphNode,
    sourceNode: GraphNode,
    shouldFindLinkedNodes = true
  ) {
    if (["plan", "addon"].includes(targetNode.type)) {
      // console.log(getConnectedEdges(targetNode.id),)
      // console.log(getIncomers(targetNode.id, common.data.nodes, common.data.edges))
    }
    const targetConfig = this.connectable[targetNode.type];
    const sourceConfig = this.connectable[sourceNode.type];
    const targetNodeParentType = targetConfig.parent;
    const sourceNodeParentType = sourceConfig.parent;
    if (!targetNodeParentType) return;
    // if source node has same parent type as target node
    // update node data for every parent nodes of source node
    console.log({ targetNode, sourceNode });
    if (
      targetNodeParentType === sourceNodeParentType &&
      sourceNode.data.parentNodes
    ) {
      for (let parentNodeId of sourceNode.data.parentNodes) {
        const parentNode = vueFlow.findNode(parentNodeId);
        if (parentNode) {
          // attach data of parent node
          const multiple = this.connectable[parentNode.type].multiple;

          let dataToUpdate: { [key: string]: any } = {};
          if (multiple.includes(targetNode.type)) {
            dataToUpdate[targetNode.type] =
              parentNode.data[targetNode.type] ?? [];
            dataToUpdate[targetNode.type].push(targetNode.data.options);
          } else {
            dataToUpdate = {
              ...targetNode.data.options,
            };
          }

          vueFlow.updateNodeData(parentNode.id, dataToUpdate);

          const parentNodes = targetNode.data.parentNodes ?? [];

          parentNodes.push(parentNodeId);

          // add parent node id to target node
          vueFlow.updateNodeData(targetNode.id, {
            parentNodes,
          });
        }
      }
    }

    // if source node is parent of target node
    if (targetNodeParentType === sourceNode.type) {
      this.lookupAndApply(
        vueFlow,
        targetNode,
        sourceNode,
        shouldFindLinkedNodes
      );
    }
  },
  connectable: {
    product: {
      to: null,
      from: ["plan", "addon"],
    },
    plan: {
      to: ["product", "explain"],
      from: [
        "feature",
        "setMeteredFeature",
        "featureCondition",
        "adjustAmount",
        "chargeSpecificAmountAtEachCondition",
        "letCustomerSelectQuantity",
      ],
      parent: null,
      multiple: ["feature"],
    },
    addon: {
      to: ["product", "explain"],
      from: [
        "feature",
        "setMeteredFeature",
        "featureCondition",
        "adjustAmount",
        "chargeSpecificAmountAtEachCondition",
        "letCustomerSelectQuantity",
      ],
      parent: null,
    },
    feature: {
      to: [
        "setMeteredFeature",
        "plan",
        "addon",
        "featureCondition",
        "adjustAmount",
        "chargeSpecificAmountAtEachCondition",
        "letCustomerSelectQuantity",
      ],
      from: null,
      parent: null,
      multiple: ["featureCondition"],
    },
    setMeteredFeature: {
      to: [
        "featureCondition",
        "plan",
        "addon",
        "chargeSpecificAmountAtEachCondition",
        "adjustAmount",
        "letCustomerSelectQuantity",
      ],
      from: ["feature", "featureCondition"],
      parent: "feature",
    },
    featureCondition: {
      to: [
        "setMeteredFeature",
        "plan",
        "addon",
        "featureCondition",
        "chargeSpecificAmountAtEachCondition",
      ],
      from: [
        "feature",
        "featureCondition",
        "setMeteredFeature",
        "chargeSpecificAmountAtEachCondition",
      ],
      parent: "feature",
    },
    chargeSpecificAmountAtEachCondition: {
      to: ["setMeteredFeature", "plan", "addon", "featureCondition"],
      from: ["feature", "featureCondition", "setMeteredFeature"],
      source: "feature",
    },
    explain: {
      to: null,
      from: ["plan", "addon"],
      parent: null,
    },
    adjustAmount: {
      to: ["plan", "addon", "letCustomerSelectQuantity", "setMeteredFeature"],
      from: ["feature", "letCustomerSelectQuantity", "setMeteredFeature"],
      parent: "feature",
    },
    letCustomerSelectQuantity: {
      to: ["setMeteredFeature", "plan", "addon", "adjustAmount"],
      from: ["feature", "setMeteredFeature", "adjustAmount"],
      parent: "feature",
    },
  } as any,
};
