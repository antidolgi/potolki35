/**
 * main.js
 * Инициализация плавного скролла (Lenis),
 * глобальные ScrollTrigger-анимации,
 * управление бургер-меню,
 * подсветка активного пункта меню.
 */
document.addEventListener('DOMContentLoaded', () => {

  // ========== LENIS (плавный скролл) ==========
  const lenis = new Lenis({
    lerp: 0.08,            // быстрый отклик, почти нативный
    wheelMultiplier: 1.2,  // ускоряем колёсико
    touchMultiplier: 2.5,  // тачпад быстрее
    smoothWheel: true,
    smoothTouch: true,
    direction: 'vertical',
    gestureDirection: 'vertical',
  });

  // Интеграция с GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Никаких остановок lenis при быстром скролле — это вызывало рывки!

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

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('active');
      burger.classList.remove('active');
    });
  });

  // ========== ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ ==========
  const sections = document.querySelectorAll('section[id]');
  if (sections.length && navLinks.length) {
    const scrollSpy = () => {
      let currentId = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
          currentId = section.getAttribute('id');
        }
      });
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    };
    window.addEventListener('scroll', scrollSpy, { passive: true });
    scrollSpy(); // вызываем сразу
  }

});
