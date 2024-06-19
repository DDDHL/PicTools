import * as fs from 'fs'
import * as crypto from 'crypto'

interface FileId {
  path: string
  id: string
}

const generateUniqueId = (filePath: string): Promise<FileId> => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256')
    const stream = fs.createReadStream(filePath)

    stream.on('data', (data) => {
      hash.update(data)
    })

    stream.on('end', () => {
      const uniqueId = hash.digest('hex')
      resolve({ path: filePath, id: uniqueId })
    })

    stream.on('error', (err) => {
      reject(err)
    })
  })
}

export const generateUniqueIds = async (
  filePaths: string[]
): Promise<FileId[]> => {
  const results: FileId[] = []
  for (const filePath of filePaths) {
    try {
      const result = await generateUniqueId(filePath)
      results.push(result)
    } catch (err) {
      console.error(`错误处理文件 ${filePath}:`, err)
    }
  }
  return results
}
