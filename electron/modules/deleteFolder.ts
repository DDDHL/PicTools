import fs from 'fs'
import path from 'path'

export const deleteFolderRecursive = (dirPath: string): Promise<void> => {
  const errors: NodeJS.ErrnoException[] = []
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        errors.push(err)
        return reject(err)
      }

      const promises = files.map((file) => {
        return new Promise((resolve, reject) => {
          const curPath = path.join(dirPath, file)
          fs.lstat(curPath, (err, stats) => {
            if (err) {
              errors.push(err)
              return reject(err)
            }

            if (stats.isDirectory()) {
              deleteFolderRecursive(curPath).then(resolve).catch(reject)
            } else {
              fs.unlink(curPath, (err) => {
                if (err) {
                  errors.push(err)
                  return reject(err)
                }
                resolve(undefined)
              })
            }
          })
        })
      })

      Promise.all(promises).then(() => {
        fs.rmdir(dirPath, (err) => {
          if (err) {
            errors.push(err)
            reject(err)
          } else {
            resolve(undefined)
          }
        })
      })
    })
  })
}
