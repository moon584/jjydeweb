// 🎨 优化版主脚本文件 - 鞠婧祎个人主页
// 包含：导航、动画、背景轮播、图片画廊等功能

// =============================================
// 🧭 导航系统
// =============================================

// 平滑滚动与导航高亮
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href?.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  });
});

// 滚动时更新导航高亮
const updateNavigation = () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');
  
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 150 && rect.bottom >= 150) {
      const id = section.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
};

window.addEventListener('scroll', updateNavigation);

// 移动端菜单切换
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('#nav-menu');
navToggle?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// =============================================
// 🎬 图片懒加载与动画
// =============================================

// 懒加载图片
const setupLazyLoading = () => {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // 降级方案
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
};

// 滚动显示动画
const setupRevealAnimation = () => {
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }
};

// =============================================
// 🖼️ Lightbox 图片预览
// =============================================

const setupLightbox = () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  
  if (!lightbox || !lightboxImg || !lightboxCaption) return;
  
  // 点击图片打开lightbox
  document.addEventListener('click', e => {
    const img = e.target.closest('.image-card img');
    if (img) {
      lightboxImg.src = img.src || img.dataset.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = img.nextElementSibling?.textContent || '';
      lightbox.removeAttribute('hidden');
    }
  });
  
  // 关闭lightbox
  const closeLightbox = () => {
    lightbox.setAttribute('hidden', '');
    lightboxImg.src = '';
  };
  
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox || e.target.classList.contains('lightbox__close')) {
      closeLightbox();
    }
  });
  
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !lightbox.hasAttribute('hidden')) {
      closeLightbox();
    }
  });
};

// =============================================
// 🔝 返回顶部按钮
// =============================================

const setupBackToTop = () => {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;
  
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 600);
  });
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

// =============================================
// 🌅 背景轮播系统
// =============================================

class BackgroundSlideshow {
  constructor(images, interval = 5000) {
    this.images = images;
    this.validImages = [];
    this.currentIndex = 0;
    this.interval = interval;
    this.autoPlayTimer = null;
    this.isAutoPlay = true;
    
    this.body = document.body;
    this.prevBtn = document.getElementById('prevBg');
    this.nextBtn = document.getElementById('nextBg');
    this.indicatorsContainer = document.getElementById('bgIndicators');
    
    this.init();
  }
  
  async init() {
    await this.validateImages();
    if (this.validImages.length > 0) {
      this.createIndicators();
      this.updateBackground();
      this.bindEvents();
      this.startAutoPlay();
    }
  }
  
  async validateImages() {
    const promises = this.images.map(src => 
      new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve({ src, valid: true });
        img.onerror = () => {
          console.warn(`背景图片加载失败: ${src}`);
          resolve({ src, valid: false });
        };
        img.src = src;
      })
    );
    
    const results = await Promise.all(promises);
    this.validImages = results.filter(r => r.valid).map(r => r.src);
    
    if (this.validImages.length === 0) {
      console.error('没有有效的背景图片');
    } else if (this.validImages.length < this.images.length) {
      console.info(`成功加载 ${this.validImages.length}/${this.images.length} 张背景图片`);
    }
  }
  
  createIndicators() {
    if (!this.indicatorsContainer) return;
    
    this.indicatorsContainer.innerHTML = '';
    this.validImages.forEach((_, index) => {
      const indicator = document.createElement('div');
      indicator.className = 'bg-indicator';
      indicator.setAttribute('data-index', index);
      if (index === 0) indicator.classList.add('active');
      
      indicator.addEventListener('click', () => this.goToSlide(index));
      this.indicatorsContainer.appendChild(indicator);
    });
  }
  
  updateBackground() {
    if (this.validImages.length === 0) return;
    this.body.style.backgroundImage = `url('${this.validImages[this.currentIndex]}')`;
    this.updateIndicators();
  }
  
  updateIndicators() {
    const indicators = this.indicatorsContainer?.querySelectorAll('.bg-indicator');
    indicators?.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
    });
  }
  
  goToSlide(index) {
    this.currentIndex = index;
    this.updateBackground();
    this.resetAutoPlay();
  }
  
  nextSlide() {
    if (this.validImages.length <= 1) return;
    this.currentIndex = (this.currentIndex + 1) % this.validImages.length;
    this.updateBackground();
    this.resetAutoPlay();
  }
  
  prevSlide() {
    if (this.validImages.length <= 1) return;
    this.currentIndex = (this.currentIndex - 1 + this.validImages.length) % this.validImages.length;
    this.updateBackground();
    this.resetAutoPlay();
  }
  
  startAutoPlay() {
    if (this.isAutoPlay && this.validImages.length > 1) {
      this.autoPlayTimer = setInterval(() => this.nextSlide(), this.interval);
    }
  }
  
  stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }
  
  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
  
  bindEvents() {
    this.prevBtn?.addEventListener('click', () => this.prevSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());
    
    // 键盘控制
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.nextSlide();
      }
    });
    
    // 触摸滑动
    if ('ontouchstart' in window) {
      let startX = 0, startY = 0;
      
      this.body.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }, { passive: true });
      
      this.body.addEventListener('touchend', e => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
          if (diffX > 0) this.nextSlide();
          else this.prevSlide();
        }
      }, { passive: true });
    }
    
    // 响应式优化
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      this.setInterval(isMobile ? 6000 : 5000);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // 桌面设备悬停暂停
    if (!('ontouchstart' in window)) {
      this.body.addEventListener('mouseenter', () => this.stopAutoPlay());
      this.body.addEventListener('mouseleave', () => this.startAutoPlay());
    }
  }
  
  setInterval(newInterval) {
    this.interval = newInterval;
    this.resetAutoPlay();
  }
}

