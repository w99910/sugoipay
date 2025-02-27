import type { GraphNode } from "@vue-flow/core";
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
        position: { x: 450, y: 100 },
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
        position: { x: 450, y: 350 },
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
    ],
    edges: [
      { id: "2-1", target: "1", source: "2" },
      { id: "3-1", target: "1", source: "3" },
      { id: "4-2", target: "2", source: "4" },
      { id: "5-3", target: "3", source: "5" },
    ],
  }),
  canConnect: function (source: GraphNode, target: GraphNode) {
    return this.connectable[source.type].to?.includes(target.type);
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
    },
    featureCondition: {
      to: [
        "setMeteredFeature",
        "plan",
        "addon",
        "chargeSpecificAmountAtEachCondition",
      ],
      from: [
        "feature",
        "featureCondition",
        "setMeteredFeature",
        "chargeSpecificAmountAtEachCondition",
      ],
    },
    chargeSpecificAmountAtEachCondition: {
      to: ["setMeteredFeature", "plan", "addon", "featureCondition"],
      from: ["feature", "featureCondition", "setMeteredFeature"],
    },
    explain: {
      to: null,
      from: ["plan", "addon"],
    },
    adjustAmount: {
      to: ["plan", "addon", "letCustomerSelectQuantity"],
      from: ["feature", "letCustomerSelectQuantity"],
    },
    letCustomerSelectQuantity: {
      to: ["setMeteredFeature", "plan", "addon", "adjustAmount"],
      from: ["feature", "setMeteredFeature", "adjustAmount"],
    },
  } as any,
};
