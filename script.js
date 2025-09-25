// 平滑滚动与导航高亮
document.querySelectorAll('nav a').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) {
      e.preventDefault();
      const section = document.querySelector(href);
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');
window.addEventListener('scroll', () => {
  sections.forEach(s => {
    const rect = s.getBoundingClientRect();
    if (rect.top <= 150 && rect.bottom >= 150) {
      const id = s.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
});

// 移动端菜单
const toggleBtn = document.querySelector('.nav__toggle');
const menu = document.querySelector('#nav-menu');
if (toggleBtn && menu){
  toggleBtn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', String(open));
  });
}

// 懒加载：将 data-src 替换为 src
const lazyImgs = document.querySelectorAll('img[data-src]');
if ('IntersectionObserver' in window){
  const io = new IntersectionObserver((entries, obs)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting){
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  lazyImgs.forEach(img=>io.observe(img));
} else {
  // 回退
  lazyImgs.forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
}

// 滚动出现动画
const revealEls = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window){
  const ro = new IntersectionObserver((entries, obs)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting){
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold:0.1 });
  revealEls.forEach(el=>ro.observe(el));
} else {
  revealEls.forEach(el=>el.classList.add('visible'));
}

// 图库图片预览
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
document.querySelectorAll('.image-card img').forEach(img=>{
  img.addEventListener('click', ()=>{
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.nextElementSibling?.textContent || '';
    lightbox.removeAttribute('hidden');
  });
});
lightbox?.addEventListener('click', e=>{
  if (e.target === lightbox || e.target.classList.contains('lightbox__close')){
    lightbox.setAttribute('hidden','');
    lightboxImg.src = '';
  }
});
document.addEventListener('keydown', e=>{
  if (e.key === 'Escape' && !lightbox.hasAttribute('hidden')){
    lightbox.setAttribute('hidden','');
    lightboxImg.src = '';
  }
});

// 返回顶部按钮与年份
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', ()=>{
  if (window.scrollY > 600){ backToTop.classList.add('show'); }
  else { backToTop.classList.remove('show'); }
});
backToTop?.addEventListener('click', ()=> window.scrollTo({ top:0, behavior:'smooth' }));

document.getElementById('year').textContent = new Date().getFullYear();

// 背景图片轮换系统
const backgroundImages = [
  'img/IMG_20250925_180952.png',
  'img/IMG_20250925_181006.png', // 修正文件名
  'img/com.xingin.xhs_20250925175232_edit_85031475649432.png'
];

class BackgroundSlideshow {
  constructor(images, interval = 5000) {
    this.images = images;
    this.validImages = []; // 存储有效的图片
    this.currentIndex = 0;
    this.interval = interval;
    this.autoPlayTimer = null;
    this.isAutoPlay = true;
    
    this.body = document.body;
    this.prevBtn = document.getElementById('prevBg');
    this.nextBtn = document.getElementById('nextBg');
    this.indicatorsContainer = document.getElementById('bgIndicators');
    
    this.validateImages().then(() => {
      this.init();
    });
  }
  
  // 验证图片是否可以加载
  async validateImages() {
    const promises = this.images.map(src => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ src, valid: true });
        img.onerror = () => {
          console.warn(`背景图片加载失败: ${src}`);
          resolve({ src, valid: false });
        };
        img.src = src;
      });
    });
    
    const results = await Promise.all(promises);
    this.validImages = results.filter(result => result.valid).map(result => result.src);
    
    if (this.validImages.length === 0) {
      console.error('没有有效的背景图片可以显示');
      return;
    }
    
    if (this.validImages.length < this.images.length) {
      console.info(`成功加载 ${this.validImages.length}/${this.images.length} 张背景图片`);
    }
  }
  
  init() {
    if (!this.body.classList.contains('bg-slideshow') || this.validImages.length === 0) return;
    
    this.createIndicators();
    this.updateBackground();
    this.bindEvents();
    this.startAutoPlay();
  }
  
  createIndicators() {
    this.indicatorsContainer.innerHTML = '';
    this.validImages.forEach((_, index) => {
      const indicator = document.createElement('div');
      indicator.className = 'bg-indicator';
      indicator.setAttribute('data-index', index);
      if (index === 0) indicator.classList.add('active');
      
      indicator.addEventListener('click', () => {
        this.goToSlide(index);
      });
      
      this.indicatorsContainer.appendChild(indicator);
    });
  }
  
  updateBackground() {
    if (this.validImages.length > 0) {
      this.body.style.backgroundImage = `url('${this.validImages[this.currentIndex]}')`;
      this.updateIndicators();
    }
  }
  
  updateIndicators() {
    const indicators = this.indicatorsContainer.querySelectorAll('.bg-indicator');
    indicators.forEach((indicator, index) => {
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
      this.autoPlayTimer = setInterval(() => {
        this.nextSlide();
      }, this.interval);
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
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.nextSlide();
      }
    });
    
    // 鼠标悬停时暂停自动播放
    this.body.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.body.addEventListener('mouseleave', () => this.startAutoPlay());
  }
  
  // 动态更新图片数组的方法
  async updateImages(newImages) {
    this.images = newImages;
    this.currentIndex = 0;
    await this.validateImages();
    if (this.validImages.length > 0) {
      this.createIndicators();
      this.updateBackground();
      this.resetAutoPlay();
    }
  }
  
  // 设置自动播放间隔
  setInterval(newInterval) {
    this.interval = newInterval;
    this.resetAutoPlay();
  }
  
  // 切换自动播放
  toggleAutoPlay() {
    this.isAutoPlay = !this.isAutoPlay;
    if (this.isAutoPlay) {
      this.startAutoPlay();
    } else {
      this.stopAutoPlay();
    }
  }
}

// 初始化背景轮播
const bgSlideshow = new BackgroundSlideshow(backgroundImages, 5000);