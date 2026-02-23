import { Template } from 'e2b'

export const template = Template()
  .fromNodeImage("20")
  .runCmd("sudo apt-get update && sudo apt-get install -y git curl ripgrep fzf && sudo rm -rf /var/lib/apt/lists/*")
  .runCmd("sudo npm install -g opencode-ai@latest @anthropic-ai/claude-code@latest")
