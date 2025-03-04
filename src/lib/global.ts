import type { GraphEdge, GraphNode } from "@vue-flow/core";
import { reactive, type Ref, ref } from "vue";
export const data = reactive({
  errors: {} as { [key: string]: string | null },
  openCommandDialog: false,
  recent: ["feature", "featureCondition", "plan"],
  copiedNodes: [] as GraphNode[],
  copiedEdges: [] as GraphEdge[],
  openInfoDialog: false,
});

export const mouseEvent: Ref<MouseEvent | PointerEvent | null> = ref(null);

export const config = {
  connections: {
    price: {
      connectable: [
        "feature",
        "setMeteredFeature",
        "featureCondition",
        "adjustAmount",
        "chargeSpecificAmountAtEachCondition",
        "letCustomerSelectQuantity",
        "limitRequests",
      ],
      children: ["feature"],
      appliable: true,
      allowMultipleConnections: true,
    },
    product: {
      connectable: ["plan", "addon"],
      children: ["plan", "addon"],
      appliable: true,
      allowMultipleConnections: true,
    },
    explain: {
      connectable: ["plan", "addon"],
      appliable: true,
    },
    plan: {
      connectable: [
        "feature",
        "setMeteredFeature",
        "featureCondition",
        "adjustAmount",
        "chargeSpecificAmountAtEachCondition",
        "letCustomerSelectQuantity",
        "limitRequests",
      ],
      children: ["feature"],
      appliable: true,
      allowMultipleConnections: true,
      validate: function (node: GraphNode) {
        const whiteListAttributes = [
          "name",
          "type",
          "description",
          "references",
          "options",
        ];
        console.log("validate", node.data.options.type, Object.keys(node.data));

        data.errors[node.id] = null;
        if (node.data.feature) {
          for (const featureId of Object.keys(node.data.feature)) {
            const feature = node.data.feature[featureId];
            console.log(feature);
            if (
              node.data.options.type === "one-time" &&
              feature.setMeteredFeature
            ) {
              data.errors[node.id] =
                "Metered feature is not allowed for one-time plan";
              data.errors[featureId] =
                "Metered feature is not allowed for one-time plan";
            } else {
              data.errors[featureId] = null;
            }
          }
        }

        return true;
      },
    },
    addon: {
      connectable: [
        "feature",
        "setMeteredFeature",
        "featureCondition",
        "adjustAmount",
        "chargeSpecificAmountAtEachCondition",
        "letCustomerSelectQuantity",
        "limitRequests",
      ],
      children: ["feature"],
      appliable: true,
      allowMultipleConnections: true,
    },
    feature: {
      connectable: [
        "setMeteredFeature",
        "plan",
        "addon",
        "featureCondition",
        "adjustAmount",
        "chargeSpecificAmountAtEachCondition",
        "letCustomerSelectQuantity",
        "limitRequests",
      ],
      allowMultipleConnections: true,
      appliable: true,
      children: ["featureCondition"],
      validate: function (node: GraphNode) {
        const whiteListAttributes = [
          "name",
          "type",
          "description",
          "references",
          "options",
          "limitRequests",
          "letCustomerSelectQuantity",
        ];
        if (
          node.data.options.type === "ability" &&
          Object.keys(node.data).some(
            (key) => !whiteListAttributes.includes(key)
          )
        ) {
          data.errors[node.id] = "Feature should be usage";
        } else {
          data.errors[node.id] = null;
        }

        return true;
      },
    },
    setMeteredFeature: {
      connectable: [
        "featureCondition",
        "plan",
        "addon",
        "feature",
        "chargeSpecificAmountAtEachCondition",
        "adjustAmount",
        "letCustomerSelectQuantity",
        "limitRequests",
      ],
    },
    featureCondition: {
      connectable: [
        "feature",
        "plan",
        "addon",
        "featureCondition",
        "setMeteredFeature",
        "chargeSpecificAmountAtEachCondition",
        "limitRequests",
      ],
    },
    chargeSpecificAmountAtEachCondition: {
      connectable: [
        "setMeteredFeature",
        "plan",
        "addon",
        "featureCondition",
        "feature",
        "limitRequests",
      ],
    },
    adjustAmount: {
      connectable: [
        "plan",
        "addon",
        "letCustomerSelectQuantity",
        "setMeteredFeature",
        "feature",
        "limitRequests",
      ],
    },
    letCustomerSelectQuantity: {
      connectable: [
        "setMeteredFeature",
        "plan",
        "addon",
        "adjustAmount",
        "feature",
        "limitRequests",
      ],
    },
    limitRequests: {
      connectable: [
        "setMeteredFeature",
        "plan",
        "addon",
        "adjustAmount",
        "feature",
        "featureCondition",
        "chargeSpecificAmountAtEachCondition",
      ],
    },
  } as any,
};
