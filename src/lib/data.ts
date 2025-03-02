export default {
  config: {
    connections: {
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
        ],
        children: ["feature"],
        appliable: true,
        allowMultipleConnections: true,
      },
      addon: {
        connectable: [
          "feature",
          "setMeteredFeature",
          "featureCondition",
          "adjustAmount",
          "chargeSpecificAmountAtEachCondition",
          "letCustomerSelectQuantity",
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
        ],
        appliable: true,
        children: ["featureCondition"],
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
        ],
      },
      chargeSpecificAmountAtEachCondition: {
        connectable: [
          "setMeteredFeature",
          "plan",
          "addon",
          "featureCondition",
          "feature",
        ],
      },
      adjustAmount: {
        connectable: [
          "plan",
          "addon",
          "letCustomerSelectQuantity",
          "setMeteredFeature",
          "feature",
        ],
      },
      letCustomerSelectQuantity: {
        connectable: [
          "setMeteredFeature",
          "plan",
          "addon",
          "adjustAmount",
          "feature",
        ],
      },
    } as any,
  },
};
