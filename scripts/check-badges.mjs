import fs from 'fs'
import path from 'path'

const src = 'src'
const files = []
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(p)
    else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) files.push(p)
  }
}
walk(src)
const valid = ['default','secondary','destructive','outline','success','warning']
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8')
  const re = /Badge\s+variant\s*=\s*["']([^"']+)["']/g
  let m
  while ((m = re.exec(content)) !== null) {
    if (!valid.includes(m[1])) {
      console.log(`${f}: "${m[1]}" is invalid`)
    }
  }
}
