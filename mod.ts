import { dotformatter } from './src/formatter/dot.ts';
import { type Formatter, FormatterRegistry } from './src/formatter/formatter_registry.ts';
import { DefaultEdge, DefaultNode, type Edge, type Node } from './src/graph.ts';

export { analyzeDependencies } from './src/analyzer.ts';

export {
  type DefaultEdge,
  type DefaultGraph,
  type DefaultNode,
  DependencyGraph,
  type Edge,
  type Node,
} from './src/graph.ts';

export { type Formatter, FormatterRegistry } from './src/formatter/formatter_registry.ts';

export const defaultFormatterRegistry = new FormatterRegistry<DefaultNode, DefaultEdge>();

export const builtInFormatters = {
  dot: dotformatter,
};

Object.values(builtInFormatters).forEach((formatter) =>
  defaultFormatterRegistry.register(formatter)
);

export function registerFormatter<T extends Node, E extends Edge<T>>(
  registry: FormatterRegistry<T, E>,
  formatter: Formatter<T, E>,
) {
  registry.register(formatter);
}
