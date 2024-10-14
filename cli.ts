import { colors, Command } from './deps.ts';
import { analyzeDependencies, defaultFormatterRegistry } from './mod.ts';

function handleError(error: unknown): never {
  if (error instanceof Error) {
    console.error(colors.red(`Error: ${error.message}`));
    if (error.stack) {
      console.error(colors.gray(error.stack));
    }
  } else if (typeof error === 'string') {
    console.error(colors.red(`Error: ${error}`));
  } else {
    console.error(colors.red('An unknown error occurred'));
    console.error(error);
  }
  Deno.exit(1);
}

async function main() {
  const formatters = defaultFormatterRegistry.getAll();
  const formatOptions = formatters.map((f) => f.name).join(', ');

  try {
    await new Command()
      .name('antnest')
      .version('1.0.0')
      .description('Generate a dependency graph for Deno projects')
      .option('-o, --output <file:string>', 'Output file (default: console output)', {
        default: 'console',
      })
      .option('-f, --format <format:string>', `Output format: ${formatOptions}`, { default: 'dot' })
      .option('-i, --ignore <patterns:string>', 'Comma-separated patterns to ignore', {
        default: '',
      })
      .arguments('<project_dir:string>')
      .action(async (options, projectDir) => {
        const { output, format, ignore } = options;
        const ignorePatterns = ignore ? ignore.split(',') : [];

        console.log(colors.blue(`Analyzing dependencies in ${projectDir}...`));

        try {
          const graph = await analyzeDependencies(projectDir, ignorePatterns);

          const formatter = defaultFormatterRegistry.get(format);
          if (!formatter) {
            throw new Error(`Unsupported format: ${format}`);
          }

          const outputContent = formatter.format(graph);

          if (output === 'console') {
            console.log(outputContent);
          } else {
            const fileName = output.includes('.') ? output : `${output}.${formatter.extension}`;
            await Deno.writeTextFile(fileName, outputContent);
            console.log(colors.green(`Dependency graph written to ${fileName}`));
          }

          console.log(
            colors.blue(`Analysis complete. Found ${graph.getEdges().length} dependencies.`),
          );
        } catch (error) {
          handleError(error);
        }
      })
      .parse(Deno.args);
  } catch (error) {
    handleError(error);
  }
}

if (import.meta.main) {
  main().catch(handleError);
}
