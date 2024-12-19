import fs from 'fs'

const info = fs.readFileSync('src/utils/http.ts', { encoding: 'utf-8' }).replaceAll('./fingerprint.js', './rand.js')
fs.writeFileSync('src/utils/http.ts', info)
