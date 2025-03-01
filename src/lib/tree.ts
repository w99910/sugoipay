import type { GraphEdge, VueFlowStore } from "@vue-flow/core";

type onNodeUpdateFn = (effectedNode: string, sourceNode: string) => void;
type canConnect = (
  targetNode: string,
  sourceNode: string,
  targetLinks: {
    link: string[];
    linkWithType: string[];
  },
  sourceLinks: {
    link: string[];
    linkWithType: string[];
  },
  middleNode?: string
) => boolean;

export default class Tree {
  public links: Array<Array<string>> = [];

  public linksWithType: Array<Array<string>> = [];
  // public nodeLinkIndexes: { [key: string]: Array<number> } = {};
  protected _onApply: null | onNodeUpdateFn = null;
  protected _onRemove: null | onNodeUpdateFn = null;
  protected _canConnect: null | canConnect = null;
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

  canConnect(fn: canConnect) {
    this._canConnect = fn;
    return this;
  }

  addEdge(target: string, source: string) {
    if (this.disable) return true;
    try {
      const topLinksWithType = [];

      // const targetLinkIndexes = this.nodeLinkIndexes[target];
      const targetLinks = this.links.filter((link) => link.includes(target));
      const topLinks = [];
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

      // console.log(topLinks, bottomLinks);

      for (let i = 0; i < topLinks.length; i++) {
        const topLink = topLinks[i];
        const topLinkWithType = topLinksWithType[i];
        for (let j = 0; j < bottomLinks.length; j++) {
          const bottomLink = bottomLinks[i];
          const bottomLinkWithType = bottomLinksWithType[i];
          if (
            this._canConnect &&
            !this._canConnect(
              target,
              source,
              {
                link: topLink,
                linkWithType: topLinkWithType,
              },
              {
                link: bottomLink,
                linkWithType: bottomLinkWithType,
              }
            )
          ) {
            return;
          }
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

      console.log(this.links, this.linksWithType);
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
    if (upwardNodes.length > 1) {
      this.links.push(upwardNodes);
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
      }

      this.linksWithType.push(l);
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
      const l = [];

      for (const nodeIndex of downwardNodes) {
        const node = this.vueFlow.findNode(nodeIndex);
        l.push(node ? node.type : nodeIndex);
      }
      this.linksWithType.push(l);
    } else {
      // prevent calling listener twice if there is only one node in each link
      if (this._onRemove && upwardNodes.length !== downwardNodes.length) {
        this._onRemove(upwardNodes[0], lastNode);
      }
    }

    console.log(this.links, this.linksWithType);

    return true;
  }

  addEdgeBetween(current: string, target: string, source: string) {
    const links = this.links.filter(
      (link) => link.includes(target) && link.includes(source)
    );

    const link = links[0];
    const linkIndex = this.links.indexOf(link);

    if (
      this._canConnect &&
      !this._canConnect(
        target,
        source,
        {
          link: link,
          linkWithType: this.linksWithType[linkIndex],
        },
        {
          link: link,
          linkWithType: this.linksWithType[linkIndex],
        },
        current
      )
    ) {
      return false;
    }

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

    if (this._onApply) {
      const firstNode = link[0];

      const latestNode = link[link.length - 1];
      this._onApply(latestNode, current);

      if (firstNode !== latestNode) {
        this._onApply(firstNode, latestNode);
      }
    }

    console.log(this.links, this.linksWithType);

    return true;
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

    for (const topEdge of topEdges) {
      this.traverseDownward(topEdge);
    }

    for (const link of this.links) {
      const t = [];
      for (const nodeIndex of link) {
        const node = this.vueFlow.findNode(nodeIndex);
        t.push(node ? node.type : nodeIndex);
      }

      this.linksWithType.push(t);
    }

    console.log(this.linksWithType);
  }
}
