const { join } = require('path')
const { promises, writeFileSync } = require('fs')
const { mdToPdf } = require('md-to-pdf')

const { readdir } = promises

const [path] = process.argv.slice(2)

const dirPath = join(__dirname, path || '.')
readdir(dirPath).then(files => {
  files.forEach(file => console.log(file))
}).catch(ex => {
  console.error(ex)
  process.exit()
})

/* if (!path) {
  console.warn(`The path must be passed as the first CLI parameter`)
  process.exit()
} */

if (false) {
  mdToPdf({ path }).then(pdf => {
    if (pdf) {
      writeFileSync(pdf.filename, pdf.content)
    }
  }).catch(ex => {
    console.error(ex)
    process.exit()
  })
}
