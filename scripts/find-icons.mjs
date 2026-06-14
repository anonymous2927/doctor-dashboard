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
const icons = new Set()
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8')
  const match = content.match(/import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/)
  if (match) {
    match[1].split(',').forEach(i => icons.add(i.trim().replace(/[\r\n]/g, '')))
  }
}
console.log([...icons].sort().join('\n'))
