import type { GraphEdge, GraphNode, VueFlowStore } from "@vue-flow/core";
import { data, config } from "./global";
import { toRaw } from "vue";

type onNodeUpdateFn = (effectedNode: string, sourceNode: string) => void;
type CanApplyFn = (
  targetNode: string | GraphNode | undefined,
  sourceNode: string | GraphNode | undefined
) => boolean;

let instance: null | Tree = null;

export default class Tree {
  public links: Array<Array<string>> = [];

  public linksWithType: Array<Array<string>> = [];
  // public nodeLinkIndexes: { [key: string]: Array<number> } = {};
  protected _onApply: null | onNodeUpdateFn = null;
  protected _onRemove: null | onNodeUpdateFn = null;
  protected _canApply: null | CanApplyFn = null;
  protected edges;
  public disable = false;

  protected nodes;

  static instance() {
    return instance;
  }

  getNodes() {
    return this.nodes.value;
  }

  constructor(protected vueFlow: VueFlowStore) {
    this.edges = vueFlow.edges;
    this.nodes = vueFlow.nodes;
    this.initialize();

    instance = this;
  }

  onApply(fn: onNodeUpdateFn) {
    this._onApply = fn;
    return this;
  }

  onRemove(fn: onNodeUpdateFn) {
    this._onRemove = fn;
    return this;
  }

  canApply(fn: CanApplyFn) {
    this._canApply = fn;
    return this;
  }

  applyEffect(
    targetNode: string | GraphNode | undefined,
    sourceNode: string | GraphNode | undefined
  ) {
    if (typeof targetNode === "string") {
      targetNode = this.vueFlow.findNode(targetNode);
    }

    if (typeof sourceNode === "string") {
      sourceNode = this.vueFlow.findNode(sourceNode);
    }
    if (!targetNode || !sourceNode) return false;
    const targetConfig = config.connections[targetNode.type];
    const sourceConfig = config.connections[sourceNode.type];

    if (
      targetConfig.appliable &&
      sourceConfig.appliable &&
      targetConfig.connectable.includes(sourceNode.type)
    ) {
      if (targetConfig.children?.includes(sourceNode.type)) {
        if (!targetNode.data[sourceNode.type]) {
          targetNode.data[sourceNode.type] = {};
        }
        targetNode.data[sourceNode.type][sourceNode.id] = sourceNode.data;
      } else {
        targetNode.data[sourceNode.type] = sourceNode.data;
      }

      if (!targetNode.data.references) {
        targetNode.data.references = [];
      }

      targetNode.data.references.push(sourceNode.id);
    }
    //
    if (targetConfig.appliable && !sourceConfig.appliable) {
      // get applied references
      if (sourceNode.data.references) {
        for (const referenceNodeId of sourceNode.data.references) {
          const referenceNode = this.vueFlow.findNode(referenceNodeId);
          if (!referenceNode) continue;

          if (!targetConfig.connectable.includes(referenceNode.type)) {
            continue;
          }

          if (targetConfig.children?.includes(referenceNode.type)) {
            if (!targetNode.data[referenceNode.type]) {
              targetNode.data[referenceNode.type] = {};
            }

            // if (
            //   targetConfig.canApply &&
            //   !targetConfig.canApply(targetNode.data, referenceNode)
            // ) {
            //   global
            //   continue;
            // }

            targetNode.data[referenceNode.type][referenceNode.id] =
              referenceNode.data;
          } else {
            targetNode.data[referenceNode.type] = referenceNode.data;
          }
        }

        if (!targetNode.data.references) {
          targetNode.data.references = [];
        }

        targetNode.data.references.push(...sourceNode.data.references);
      }
    }

    if (
      sourceConfig.appliable &&
      !targetConfig.appliable &&
      sourceConfig.connectable.includes(targetNode.type)
    ) {
      // check target node can be children instead of attributes
      if (sourceConfig.children?.includes(targetNode.type)) {
        if (!sourceNode.data[targetNode.type]) {
          sourceNode.data[targetNode.type] = {};
        }

        sourceNode.data[targetNode.type][targetNode.id] =
          targetNode.data.options;
      } else {
        sourceNode.data[targetNode.type] = targetNode.data.options;
      }

      // add applied_node ids to targetNode to reference
      if (!targetNode.data.references) {
        targetNode.data.references = [];
      }

      targetNode.data.references.push(sourceNode.id);

      if (!sourceNode.data.references) {
        sourceNode.data.references = [];
      }
      sourceNode.data.references.push(targetNode.id);

      if (sourceConfig.validate) {
        sourceConfig.validate(sourceNode);
      }
    }

    if (!sourceConfig.appliable && !targetConfig.appliable) {
      // get references from source
      if (sourceNode.data.references) {
        for (const referenceNodeId of sourceNode.data.references) {
          const referenceNode = this.vueFlow.findNode(referenceNodeId);
          if (!referenceNode) continue;
          const referenceConfig = config.connections[referenceNode.type];
          if (!referenceConfig.connectable.includes(targetNode.type)) {
            continue;
          }

          if (referenceConfig.children?.includes(targetNode.type)) {
            if (!referenceNode.data[targetNode.type]) {
              referenceNode.data[targetNode.type] = {};
            }

            referenceNode.data[targetNode.type][targetNode.id] =
              targetNode.data.options;
          } else {
            referenceNode.data[targetNode.type] = targetNode.data.options;
          }

          if (!referenceNode.data.references) {
            referenceNode.data.references = [];
          }
          referenceNode.data.references.push(targetNode.id);
        }

        targetNode.data.references = sourceNode.data.references;
      }
    }
  }

