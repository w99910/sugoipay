import {
  type GraphEdge,
  type GraphNode,
  type VueFlowStore,
} from "@vue-flow/core";
import { toast } from "vue-sonner";
export const key = "sugoipay-flow--save-restore";

export default {
  save: function (vueFlow: VueFlowStore) {
    localStorage.setItem(key, JSON.stringify(vueFlow.toObject()));

    if (toast) {
      toast.success("Successfully saved");
    }
  },
  exportAsJson: function (vueFlow: VueFlowStore) {
    const { nodes, edges } = vueFlow;

    const _data = {
      nodes: nodes.value.map((node) => {
        return {
          id: node.id,
          data: {
            options: node.data.options,
          },
          position: node.position,
          type: node.type,
        };
      }),
      edges: edges.value.map((edge) => {
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
        };
      }),
    };
    const jsonStr = JSON.stringify(_data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `sugopay-export-${new Date()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  },
  importNodesAndEdges: function (
    vueFlow: VueFlowStore,
    nodes: Array<GraphNode>,
    edges: Array<GraphEdge>
  ) {
    let currentNodeLength = vueFlow.nodes.value.length;
    const mapNodes: { [key: string]: string } = {};
    for (const node of nodes) {
      let currentNode = parseInt(node.id);
      if (currentNode < currentNodeLength) {
        mapNodes[currentNode.toString()] = (currentNodeLength + 1).toString();
      } else {
        mapNodes[currentNode.toString()] = node.id;
      }

      // delete node.data?.options?.references;

      vueFlow.addNodes({
        id: mapNodes[currentNode.toString()],
        position: node.position,
        data: node.data,
        type: node.type,
      });
    }

    setTimeout(() => {
      for (const edge of edges) {
        const source = mapNodes[edge.source];
        const target = mapNodes[edge.target];
        vueFlow.addEdges({
          id: source + "-" + target,
          source: source,
          target: target,
        });
      }
    }, 200);
  },
  import: function (vueFlow: VueFlowStore) {
    const fileInput = document.getElementById("fileInput");

    if (!fileInput) return;
    fileInput.click();

    fileInput.addEventListener("change", (e: Event) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.type !== "application/json") {
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        // try {
        const jsonData = JSON.parse(e.target.result);

        this.importNodesAndEdges(
          vueFlow,
          jsonData.nodes ? jsonData.nodes : [],
          jsonData.edges ? jsonData.edges : []
        );
      };

      reader.readAsText(file);
    });
  },
};
