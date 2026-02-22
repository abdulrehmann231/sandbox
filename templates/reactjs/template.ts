import { Template } from 'e2b'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const template = Template({
  fileContextPath: path.resolve(__dirname),
  fileIgnorePatterns: [".*", "e2b*", "node_modules", "template.ts", "Dockerfile"],
})
  .fromTemplate("gitwit-base")
  .setWorkdir("/home/user/project")
  .copy(".", "/home/user/project/")
  .runCmd("npm install")