  canConnect(
    targetNode: string | GraphNode | undefined,
    sourceNode: string | GraphNode | undefined,
    isBetween: boolean = false
  ) {
    if (typeof targetNode === "string") {
      targetNode = this.vueFlow.findNode(targetNode);
    }

    if (typeof sourceNode === "string") {
      sourceNode = this.vueFlow.findNode(sourceNode);
    }
    if (!targetNode || !sourceNode) return false;

    const targetConfig = config.connections[targetNode.type];
    const existingEdges = this.edges.value;

    if (
      !isBetween &&
      !targetConfig.allowMultipleConnections &&
      existingEdges.some(
        (edge) => edge.source === sourceNode.id || edge.target === targetNode.id
      )
    ) {
      return false;
    }

    if (!targetConfig.connectable.includes(sourceNode.type)) {
      return false;
    }

    return true;
  }

  addEdge(target: string, source: string) {
    if (this.disable) return true;
    if (!this.canConnect(target, source)) {
      return false;
    }

    try {
      const targetNode = this.vueFlow.findNode(target);
      if (!targetNode) return;
      const sourceNode = this.vueFlow.findNode(source);

      if (!sourceNode) return;
      const topLinksWithType = [];

      // const targetLinkIndexes = this.nodeLinkIndexes[target];
      const targetLinks = this.links.filter((link) => link.includes(target));
      const topLinks: string[][] = [];
      const toDeleteLink = [];
      if (targetLinks.length > 0) {
        for (let link of targetLinks) {
          const targetIndex = link.indexOf(target);

          const linkWithType = this.linksWithType[this.links.indexOf(link)];
          // if target is last, link will be destroyed and created
          if (targetIndex === link.length - 1) {
            topLinks.push(link);
            toDeleteLink.push(link);

            topLinksWithType.push(linkWithType);
            // this.links.splice(linkIndex, 1);
          } else {
            const upwardNodes = link.slice(0, link.indexOf(target));
            upwardNodes.push(target);

            if (
              topLinks.some(
                (link) => JSON.stringify(link) === JSON.stringify(upwardNodes)
              )
            ) {
              continue;
            }

            topLinks.push(upwardNodes);

            const upwardNodeTypes = linkWithType.slice(0, link.indexOf(target));
            const node = this.vueFlow.findNode(target);
            upwardNodeTypes.push(node ? node.type : target);
          }
        }
      } else {
        topLinks.push([target]);
      }

      const sourceLinks = this.links.filter((link) => link.includes(source));
      const bottomLinks = [];
      const bottomLinksWithType = [];
      const currentTopNodesOfSource = sourceLinks.map((link) => link[0]);
      if (sourceLinks.length > 0) {
        for (let link of sourceLinks) {
          const sourceIndex = link.indexOf(source);
          const downwardNodes = link.slice(sourceIndex, link.length);
          bottomLinks.push(downwardNodes);

          const linkWithType = this.linksWithType[this.links.indexOf(link)];
          bottomLinksWithType.push(
            linkWithType.slice(sourceIndex, link.length)
          );

          if (sourceIndex === 0) {
            toDeleteLink.push(link);
          }
        }
      } else {
        bottomLinks.push([source]);
      }

      console.log(topLinks, bottomLinks);

      for (let i = 0; i < topLinks.length; i++) {
        const topLink = topLinks[i];
        const topLinkWithType = topLinksWithType[i];
        // loop to apply nodes from top link to first node of bottom link
        // if first node of bottom link doesn't have references, pass

        for (let j = 0; j < bottomLinks.length; j++) {
          const bottomLink = bottomLinks[i];
          const firstNodeOfBottomLink = this.vueFlow.findNode(bottomLink[0]);

          for (let k = topLink.length - 1; k >= 0; k--) {
            const node = topLink[k];
            console.log("apply effect", node, firstNodeOfBottomLink);
            this.applyEffect(node, firstNodeOfBottomLink);
          }

          const bottomLinkWithType = bottomLinksWithType[i];
          const newLink = [...topLink, ...bottomLink];
          this.links.push(newLink);

          if (this._onApply) {
            const lastNode = bottomLink[bottomLink.length - 1];

            // let's say a -> b -> c -> d
            // so let b and c apply on a and finally sync a with d
            for (let i = 0; i < topLink.length; i++) {
              this._onApply(lastNode, topLink[i]);
            }

            this._onApply(topLink[0], lastNode);

            for (const topNode of currentTopNodesOfSource) {
              // this._onApply(topNode, lastNode);
            }
          }

          const l = [];
          for (const nodeIndex of newLink) {
            const node = this.vueFlow.findNode(nodeIndex);
            l.push(node ? node.type : nodeIndex);
          }

          this.linksWithType.push(l);
        }
      }

      for (const link of toDeleteLink) {
        const index = this.links.indexOf(link);
        this.links.splice(index, 1);

        this.linksWithType.splice(index, 1);
      }

      // this.applyEffect(target, source);

      console.log(toRaw(this.vueFlow.nodes.value));
      return true;
    } catch (e) {
      console.log(e, this.links, { target, source });
      return false;
    }
  }

