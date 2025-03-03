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
      // {
      //   id: "1",
      //   type: "product",
      //   data: { name: "Product A" },
      //   position: { x: 250, y: 5 },
      // },
      // {
      //   id: "2",
      //   type: "plan",
      //   label: "2",
      //   data: { name: "Plan A" },
      //   position: { x: 0, y: 100 },
      // },
      // {
      //   id: "3",
      //   type: "addon",
      //   data: { name: "Addon A" },
      //   position: { x: 500, y: 100 },
      // },
      // {
      //   id: "4",
      //   type: "feature",
      //   data: { name: "Feature A", type: "usage" },
      //   position: { x: 0, y: 900 },
      // },
      // {
      //   id: "5",
      //   type: "feature",
      //   data: { name: "Feature B", type: "usage" },
      //   position: { x: 500, y: 850 },
      // },
      // {
      //   id: "6",
      //   type: "setMeteredFeature",
      //   position: { x: -150, y: 800 },
      // },
      // {
      //   id: "7",
      //   type: "featureCondition",
      //   position: { x: -320, y: 350 },
      // },
      // {
      //   id: "8",
      //   type: "chargeSpecificAmountAtEachCondition",
      //   position: { x: -320, y: 0 },
      // },
      // {
      //   id: "9",
      //   type: "letCustomerSelectQuantity",
      //   position: { x: 500, y: 600 },
      // },
      // {
      //   id: "10",
      //   type: "explain",
      //   position: { x: -100, y: -100 },
      // },
      // {
      //   id: "11",
      //   type: "adjustAmount",
      //   position: { x: 0, y: 550 },
      // },
      // {
      //   id: "12",
      //   type: "featureCondition",
      //   data: { amount: 12 },
      //   position: { x: -320, y: 100 },
      // },
      // {
      //   id: "13",
      //   type: "limitRequests",
      //   data: { amount: 12 },
      //   position: { x: -320, y: 1000 },
      // },
    ],
    edges: [
      // { id: "4-6", target: "6", source: "4" },
      // { id: "11-2", target: "2", source: "11" },
      // { id: "6-11", target: "11", source: "6" },
      // { id: "5-2", target: "2", source: "5" },
      // { id: "7-12", target: "12", source: "7" },
    ],
  }),
};
