// 删除本地文字库
export default async function (context) {
  const fs = await import('fs/promises')
  const localeDir = context.appOutDir + '/locales/'

  const files = await fs.readdir(localeDir)
  if (!files.length) return

  for (let file of files) {
    if (!file.startsWith('en') && !file.startsWith('zh')) {
      await fs.unlink(localeDir + file)
    }
  }
}