// =============================================
// 🎠 图片画廊轮播系统
// =============================================

class GallerySlideshow {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;
    
    this.slider = this.container.querySelector('.gallery-slider');
    this.prevBtn = this.container.querySelector('.gallery-btn--prev');
    this.nextBtn = this.container.querySelector('.gallery-btn--next');
    this.indicatorsContainer = this.container.querySelector('.gallery-indicators');
    this.loadingElement = this.container.querySelector('.gallery-loading');
    
    this.images = [];
    this.cards = [];
    this.currentIndex = 0;
    this.itemsToShow = this.getItemsToShow();
    this.totalSlides = 0;
    
    // 默认图片标题
    this.imageCaptions = {
      'com.xingin.xhs_20250925174526.png': '舞台演出',
      'com.xingin.xhs_20250925174545.png': '剧照',
      'com.xingin.xhs_20250925174623.png': '红毯',
      'com.xingin.xhs_20250925174637.png': '写真',
      'com.xingin.xhs_20250925175232_edit_85031475649432.png': '精彩瞬间',
      'IMG_20250925_180952.png': '美丽时刻',
      'IMG_20250925_181006.png': '帅气瞬间'
    };
    
    this.loadImages();
  }
  
  async loadImages() {
    this.showLoading();
    
    try {
      const imageFiles = await this.fetchImageList();
      if (imageFiles.length === 0) {
        this.showError('img文件夹中没有找到图片文件');
        return;
      }
      
      const validImages = await this.validateImages(imageFiles);
      if (validImages.length === 0) {
        this.showError('没有找到有效的图片文件');
        return;
      }
      
      this.images = validImages;
      this.createImageElements();
      this.hideLoading();
      this.init();
      
    } catch (error) {
      console.error('加载图片时出错:', error);
      this.showError('图片加载失败');
    }
  }
  
  async fetchImageList() {
    // 优先使用自动生成的图片列表
    if (window.AUTO_IMAGE_LIST?.length) {
      console.log('✅ 使用自动生成的图片列表');
      
      // 合并智能标题
      if (window.AUTO_IMAGE_CAPTIONS) {
        Object.assign(this.imageCaptions, window.AUTO_IMAGE_CAPTIONS);
        console.log('✅ 已加载智能生成的图片标题');
      }
      
      return window.AUTO_IMAGE_LIST;
    }
    
    // 备用图片列表
    console.warn('⚠️ 使用备用图片列表');
    return Object.keys(this.imageCaptions);
  }
  
  async validateImages(imageFiles) {
    const promises = imageFiles.map(fileName => 
      new Promise(resolve => {
        const img = new Image();
        const imagePath = `img/${fileName}`;
        
        img.onload = () => resolve({
          path: imagePath,
          fileName,
          valid: true,
          alt: `精彩照片 - ${fileName.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')}`,
          caption: this.imageCaptions[fileName] || this.generateCaption(fileName)
        });
        
        img.onerror = () => {
          console.warn(`图片加载失败: ${imagePath}`);
          resolve({ path: imagePath, fileName, valid: false });
        };
        
        img.src = imagePath;
      })
    );
    
    const results = await Promise.all(promises);
    return results.filter(r => r.valid);
  }
  
  generateCaption(fileName) {
    const name = fileName.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
    if (name.includes('IMG')) return '精彩瞬间';
    if (name.includes('xhs')) return '美丽时刻';
    return '精彩照片';
  }
  
  createImageElements() {
    this.slider.innerHTML = '';
    
    this.images.forEach(imageData => {
      const figure = document.createElement('figure');
      figure.className = 'image-card';
      
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.src = imageData.path;
      img.alt = imageData.alt;
      img.width = 800;
      img.height = 600;
      
      const caption = document.createElement('figcaption');
      caption.textContent = imageData.caption;
      
      figure.appendChild(img);
      figure.appendChild(caption);
      this.slider.appendChild(figure);
    });
    
    this.cards = this.slider.querySelectorAll('.image-card');
    this.totalSlides = Math.ceil(this.cards.length / this.itemsToShow);
  }
  
  getItemsToShow() {
    const width = window.innerWidth;
    if (width >= 992) return 3;
    if (width >= 768) return 2;
    return 1;
  }
  
  init() {
    if (this.cards.length === 0) return;
    
    this.createIndicators();
    this.updateSlider();
    this.bindEvents();
    
    window.addEventListener('resize', () => {
      const newItemsToShow = this.getItemsToShow();
      if (newItemsToShow !== this.itemsToShow) {
        this.itemsToShow = newItemsToShow;
        this.totalSlides = Math.ceil(this.cards.length / this.itemsToShow);
        this.currentIndex = Math.min(this.currentIndex, this.totalSlides - 1);
        this.createIndicators();
        this.updateSlider();
      }
    });
  }
  
  createIndicators() {
    if (!this.indicatorsContainer) return;
    
    this.indicatorsContainer.innerHTML = '';
    for (let i = 0; i < this.totalSlides; i++) {
      const indicator = document.createElement('div');
      indicator.className = 'gallery-indicator';
      indicator.setAttribute('data-index', i);
      if (i === 0) indicator.classList.add('active');
      
      indicator.addEventListener('click', () => this.goToSlide(i));
      this.indicatorsContainer.appendChild(indicator);
    }
  }
  
  updateSlider() {
    if (!this.slider || this.cards.length === 0) return;
    
    const translateX = -(this.currentIndex * 100);
    this.slider.style.transform = `translateX(${translateX}%)`;
    this.updateIndicators();
  }
  
  updateIndicators() {
    const indicators = this.indicatorsContainer?.querySelectorAll('.gallery-indicator');
    indicators?.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
    });
  }
  
  goToSlide(index) {
    this.currentIndex = Math.max(0, Math.min(index, this.totalSlides - 1));
    this.updateSlider();
  }
  
  nextSlide() {
    if (this.currentIndex < this.totalSlides - 1) {
      this.currentIndex++;
      this.updateSlider();
    }
  }
  
  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateSlider();
    }
  }
  
  bindEvents() {
    this.prevBtn?.addEventListener('click', () => this.prevSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());
    
    // 键盘控制（仅在画廊可见时）
    document.addEventListener('keydown', e => {
      if (this.isInViewport()) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prevSlide();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.nextSlide();
        }
      }
    });
    
    // 触摸滑动
    if ('ontouchstart' in window && this.container) {
      let startX = 0, startY = 0;
      
      this.container.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }, { passive: true });
      
      this.container.addEventListener('touchend', e => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
          if (diffX > 0) this.nextSlide();
          else this.prevSlide();
        }
      }, { passive: true });
    }
  }
  
  isInViewport() {
    if (!this.container) return false;
    const rect = this.container.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }
  
  showLoading() {
    if (this.loadingElement) this.loadingElement.style.display = 'block';
  }
  
  hideLoading() {
    if (this.loadingElement) this.loadingElement.style.display = 'none';
  }
  
  showError(message) {
    if (this.loadingElement) {
      this.loadingElement.innerHTML = `<p style="color: #ff6b6b;">⚠️ ${message}</p>`;
    }
  }
}

// =============================================
// 🚀 初始化所有功能
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  // 设置年份
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // 初始化所有功能
  setupLazyLoading();
  setupRevealAnimation();
  setupLightbox();
  setupBackToTop();
  
  // 初始化背景轮播（使用用户的background文件夹）
  const backgroundImages = [
    'background/IMG_20250925_180952.png',
    'background/IMG_20250925_181006.png',
    'background/com.xingin.xhs_20250925175232_edit_85031475649432.png'
  ];
  
  new BackgroundSlideshow(backgroundImages, 5000);
  
  // 初始化图片画廊轮播
  new GallerySlideshow('.gallery-slider-container');
});

// =============================================
// 📱 PWA 支持（未来扩展）
// =============================================

// 检测PWA安装提示
window.addEventListener('beforeinstallprompt', e => {
  console.log('💡 网站可以安装为PWA应用');
  // 这里可以添加安装提示UI
});

console.log('🎉 鞠婧祎个人主页脚本已加载完成！');