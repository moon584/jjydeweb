const fs = require('fs');
const path = require('path');

// 简化配置
const config = {
    imageDir: './img',
    outputFile: 'auto_images.js',
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'],
    sortBy: 'modified' // 按修改时间排序，新图片在前
};

// 读取并处理图片文件
function getImageList() {
    try {
        if (!fs.existsSync(config.imageDir)) {
            console.error('❌ 图片文件夹不存在:', config.imageDir);
            return [];
        }

        const files = fs.readdirSync(config.imageDir);
        const imageFiles = [];
        
        files.forEach(file => {
            const ext = path.extname(file).toLowerCase();
            if (config.allowedExtensions.includes(ext)) {
                const filePath = path.join(config.imageDir, file);
                const stats = fs.statSync(filePath);
                
                imageFiles.push({
                    filename: file,
                    size: stats.size,
                    modified: stats.mtime
                });
            }
        });
        
        // 按修改时间排序（最新的在前）
        return imageFiles.sort((a, b) => b.modified - a.modified);
        
    } catch (error) {
        console.error('❌ 读取图片文件夹时出错:', error.message);
        return [];
    }
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

// 智能生成图片标题
function generateCaption(filename) {
    const name = path.basename(filename, path.extname(filename)).toLowerCase();
    
    // 优先检查具体的文件名关键词
    if (name.includes('舞台') || name.includes('演出')) return '舞台演出';
    if (name.includes('剧照') || name.includes('来战')) return '剧照写真';
    if (name.includes('红毯') || name.includes('造型')) return '红毯造型';
    if (name.includes('美照') || name.includes('写真')) return '个人写真';
    if (name.includes('生活') || name.includes('日常')) return '生活日常';
    if (name.includes('活动') || name.includes('event')) return '活动现场';
    if (name.includes('拍摄') || name.includes('片场')) return '片场花絮';
    if (name.includes('时尚') || name.includes('fashion')) return '时尚大片';
    if (name.includes('街拍') || name.includes('street')) return '街拍造型';
    
    // 检查通用模式
    if (name.includes('img_') || name.includes('img')) return '精彩瞬间';
    if (name.includes('xhs') || name.includes('xiaohongshu')) return '小红书分享';
    if (name.includes('photo')) return '照片集';
    if (name.includes('screenshot') || name.includes('screen')) return '截图记录';
    if (name.match(/\d{8}/)) return '纪念时刻';
    if (name.includes('selfie') || name.includes('自拍')) return '美丽自拍';
    if (name.includes('makeup') || name.includes('妆容')) return '妆容展示';
    if (name.includes('hair') || name.includes('发型')) return '发型造型';
    if (name.includes('dress') || name.includes('裙装')) return '服装搭配';
    
    // 默认标题
    return '美丽时刻';
}

// 主程序
function generateImageList() {
    console.log('🎨 图片列表生成器');
    console.log('='.repeat(30));
    console.log('📁 扫描文件夹:', config.imageDir);
    
    const images = getImageList();
    
    if (images.length === 0) {
        console.log('❌ 没有找到图片文件');
        console.log('💡 请确保图片文件放在 img/ 文件夹中');
        return;
    }
    
    // 统计信息
    const totalSize = images.reduce((sum, img) => sum + img.size, 0);
    
    // 生成数据
    const fileNames = images.map(img => img.filename);
    const captions = {};
    
    images.forEach(img => {
        captions[img.filename] = generateCaption(img.filename);
    });
    
    // 生成JavaScript文件
    const jsContent = `// 🎨 自动生成的图片列表
// 🕒 生成时间: ${new Date().toLocaleString()}
// 📊 图片数量: ${images.length} 张
// 💾 总大小: ${formatFileSize(totalSize)}

window.AUTO_IMAGE_LIST = ${JSON.stringify(fileNames, null, 2)};

window.AUTO_IMAGE_CAPTIONS = ${JSON.stringify(captions, null, 2)};

console.log('🎉 自动图片系统已加载 - 共', window.AUTO_IMAGE_LIST.length, '张图片');
`;
    
    fs.writeFileSync(config.outputFile, jsContent);
    
    console.log('✅ 已生成:', config.outputFile);
    console.log('📊 统计: 共', images.length, '张图片,', formatFileSize(totalSize));
    console.log();
    
    // 显示图片列表
    images.forEach((img, i) => {
        console.log(`${(i + 1).toString().padStart(2)} ${img.filename} (${formatFileSize(img.size)})`);
    });
    
    console.log();
    console.log('🎯 完成！刷新网页即可看到更新');
}

// 执行生成
generateImageList();