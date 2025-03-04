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
    nodes: [],
    edges: [],
  }),
};
