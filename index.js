import { statSync } from "fs"

const paths = ["lib/index.js", "lib/bin.js", "lib/index.d.ts", "package.json", "README.md"]
let size = 0;
for (const path of paths) {
  const stats = statSync(path)
  console.log(`${path}: ${stats.size < 1000 ? stats.size : stats.size / 1000}${stats.size<1000?"B":"KB"}`)
  size += stats.size
}
console.log()
console.log(`Total: ${size} -> ${size < 1000 ? size : size / 1000}${size<1000?"B":"KB"}`)
