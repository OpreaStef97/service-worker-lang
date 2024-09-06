import esbuild from 'esbuild'
import fs from 'fs'
import path from 'path'

const distPath = path.join(process.cwd(), 'dist')
if (fs.existsSync(distPath)) {
  fs.rmSync(distPath, {
    recursive: true,
    force: true,
  })
}

esbuild
  .build({
    entryPoints: ['client/index.js', 'client/worker.js'],
    bundle: true,
    minify: true,
    sourcemap: true,
    outdir: 'dist',
    target: ['es6'],
  })
  .then(() => {
    const fileContent = fs.readFileSync(
      path.join(process.cwd(), 'client/index.html'),
      'utf-8',
    )

    fs.writeFileSync(path.join(process.cwd(), 'dist/index.html'), fileContent)
    console.info('HTML file generated.')
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
