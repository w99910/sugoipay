import type { GraphEdge, VueFlowStore } from "@vue-flow/core";

type onNodeUpdateFn = (effectedNode: string, sourceNode: string) => void;

export default class Tree {
  public links: Array<Array<string>> = [];
  // public nodeLinkIndexes: { [key: string]: Array<number> } = {};
  protected _onApply: null | onNodeUpdateFn = null;
  protected _onRemove: null | onNodeUpdateFn = null;
  protected edges: Array<GraphEdge>;
  public disable = false;

  constructor(protected vueFlow: VueFlowStore) {
    this.edges = vueFlow.edges.value;
    this.initialize();
  }

  onApply(fn: onNodeUpdateFn) {
    this._onApply = fn;
    return this;
  }

  onRemove(fn: onNodeUpdateFn) {
    this._onRemove = fn;
    return this;
  }

  addEdge(target: string, source: string) {
    if (this.disable) return;
    try {
      // const targetLinkIndexes = this.nodeLinkIndexes[target];
      const targetLinks = this.links.filter((link) => link.includes(target));
      const topLinks = [];
      const toDeleteLink = [];
      if (targetLinks.length > 0) {
        for (let link of targetLinks) {
          const targetIndex = link.indexOf(target);
          if (targetIndex === link.length - 1) {
            topLinks.push(link);
            toDeleteLink.push(link);
            // this.links.splice(linkIndex, 1);
          } else {
            const upwardNodes = link.slice(0, link.indexOf(target));
            upwardNodes.push(target);

            topLinks.push(upwardNodes);
          }
        }
      } else {
        topLinks.push([target]);
      }

      const sourceLinks = this.links.filter((link) => link.includes(source));
      const bottomLinks = [];
      const currentTopNodesOfSource = sourceLinks.map((link) => link[0]);
      if (sourceLinks.length > 0) {
        for (let link of sourceLinks) {
          const sourceIndex = link.indexOf(source);

          const downwardNodes = link.slice(sourceIndex, link.length);
          bottomLinks.push(downwardNodes);

          if (sourceIndex === 0) {
            toDeleteLink.push(link);
          }
        }
      } else {
        bottomLinks.push([source]);
      }

      // console.log(topLinks, bottomLinks);

      for (let topLink of topLinks) {
        for (let bottomLink of bottomLinks) {
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
        }
      }

      for (const link of toDeleteLink) {
        this.links.splice(this.links.indexOf(link), 1);
      }

      console.log(this.links);
    } catch (e) {
      console.log(e, this.links, { target, source });
    }
  }

  removeEdge(target: string, source: string) {
    if (this.disable) return;
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

    // if upper nodes has more than one
    if (upwardNodes.length > 1) {
      this.links.push(upwardNodes);
      const firstNode = upwardNodes[0];

      if (this._onApply) {
        this._onApply(firstNode, upwardNodes[upwardNodes.length - 1]);
      }

      if (this._onRemove) {
        this._onRemove(firstNode, lastNode);
      }

      for (const node of upwardNodes) {
        if (this._onRemove) {
          this._onRemove(lastNode, node);
        }
      }
    } else {
      // call remove listener for the first node and last node
      if (this._onRemove) {
        this._onRemove(upwardNodes[0], lastNode);
      }
    }

    if (downwardNodes.length > 1) {
      this.links.push(downwardNodes);

      // the first node of downward link will act as final target
      // if (this._onApply) {
      //   this._onApply(downwardNodes[0], lastNode);
      // }

      for (const node of downwardNodes) {
      }
    } else {
      // prevent calling listener twice if there is only one node in each link
      if (this._onRemove && upwardNodes.length !== downwardNodes.length) {
        this._onRemove(upwardNodes[0], lastNode);
      }
    }

    console.log(this.links);
  }

  addEdgeBetween(current: string, target: string, source: string) {
    const links = this.links.filter(
      (link) => link.includes(target) && link.includes(source)
    );

    const link = links[0];

    link.splice(link.indexOf(target) + 1, 0, current);

    if (this._onApply) {
      const firstNode = link[0];

      const latestNode = link[link.length - 1];
      this._onApply(latestNode, current);

      if (firstNode !== latestNode) {
        this._onApply(firstNode, latestNode);
      }
    }

    console.log(this.links);
  }

  traverseDownward(target: string, currentLinkIndex: null | number = null) {
    const edges = this.edges.filter((edge) => edge.target === target);

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
    for (const edge of this.edges) {
      if (!targetEdges.includes(edge.target)) {
        targetEdges.push(edge.target);
      }
      if (!sourceEdges.includes(edge.source)) {
        sourceEdges.push(edge.source);
      }
    }

    const topEdges = targetEdges.filter((edge) => !sourceEdges.includes(edge));

    for (let topEdge of topEdges) {
      this.traverseDownward(topEdge);
    }

    console.log(this.links);
  }
}
