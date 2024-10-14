import { DefaultEdge, DefaultNode, DependencyGraph } from '../graph.ts';
import { Formatter } from './formatter_registry.ts';

function generateDotGraph(graph: DependencyGraph<DefaultNode, DefaultEdge>): string {
  let dot = 'digraph DependencyGraph {\n';

  for (const node of graph.getNodes()) {
    dot += `  "${node.id}" [label="${node.file}"];\n`;
  }

  for (const edge of graph.getEdges()) {
    dot += `  "${edge.source}" -> "${edge.target}" [label="${edge.symbols.join(', ')}"];\n`;
  }

  dot += '}\n';
  return dot;
}

export const dotformatter: Formatter<DefaultNode, DefaultEdge> = {
  name: 'dot',
  extension: 'dot',
  format: generateDotGraph,
};
