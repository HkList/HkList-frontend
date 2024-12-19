import fs from 'fs'

const info = fs.readFileSync('src/utils/http.ts', { encoding: 'utf-8' }).replaceAll('./rand.js', './fingerprint.js')
fs.writeFileSync('src/utils/http.ts', info)
