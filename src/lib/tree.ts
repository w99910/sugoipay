import type { GraphEdge, VueFlowStore } from "@vue-flow/core";

type onNodeUpdateFn = (effectedNode: string, sourceNode: string) => void;

export default class Tree {
  public links: Array<Array<string>> = [];
  public nodeLinkIndexes: { [key: string]: Array<number> } = {};
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
      const targetLinkIndexes = this.nodeLinkIndexes[target];
      const topLinks = [];
      const linkWithTargetAsBottom = [];
      if (targetLinkIndexes?.length > 0) {
        for (let linkIndex of targetLinkIndexes) {
          const link = this.links[linkIndex];
          const targetIndex = link.indexOf(target);
          if (targetIndex === link.length - 1) {
            topLinks.push(link);
            linkWithTargetAsBottom[linkIndex] = link;
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

      const sourceLinkIndexes = this.nodeLinkIndexes[source];
      console.log({
        source,
        sourceLinkIndexes,
        links: Array.from(this.links),
        topLinks: Array.from(topLinks),
        target,
        targetLinkIndexes,
      });
      const bottomLinks = [];
      const linksWithSourceAsTop = [];
      if (sourceLinkIndexes?.length > 0) {
        for (let linkIndex of sourceLinkIndexes) {
          const link = this.links[linkIndex];
          const sourceIndex = link.indexOf(source);

          const downwardNodes = link.slice(sourceIndex, link.length);
          bottomLinks.push(downwardNodes);

          if (sourceIndex === 0) {
            linksWithSourceAsTop[linkIndex] = downwardNodes;
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

          const newLinkIndex = this.links.length - 1;

          const originalLinkIndexToRemove = linksWithSourceAsTop.includes(
            bottomLink
          )
            ? linksWithSourceAsTop.indexOf(bottomLink)
            : null;

          for (let node of newLink) {
            if (originalLinkIndexToRemove) {
              // remove original link index
              this.nodeLinkIndexes[node]?.splice(originalLinkIndexToRemove, 1);
            }
            if (!this.nodeLinkIndexes[node]) {
              this.nodeLinkIndexes[node] = [newLinkIndex];
            } else {
              this.nodeLinkIndexes[node].push(newLinkIndex);
            }
          }

          if (this._onApply) {
            const lastNode = bottomLink[bottomLink.length - 1];

            // let's say a -> b -> c -> d
            // so let b and c apply on a and finally sync a with d
            for (let i = 1; i < topLink.length; i++) {
              this._onApply(lastNode, topLink[i]);
            }

            this._onApply(topLink[0], lastNode);
          }

          if (originalLinkIndexToRemove) {
            this.links.splice(originalLinkIndexToRemove, 1);
          }
        }

        if (linkWithTargetAsBottom.includes(topLink)) {
          this.links.splice(this.links.indexOf(topLink), 1);
        }
      }

      console.log(this);
    } catch (e) {
      console.log(e, this.links, this.nodeLinkIndexes, { target, source });
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
      const upwardLinkIndex = this.links.length - 1;
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

        // since link is removed, remove its index from existing node link list.
        this.nodeLinkIndexes[node] = this.nodeLinkIndexes[node].filter(
          (i) => i !== linkIndex
        );

        // then add new link index to node link.
        this.nodeLinkIndexes[node].push(upwardLinkIndex);
      }
    } else {
      // call remove listener for the first node and last node
      if (this._onRemove) {
        this._onRemove(upwardNodes[0], lastNode);
      }
      // remove if there is only one node in a link
      this.nodeLinkIndexes[upwardNodes[0]] = [];
    }

    if (downwardNodes.length > 1) {
      this.links.push(downwardNodes);
      const downwardLinkIndex = this.links.length - 1;

      // the first node of downward link will act as final target
      // if (this._onApply) {
      //   this._onApply(downwardNodes[0], lastNode);
      // }

      for (const node of downwardNodes) {
        this.nodeLinkIndexes[node] = this.nodeLinkIndexes[node].filter(
          (i) => i !== linkIndex
        );
        this.nodeLinkIndexes[node].push(downwardLinkIndex);
      }
    } else {
      // prevent calling listener twice if there is only one node in each link
      if (this._onRemove && upwardNodes.length !== downwardNodes.length) {
        this._onRemove(upwardNodes[0], lastNode);
      }

      this.nodeLinkIndexes[downwardNodes[0]] = [];
    }

    console.log(this);
  }

  addEdgeBetween(current: string, target: string, source: string) {
    const links = this.links.filter(
      (link) => link.includes(target) && link.includes(source)
    );

    const link = links[0];

    const linkIndex = this.links.indexOf(link);

    this.nodeLinkIndexes[current] = [linkIndex];

    link.splice(link.indexOf(target) + 1, 0, current);

    if (this._onApply) {
      const firstNode = link[0];

      const latestNode = link[link.length - 1];
      this._onApply(latestNode, current);

      if (firstNode !== latestNode) {
        this._onApply(firstNode, latestNode);
      }
    }

    console.log(this);
  }

  traverseDownward(target: string, currentLinkIndex: null | number = null) {
    const edges = this.edges.filter((edge) => edge.target === target);

    if (currentLinkIndex === null) {
      currentLinkIndex = this.links.length;
    }

    if (!this.nodeLinkIndexes[target]) {
      this.nodeLinkIndexes[target] = [currentLinkIndex];
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

        for (let tnode of _links) {
          if (!this.nodeLinkIndexes[tnode].includes(currentLinkIndex)) {
            this.nodeLinkIndexes[tnode].push(currentLinkIndex);
          }
        }
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

    console.log(this.links, this.nodeLinkIndexes);
  }
}
