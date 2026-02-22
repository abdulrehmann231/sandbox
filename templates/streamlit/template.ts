import { Template } from 'e2b'
import path from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dockerfile = readFileSync(path.resolve(__dirname, 'e2b.Dockerfile'), 'utf-8')

export const template = Template({
  fileContextPath: path.resolve(__dirname),
  fileIgnorePatterns: [".git", ".gitignore", ".dockerignore", ".env", "e2b*", "node_modules", "template.ts", "build-template.sh"],
})
  .fromDockerfile(dockerfile)