  removeEdge(target: string, source: string) {
    if (this.disable) return true;
    // Get link which has both target and source
    const links = this.links.filter(
      (link) => link.includes(target) && link.includes(source)
    );

    if (links.length === 0) return;

    const link = links[0];
    const linkIndex = this.links.indexOf(link);

    // get upper nodes of target including target
    const upwardNodes = link.slice(0, link.indexOf(target) + 1);

    // get lower nodes of source including source
    const downwardNodes = link.slice(link.indexOf(source), link.length);

    // get last node of current link to apply effect
    const lastNode = link[link.length - 1];

    // remove link since it is splitted
    this.links.splice(linkIndex, 1);
    this.linksWithType.splice(linkIndex, 1);

    // if upper nodes has more than one

    const firstNode = upwardNodes[0];

    if (this._onApply) {
      this._onApply(firstNode, upwardNodes[upwardNodes.length - 1]);
    }

    if (this._onRemove) {
      this._onRemove(firstNode, lastNode);
    }

    const l = [];
    for (const nodeIndex of upwardNodes) {
      if (this._onRemove) {
        this._onRemove(lastNode, nodeIndex);
      }
      const node = this.vueFlow.findNode(nodeIndex);
      l.push(node ? node.type : nodeIndex);
      // remove from references
      if (!node) continue;
      const nodeConfig = config.connections[node.type];
      if (node.data.references) {
        for (const referenceId of node.data.references) {
          if (nodeConfig.appliable && !downwardNodes.includes(referenceId)) {
            continue;
          }

          const referenceNode = this.vueFlow.findNode(referenceId);
          if (!referenceNode) continue;
          const referenceNodeConfig = config.connections[referenceNode.type];
          // if reference node type has target node as children
          if (referenceNodeConfig.children.includes(node.type)) {
            delete referenceNode.data[node.type][node.id];
          } else {
            delete referenceNode.data[node.type];
          }

          if (referenceNodeConfig.validate) {
            referenceNodeConfig.validate(referenceNode);
          }

          if (nodeConfig.appliable) {
            if (nodeConfig.children.includes(referenceNode.type)) {
              delete node.data[referenceNode.type][referenceId];
            } else {
              delete node.data[referenceNode.type];
            }
          }

          if (nodeConfig.validate) {
            nodeConfig.validate(node);
          }
        }
      }
    }

    if (upwardNodes.length > 1) {
      this.links.push(upwardNodes);
      this.linksWithType.push(l);
    }

    if (downwardNodes.length > 1) {
      this.links.push(downwardNodes);

      // the first node of downward link will act as final target
      // if (this._onApply) {
      //   this._onApply(downwardNodes[0], lastNode);
      // }
      const l = [];

      for (const nodeIndex of downwardNodes) {
        const node = this.vueFlow.findNode(nodeIndex);
        l.push(node ? node.type : nodeIndex);

        // if (node) {
        //   const nodeConfig = config.connections[node.type];
        //   if (nodeConfig.validate) {
        //     nodeConfig.validate(node);
        //   }
        // }
      }
      this.linksWithType.push(l);
    } else {
      // prevent calling listener twice if there is only one node in each link
      if (this._onRemove && upwardNodes.length !== downwardNodes.length) {
        this._onRemove(upwardNodes[0], lastNode);
      }
    }

    console.log(this.vueFlow.nodes.value, this.linksWithType);

    return true;
  }

