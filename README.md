# 鞠婧祎个人主页

一个纯前端的静态个人主页，展示鞠婧祎的生平经历、代表影视与音乐作品，以及图片相册。包含响应式布局、背景轮播、图片画廊、懒加载、Lightbox 预览、键盘/触摸操作、基础 SEO 与结构化数据等特性。粉丝自制，非官方站点。

- 在线预览（GitHub Pages）：https://moon584.github.io/jjydeweb/
- 仓库地址：https://github.com/moon584/jjydeweb
- 默认分支：main
- 主要语言占比（约）：JavaScript 55.3% · CSS 32.3% · HTML 12.4%

---

## 功能亮点

### 1) 背景轮播（含指示器/自动播放/触摸/键盘）
- 描述：全屏背景轮播，支持左右切换、自动播放、指示器点击、键盘方向键、触摸滑动、悬停暂停。
  
![预览-背景轮播](img/preview-background1.png)
 ![预览-背景轮播](img/preview-background2.png)
 ![预览-背景轮播](img/preview-background3.png)

### 2) 图片画廊轮播（懒加载 + 多列自适应）
- 描述：根据屏幕宽度 1/2/3 列显示，指示器跳转，左右切换。
  
![预览-图片画廊](img/preview-gallery.png)

---

## 目录结构

```text
.
├─ index.html                # 页面结构、SEO/OG/Twitter/JSON-LD 元信息
├─ style.css                 # 样式与响应式设计
├─ script.js                 # 交互逻辑（导航、动画、背景轮播、图集、Lightbox等）
├─ auto_images.js            # 自动生成的图片清单与标题（可选，运行脚本生成）
├─ generate_images.js        # Node 脚本：扫描 img/ 生成 auto_images.js
├─ img/                      # 图片资源（画廊使用）
├─ background/               # 背景轮播图片
└─ README.md
```

---

## 快速开始

1) 克隆或下载项目
```bash
git clone https://github.com/moon584/jjydeweb.git
cd jjydeweb
```

2) 直接用浏览器打开
- 双击 `index.html` 即可在浏览器查看静态页面
- 为了启用部分相对路径或跨源策略下的最佳效果，建议本地启一个静态服务器（见下）

---

## 本地开发与预览（可选）

任选一种方式在项目根目录启动静态服务器：

- 使用 VS Code 插件：Live Server（右键 index.html → Open with Live Server）
- 使用 Node 工具：
  ```bash
  npx serve .         # 或
  npx http-server .   # 需先安装：npm i -g http-server
  ```
- 使用 Python：
  ```bash
  # Python 3
  python -m http.server 5173
  # 然后访问 http://localhost:5173
  ```

---

## 图片资源与自动清单

本项目支持自动扫描 `img/` 文件夹并生成 `auto_images.js`，页面将优先使用该自动清单渲染画廊与标题说明。

1) 准备图片
- 将图片放入 `img/`，支持扩展名：`.jpg .jpeg .png .gif .webp .bmp`

2) 准备 nodejs 环境, 方式很多, 自己选择

3) 生成清单
```bash
node generate_images.js
```

4) 生成结果
- 会生成或覆盖 `auto_images.js`，包含：
  - `window.AUTO_IMAGE_LIST`：图片文件名数组（按修改时间倒序）
  - `window.AUTO_IMAGE_CAPTIONS`：为每张图片智能生成的标题
- 页面加载时若检测到上述全局变量，会自动使用清单并合并标题

5) 失败/缺省回退
- 若未生成 `auto_images.js`，页面会回退到内置的备用文件名清单

---

## 自定义与配置

- 背景轮播图片
  - 在 `script.js` 中修改以下数组（默认读取 `background/`）：
  ```js
  const backgroundImages = [
    'background/your_image_1.png',
    'background/your_image_2.jpg',
    'background/your_image_3.webp'
  ];
  // 也可调整播放间隔（毫秒），例如：new BackgroundSlideshow(backgroundImages, 6000);
  ```

- 画廊布局
  - `GallerySlideshow` 会根据屏幕宽度动态决定每屏显示数量（>=992px 显示3张，>=768px 显示2张，否则1张）

- SEO/社交分享
  - 在 `index.html` 中根据需要修改：
    - `<title>`、`<meta name="description">`、`<link rel="canonical">`
    - Open Graph（`og:title/description/url/image`）
    - Twitter Card
    - JSON-LD（Person）中的 `sameAs` 链接与头像封面地址

- 文案与时间线
  - 在 `index.html` 中找到“个人经历”“影视作品”等区块直接编辑列表项

---

## 部署（GitHub Pages）

1) 推送到 GitHub 仓库的 `main` 分支
2) 开启 Pages
   - 进入仓库 → Settings → Pages
   - Source 选择 `Deploy from a branch`
   - Branch 选择 `main`，Folder 选择 `/ (root)` → Save
3) 访问地址
   - 预计为：https://moon584.github.io/jjydeweb/
   - 首次启用可能需要数分钟生效

部署到其他静态托管（如 Netlify、Vercel、Cloudflare Pages）也非常方便：直接选择该仓库并将根目录作为构建/输出目录即可（本项目无构建步骤）。

---

## 可访问性与性能要点

- 可访问性（a11y）
  - 可聚焦的“跳到主要内容”链接
  - 合理的 landmark（header/main/footer）与语义化标签
  - 轮播、Lightbox 提供键盘与触摸操作
- 性能
  - 图片懒加载、必要资源预加载（字体）
  - 简洁的原生 JS 与 CSS，零依赖、首屏快

---

## 技术栈

- HTML5 + CSS3 + 原生 JavaScript
- 无打包/构建依赖，开箱即用

---

## 免责声明

- 本项目为粉丝自发制作的学习与交流用途的静态页面，非官方站点。
- 页面所涉人物、相关图片与素材版权归原作者或权利方所有，如有不妥请联系移除。

---

## 许可证

当前仓库未设置开源许可证。若需要开放使用，建议添加如 MIT/Apache-2.0 等合适的 LICENSE 文件。

---

若需我继续：
- 批量添加并压缩预览图（docs/），或
- 配置 GitHub Actions 自动部署/图片优化
请告诉我你的偏好。
