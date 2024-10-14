import { parse, walk } from '../deps.ts';
import { DefaultEdge, DefaultGraph, DefaultNode, DependencyGraph } from './graph.ts';

async function parseFile(filePath: string): Promise<{ path: string; symbols: string[] }[]> {
  const content = await Deno.readTextFile(filePath);
  const importRegex = /import\s+(?:{([^}]+)}\s+from\s+)?['"](.+)['"]/g;
  const matches = [...content.matchAll(importRegex)];
  return matches.map((match) => ({
    path: match[2],
    symbols: match[1] ? match[1].split(',').map((s) => s.trim()) : ['*'],
  }));
}

export async function analyzeDependencies(
  rootDir: string,
  ignore: string[] = [],
): Promise<DefaultGraph> {
  const graph = new DependencyGraph<DefaultNode, DefaultEdge>();

  for await (const entry of walk(rootDir, { exts: ['.ts', '.js', '.tsx', '.jsx'] })) {
    if (entry.isFile && !ignore.some((pattern) => entry.path.includes(pattern))) {
      const relativeFilePath = entry.path.replace(rootDir, '');
      graph.addNode({ id: relativeFilePath, file: relativeFilePath });

      const imports = await parseFile(entry.path);
      for (const { path: importPath, symbols } of imports) {
        const resolvedPath = parse(importPath).name;
        graph.addNode({ id: resolvedPath, file: resolvedPath });
        graph.addEdge({
          source: relativeFilePath,
          target: resolvedPath,
          symbols,
        });
      }
    }
  }

  return graph;
}
