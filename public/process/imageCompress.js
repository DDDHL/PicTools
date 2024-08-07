const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
let concurrence = 5; // 控制并发数量

async function compressImage(imageConfig, config) {
  try {
    // 图片压缩失败
    process.send({
      type: 'compressing',
      data: {
        ...imageConfig,
      }
    })
    if(typeof config.resolution !=='number') config.resolution = undefined
    // 使用 sharp 压缩图片
    const image = sharp(imageConfig.path).resize(config.resolution);
    const ext = path.extname(imageConfig.path).toLowerCase();

    // 获取输出文件路径
    let outputFilePath = path.join(config.outputDir, path.basename(imageConfig.path));
    if (config.isCache) {
      // 略缩图缓存
      outputFilePath = path.join(config.outputDir, imageConfig.id) + ext;
    }else if(config.outputName){
      // 常规名称压缩
      outputFilePath = outputFilePath.split(ext)[0] + config.outputName + ext
    }

    // 处理不同格式的图片
    switch (ext) {
      case '.jpeg':
      case '.jpg':
        await image.jpeg({ quality: config.quality }).toFile(outputFilePath);
        break;
      case '.png':
        await image.png({ quality: config.quality }).toFile(outputFilePath);
        break;
      case '.webp':
        await image.webp({ quality: config.quality }).toFile(outputFilePath);
        break;
      default:
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
        compressSize: compressedSize,
        compressExportPath:config.isCache?'':outputFilePath,
        compressCachePath: config.isCache ? outputFilePath : imageConfig.compressCachePath
      }
    })

  } catch (error) {
    console.log(error)
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
    if (promises.length >= concurrence) {
      await Promise.all(promises);
      promises.length = 0; // 清空数组
    }
  }
  // 处理剩余的任务
  await Promise.all(promises);
}

process.on('message', async (config) => {
  if (config.concurrence) concurrence = config.concurrence
  // 执行图片处理
  processImages(config)
    .then(() => {
      console.log('All images have been processed.');
    })
    .catch((error) => {
      console.error('Error processing images:', error);
    }).finally(() => {
      process.send({
        type: 'finish',
        data: {}
      })
    })
})
