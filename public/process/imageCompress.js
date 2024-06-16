const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const concurrency = 5; // 控制并发数量

async function compressImage(imageConfig, config) {
  try {
    // 图片压缩失败
    process.send({
      type: 'compressing',
      data: {
       ...imageConfig,
      }
    })

    // 获取输出文件路径
    const outputFilePath = path.join(config.outputDir, path.basename(imageConfig.path));

    // 使用 sharp 压缩图片
    const image = sharp(imageConfig.path).resize(config.resolution);
    const ext = path.extname(imageConfig.path).toLowerCase();

    // 处理不同格式的图片
    if (ext === '.jpeg' || ext === '.jpg') {
      await image.jpeg({ quality: config.quality }).toFile(outputFilePath);
    } else if (ext === '.png') {
      await image.png({ quality: config.quality }).toFile(outputFilePath);
    } else {
      throw new Error(`Unsupported image format: ${ext}`);
    }

    // 获取压缩后的文件大小
    const stats = fs.statSync(outputFilePath);
    const compressedSize = stats.size;

    // 图片压缩成功
    process.send({
      type: 'success',
      data: {
       ...imageConfig,
        compressSize: compressedSize
      }
    })

  } catch (error) {
    // 图片压缩失败
    process.send({
      type: 'error',
      data: {
       ...imageConfig,
      }
    })
  }
}

async function processImages(config) {
  // 创建输出目录如果不存在
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }
  const promises = [];
  for (const imageConfig of config.imagePaths) {
    const promise = compressImage(imageConfig, config);
    promises.push(promise);

    // 控制并发数量
    if (promises.length >= concurrency) {
      await Promise.all(promises);
      promises.length = 0; // 清空数组
    }
  }
  // 处理剩余的任务
  await Promise.all(promises);
}

process.on('message', async (config) => {
  // 执行图片处理
  processImages(config)
    .then(() => {
      console.log('All images have been processed.');
    })
    .catch((error) => {
      console.error('Error processing images:', error);
    });
})
