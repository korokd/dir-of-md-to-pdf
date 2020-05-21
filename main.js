const { join, normalize, isAbsolute } = require('path')
const { readdir, readFile, unlink, writeFile } = require('fs').promises
const { mdToPdf } = require('md-to-pdf')

const TEMP_FILE_PREFIX = 'temp_markdown_to_make_pdf'
const OUT_FILE_PREFIX = 'pdf_from_md'

const args = process.argv.slice(2)
const [path = '.'] = args

const dirPath = isAbsolute(path) ? normalize(path) : join(__dirname, path)
const [_, dest = dirPath] = args

;(async () => {
  const files = await readdir(dirPath)
  const mdFilesFullPaths = files.filter(file => /\.md$/.test(file)).map(file => `${path}/${file}`)
  const mdFilesContents = await Promise.all(
    mdFilesFullPaths.map(fullPath => readFile(fullPath, { encoding: 'utf-8' }))
  )
  const mergedChaptersContent = mdFilesContents.join('\n<div class="page-break"></div>\n')

  const tempFileName = `${TEMP_FILE_PREFIX}-${Date.now()}.md`
  await writeFile(tempFileName, mergedChaptersContent)

  const pdfFullPath = `${normalize(dest)}${OUT_FILE_PREFIX}${Date.now()}.pdf`
  
  const pdf = await mdToPdf({ path: tempFileName })

  if (pdf) {
    await writeFile(pdfFullPath, pdf.content)

    console.info(`PDF created at ${pdfFullPath}`)
  }

  await unlink(tempFileName)

  process.exit()
})()