  addEdgeBetween(current: string, target: string, source: string) {
    const links = this.links.filter(
      (link) => link.includes(target) && link.includes(source)
    );

    const link = links[0];
    const linkIndex = this.links.indexOf(link);

    const nodeIndex = link.indexOf(target) + 1;

    // add current in the link
    link.splice(nodeIndex, 0, current);

    // update in link with type
    const node = this.vueFlow.findNode(current);
    this.linksWithType[linkIndex].splice(
      nodeIndex,
      0,
      node ? node.type : current
    );

    this.applyEffect(current, source);

    console.log(this.vueFlow.nodes.value, this.linksWithType);

    return true;
  }

  traverseDownward(target: string, currentLinkIndex: null | number = null) {
    const edges = this.edges.value.filter((edge) => edge.target === target);

    if (currentLinkIndex === null) {
      currentLinkIndex = this.links.length;
    }

    for (let i = 0; i < edges.length; i++) {
      currentLinkIndex += i;

      if (!this.links[currentLinkIndex]) {
        let _links = [target];
        if (this.links.length > 0) {
          let temp: Array<string> = this.links[currentLinkIndex - 1];
          //if last node of previous link is the same with target node
          if (temp[temp.length - 1] === target) {
            _links = temp;
          }
        }

        this.links[currentLinkIndex] = _links;
      }

      this.links[currentLinkIndex].push(edges[i].source);

      this.traverseDownward(edges[i].source, currentLinkIndex);
    }
  }

  initialize() {
    // find top edges
    const targetEdges: string[] = [];
    const sourceEdges: string[] = [];
    for (const edge of this.edges.value) {
      if (!targetEdges.includes(edge.target)) {
        targetEdges.push(edge.target);
      }
      if (!sourceEdges.includes(edge.source)) {
        sourceEdges.push(edge.source);
      }
    }

    const topEdges = targetEdges.filter((edge) => !sourceEdges.includes(edge));

    for (const topEdge of topEdges) {
      this.traverseDownward(topEdge);
    }

    for (let link of this.links) {
      const t = [];
      // from bottom to top
      for (let i = link.length - 1; i >= 0; i--) {
        const node = this.vueFlow.findNode(link[i]);
        t.push(node ? node.type : link[i]);

        // apply node to target
        const target = i - 1;
        if (link[target]) {
          this.applyEffect(link[target], node);
        }
      }

      this.linksWithType.push(t.reverse());
    }

    console.log(this);
  }
}
