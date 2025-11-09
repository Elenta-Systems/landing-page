import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { build } from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

const entryPoints = [
  resolve(projectRoot, 'src/scripts/main.ts'),
  resolve(projectRoot, 'src/scripts/gsapAnimation.ts'),
];

const outdir = resolve(projectRoot, 'public/scripts');

const args = new Set(process.argv.slice(2));
const watch = args.has('--watch');

/** @type {import('esbuild').BuildOptions} */
const baseConfig = {
  entryPoints,
  outdir,
  bundle: true,
  format: 'esm',
  splitting: false,
  minify: !watch,
  sourcemap: watch ? 'inline' : false,
  target: 'es2018',
  platform: 'browser',
  logLevel: 'info',
};

if (watch) {
  const result = await build({
    ...baseConfig,
    watch: {
      onRebuild(error) {
        if (error) {
          console.error('[scripts] rebuild failed:', error);
        } else {
          console.log('[scripts] rebuilt successfully');
        }
      },
    },
  });

  console.log('[scripts] watching for changes...');

  process.on('SIGINT', () => {
    result.stop?.();
    process.exit(0);
  });
} else {
  await build(baseConfig);
}


