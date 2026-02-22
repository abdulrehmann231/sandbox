import { Template } from 'e2b'
import path from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dockerfile = readFileSync(path.resolve(__dirname, 'e2b.Dockerfile'), 'utf-8')

export const template = Template({
  fileContextPath: path.resolve(__dirname),
  fileIgnorePatterns: [".*", "e2b*", "node_modules", "template.ts"],
})
  .fromDockerfile(dockerfile)
  .setStartCmd("sudo apachectl -D FOREGROUND")
