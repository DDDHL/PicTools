const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

async function getFileSize(filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats.size / (1024 * 1024));
      }
    });
  });
}

async function compressImagesChild(imagePaths, outputDir, quality) {
  const result = [];
  await Promise.all(
    imagePaths.map(async (imagePath) => {
      try {
        console.log(`正在处理图片: ${imagePath}`);
        const image = await Jimp.read(imagePath);
        const outputFileName = path.basename(imagePath);
        const outputPath = path.join(outputDir, outputFileName);
        const originalSize = await getFileSize(imagePath);
        console.log(`原始大小: ${originalSize} MB, 输出路径: ${outputPath}`);
        image.quality(quality);
        console.log(`图片质量设置为: ${quality}`);
        await image.writeAsync(outputPath);
        console.log(`图片已压缩并写入: ${outputPath}`);
        const compressedSize = await getFileSize(outputPath);
        console.log(`压缩后大小: ${compressedSize} MB`);
        result.push({
          imageName: outputFileName,
          originalSize,
          compressedSize,
          status: true
        });
      } catch (err) {
        console.error(`压缩图片 ${imagePath} 时出错:`, err);
        result.push({
          imageName: path.basename(imagePath),
          originalSize: null,
          compressedSize: null,
          status: false
        });
      }
      process.send(result.at(-1));
    })
  );
  return result;
}

process.on('message', (message) => {
  console.log('开始压缩')
  compressImagesChild(message.imagePaths,message.outputDir,message.quality)
});
