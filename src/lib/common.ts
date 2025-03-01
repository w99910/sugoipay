import { type GraphNode, type VueFlowStore } from "@vue-flow/core";
import { h, reactive, watch } from "vue";

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

        data: { name: "Product A", label: h("div", "Product A") },
        position: { x: 250, y: 5 },
      },
      {
        id: "2",
        type: "plan",
        label: "2",
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
        position: { x: 0, y: 900 },
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
        position: { x: -150, y: 800 },
      },
      {
        id: "7",
        type: "featureCondition",
        position: { x: -320, y: 350 },
      },
      {
        id: "8",
        type: "chargeSpecificAmountAtEachCondition",
        position: { x: -320, y: 0 },
      },
      {
        id: "9",
        type: "letCustomerSelectQuantity",
        position: { x: 500, y: 600 },
      },
      {
        id: "10",
        type: "explain",
        position: { x: -100, y: -100 },
      },
      {
        id: "11",
        type: "adjustAmount",
        position: { x: 0, y: 550 },
      },
      {
        id: "12",
        type: "featureCondition",
        data: { amount: 12 },
        position: { x: -320, y: 100 },
      },
    ],
    edges: [
      // { id: "2-1", target: "1", source: "2" },
      // { id: "3-1", target: "1", source: "3" },
      // { id: "4-11", target: "11", source: "4" },
      { id: "4-6", target: "6", source: "4" },
      // { id: "11-2", target: "2", source: "11" },
      { id: "6-11", target: "11", source: "6" },
      // { id: "5-3", target: "3", source: "5" },
      { id: "7-12", target: "12", source: "7" },
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
