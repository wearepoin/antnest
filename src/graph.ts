export interface Node {
  id: string;
  [key: string]: unknown;
}

export interface Edge<T extends Node> {
  source: T['id'];
  target: T['id'];
  [key: string]: unknown;
}

export class DependencyGraph<T extends Node, E extends Edge<T>> {
  private nodes: Map<T['id'], T> = new Map();
  private edges: E[] = [];

  addNode(node: T): void {
    this.nodes.set(node.id, node);
  }

  addEdge(edge: E): void {
    this.edges.push(edge);
  }

  getNodes(): T[] {
    return Array.from(this.nodes.values());
  }

  getEdges(): E[] {
    return this.edges;
  }
}

export type DefaultNode = Node & { file: string };
export type DefaultEdge = Edge<DefaultNode> & { symbols: string[] };
export type DefaultGraph = DependencyGraph<DefaultNode, DefaultEdge>;
