const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

async function getFileSize(filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats.size / (1024 * 1024)); // 转换为 MB
      }
    });
  });
}

async function compressImage(imagePath, outputDir, quality) {
  const outputFileName = path.basename(imagePath);
  const outputPath = path.join(outputDir, outputFileName);

  try {
    console.log(`正在处理图片: ${imagePath}`);
    const originalSize = await getFileSize(imagePath);
    console.log(`原始大小: ${originalSize} MB, 输出路径: ${outputPath}`);

    const image = await Jimp.read(imagePath);
    image.quality(quality);
    console.log(`图片质量设置为: ${quality}`);
    
    await image.writeAsync(outputPath);
    console.log(`图片已压缩并写入: ${outputPath}`);

    const compressedSize = await getFileSize(outputPath);
    console.log(`压缩后大小: ${compressedSize} MB`);

    return {
      imageName: outputFileName,
      originalSize,
      compressedSize,
      status: true
    };
  } catch (err) {
    console.error(`压缩图片 ${imagePath} 时出错:`, err);
    return {
      imageName: outputFileName,
      originalSize: null,
      compressedSize: null,
      status: false
    };
  }
}

function limitConcurrency(fn, limit) {
  let activePromises = 0;
  const queue = [];

  const next = () => {
    if (queue.length === 0) {
      return;
    }
    if (activePromises >= limit) {
      return;
    }
    activePromises++;
    const { args, resolve, reject } = queue.shift();
    fn(...args)
      .then(resolve)
      .catch(reject)
      .finally(() => {
        activePromises--;
        next();
      });
  };

  return (...args) => {
    return new Promise((resolve, reject) => {
      queue.push({ args, resolve, reject });
      next();
    });
  };
}

const limitedCompressImage = limitConcurrency(compressImage, 5);

async function compressImagesChild(imagePaths, outputDir, quality) {
  const result = [];
  await Promise.all(
    imagePaths.map(imagePath =>
      limitedCompressImage(imagePath, outputDir, quality).then(res => {
        process.send(res);
        result.push(res);
      })
    )
  );
  return result;
}

process.on('message', (message) => {
  console.log('开始压缩');
  compressImagesChild(message.imagePaths, message.outputDir, message.quality);
});
