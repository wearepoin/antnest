# AntNest - Deno Module Dependency Graph Generator

This library analyzes Deno projects and generates a dependency graph based on import statements. It supports multiple output formats and provides options for filtering and detailed analysis

## Features

- Analyze Deno project dependencies
- Generate dependency graphs in various formats (DOT, your own)
- Highly extensible and type-safe API
- Ignore specific directories or files
- Track specific imported symbols

#### Usage as a CLI Tool

```sh
antnest [options] <project_dir>
```

## Library

#### Usage as a library

```typescript
// Analyze dependencies
const graph = await analyzeDependencies('./path/to/project');

// Use built-in formatters
const dotOutput = builtInFormatters.dot.formatter.format(graph);

// Define custom node and edge types
interface CustomNode extends Node {
  complexity: number;
}

interface CustomEdge extends Edge<CustomNode> {
  weight: number;
}

// Create a custom formatter
const myCustomFormatter: Formatter<CustomNode, CustomEdge> = {
  name: 'custom',
  extension: 'txt',
  format: (graph: DependencyGraph<CustomNode, CustomEdge>) => {
    // Your custom formatting logic here
    return formattedOutput;
  },
};

// Create a custom formatter registry
const customRegistry = new FormatterRegistry<CustomNode, CustomEdge>();

// Register the custom formatter
registerFormatter(customRegistry, myCustomFormatter);

// Use the custom formatter
const customGraph = new DependencyGraph<CustomNode, CustomEdge>();
// ... populate the custom graph ...
const customOutput = myCustomFormatter.format(customGraph);
```

## Extending the library

You can easily extend the library by creating custom node and edge types, and defining formatters for them:

1. Define custom node and edge types:

```typescript
interface CustomNode extends Node {
  complexity: number;
}

interface CustomEdge extends Edge<CustomNode> {
  weight: number;
}
```

2. Create a custom analyzer (optional):

```typescript
async function customAnalyzer(rootDir: string): Promise<DependencyGraph<CustomNode, CustomEdge>> {
  // Your custom analysis logic here
}
```

3. Define a custom formatter::

```typescript
const customFormatter: Formatter<CustomNode, CustomEdge> = {
  name: 'custom',
  extension: 'txt',
  format: (graph: DependencyGraph<CustomNode, CustomEdge>) => {
    // Your custom formatting logic here
    return formattedOutput;
  },
};
```

4. Use the custom types and formatter:

```typescript
const customRegistry = new FormatterRegistry<CustomNode, CustomEdge>();
registerFormatter(customRegistry, customFormatter);

const customGraph = await customAnalyzer('./path/to/project');
const output = customFormatter.format(customGraph);
```

# License

This project is open source and available under the MIT License.
