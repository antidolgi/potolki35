/**
 * main.js
 * Инициализация плавного скролла (Lenis),
 * глобальные ScrollTrigger-анимации,
 * управление бургер-меню.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ========== LENIS (плавный скролл) ==========
const lenis = new Lenis({
  lerp: 0.08,            // ОЧЕНЬ быстрый отклик (0.1 — стандарт, 0.07 — ещё резвее)
  wheelMultiplier: 1.2,  // чуть ускоряем колёсико
  touchMultiplier: 2.5,  // тачпад быстрее
  smoothWheel: true,     // обязательно
  smoothTouch: true,     // для телефонов
  direction: 'vertical',
  gestureDirection: 'vertical',
});
  // Внутри того же DOMContentLoaded, после создания lenis:
window.addEventListener('wheel', (e) => {
  // Если пользователь крутит очень быстро — отдаём управление нативному скроллу на долю секунды
  if (Math.abs(e.deltaY) > 100) {
    lenis.stop();
    setTimeout(() => lenis.start(), 50);
  }
}, { passive: true });

  // Интеграция с GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // ========== SCROLL ANIMATIONS (fade-blur) ==========
  const animatedElements = document.querySelectorAll('.fade-blur');

  animatedElements.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, filter: 'blur(10px)', y: 30 },
      {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 1.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
          // markers: true, // для отладки
        }
      }
    );
  });

  // ========== BURGER MENU ==========
  const burger = document.getElementById('burger');
  const navList = document.getElementById('nav-list');
  const navLinks = navList.querySelectorAll('.nav__link');

  burger.addEventListener('click', () => {
    navList.classList.toggle('active');
    burger.classList.toggle('active');
  });

  // Закрытие меню при клике на ссылку
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('active');
      burger.classList.remove('active');
    });
  });

  // ========== ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ ПРИ СКРОЛЛЕ (опционально) ==========
  // Можно добавить позже, если нужно.

});
