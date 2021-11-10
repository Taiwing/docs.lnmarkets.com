const fs = require('fs/promises')
const path = require('path')

const apiPath = path.join(__dirname, './spec.json')

const main = async () => {
  try {
    const raw = await fs.readFile(apiPath, 'utf-8')
    const spec = JSON.parse(raw)

    spec.info.description = { $ref: './description.md' }

    await fs.writeFile(apiPath, JSON.stringify(spec, null, 2))
  } catch (error) {
    console.error(error)
  }
}

main()
