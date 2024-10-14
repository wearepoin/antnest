import { DependencyGraph, Edge, Node } from '../graph.ts';

export type FormatterFunction<T extends Node, E extends Edge<T>> = (
  graph: DependencyGraph<T, E>,
) => string;

export interface Formatter<T extends Node, E extends Edge<T>> {
  name: string;
  extension: string;
  format: FormatterFunction<T, E>;
}

export class FormatterRegistry<T extends Node, E extends Edge<T>> {
  private formatters: Map<string, Formatter<T, E>> = new Map();

  public register(formatter: Formatter<T, E>): void {
    this.formatters.set(formatter.name, formatter);
  }

  public get(name: string): Formatter<T, E> | undefined {
    return this.formatters.get(name);
  }

  public getAll(): Formatter<T, E>[] {
    return Array.from(this.formatters.values());
  }
}
