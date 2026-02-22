import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { Template, defaultBuildLogger } from 'e2b'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const templateName = process.argv[2]

const TEMPLATES: Record<string, string> = {
  base: 'gitwit-base',
  reactjs: 'gitwit-reactjs',
  nextjs: 'gitwit-nextjs',
  vanillajs: 'gitwit-vanillajs',
  empty: 'gitwit-empty',
  streamlit: 'gitwit-streamlit',
  php: 'gitwit-php',
}

async function buildTemplate(name: string) {
  const tag = TEMPLATES[name]
  if (!tag) {
    console.error(`Unknown template: ${name}. Available: ${Object.keys(TEMPLATES).join(', ')}`)
    process.exit(1)
  }

  console.log(`\nBuilding template: ${tag}...`)
  const { template } = await import(`./${name}/template`)

  await Template.build(template, tag, {
    cpuCount: 2,
    memoryMB: 1024,
    onBuildLogs: defaultBuildLogger(),
  })

  console.log(`\n✅ Successfully built: ${tag}`)
}

async function main() {
  if (templateName) {
    await buildTemplate(templateName)
  } else {
    // Build base first since other templates depend on it via fromTemplate()
    await buildTemplate('base')
    for (const name of Object.keys(TEMPLATES)) {
      if (name !== 'base') {
        await buildTemplate(name)
      }
    }
  }
}

main().catch((err) => {
  console.error('Build failed:', err)
  process.exit(1)
})
