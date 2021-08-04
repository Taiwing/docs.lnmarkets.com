const fs = require('fs/promises')
const path = require('path')
const converter = require('widdershins')
const SwaggerParser = require('@apidevtools/swagger-parser')

const apiPath = path.join(__dirname, './spec.json')
const slateFile = path.join(__dirname, './_api.md')

const main = async () => {
  try {
    const options = {
      codeSamples: true,
      resolve: true,
      source: apiPath,
      omitHeader: true,
      httpsnippet: true,
      tocSummary: true,
      user_templates: './template',
      language_tabs: [
        { python: 'Python' },
        { 'javascript--node': 'Node.js' },
        { shell: 'Shell' },
      ],
      language_clients: [
        { shell: 'curl' },
        { 'javascript--node': 'native' },
        { python: 'requests' },
      ],
    }

    const raw = await fs.readFile(apiPath, 'utf-8')
    const parsed = JSON.parse(raw)
    const data = await converter.convert(parsed, options)
    await fs.writeFile(slateFile, data)
  } catch (error) {
    console.error(error)
  }
}

main()
