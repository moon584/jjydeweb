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