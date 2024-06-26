const fs = require('fs')
const path = require('path')

const cacheDir = path.join(__dirname, 'public', 'cache')

fs.rm(cacheDir, { recursive: true, force: true }, (err) => {
  if (err) {
    console.error(`Error while deleting ${cacheDir}.`, err)
  } else {
    console.log(`${cacheDir} is deleted successfully.`)
  }
})
