import { colors } from 'https://deno.land/x/cliffy@v0.25.7/ansi/mod.ts';

const command = new Deno.Command(Deno.execPath(), {
  args: [
    'install',
    '--allow-read',
    '--allow-write',
    '-n',
    'deno-dep-graph',
    'mod.ts',
  ],
});

const { code, stdout, stderr } = await command.output();

if (code === 0) {
  console.log(colors.green('✔️ deno-dep-graph has been successfully installed!'));
  console.log(colors.blue('You can now run it using the command: deno-dep-graph'));
} else {
  console.error(colors.red('❌ Installation failed. Error details:'));
  console.error(colors.red(new TextDecoder().decode(stderr)));
  console.error(colors.yellow('Standard output:'));
  console.error(colors.yellow(new TextDecoder().decode(stdout)));
}

try {
  await Deno.stat('mod.ts');
// deno-lint-ignore no-unused-vars
} catch (error) {
  console.error(colors.red("❌ mod.ts file not found. Make sure you're in the correct directory."));
}

console.log(colors.blue('Current directory contents:'));
for await (const dirEntry of Deno.readDir('.')) {
  console.log(dirEntry.name);
}
