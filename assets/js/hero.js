/**
 * hero.js
 * Анимация натяжения полотна на главном экране.
 * Использует Lottie для светящейся линии и GSAP для clip-path.
 */
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const bgVideo = hero.querySelector('.hero__bg-video');
  const lottieContainer = document.getElementById('lottie-line');
  const heroContent = hero.querySelector('.hero__content');

  // --- 1. Проверка загрузки видео, фолбэк на постер ---
  if (bgVideo) {
    bgVideo.addEventListener('loadeddata', () => {
      // Видео готово, можно начинать анимацию
      startHeroAnimation();
    });
    // Если видео уже загружено (кеш)
    if (bgVideo.readyState >= 2) {
      startHeroAnimation();
    }
    // Если видео не загрузилось за 3 секунды, начинаем без него
    setTimeout(() => {
      if (bgVideo.readyState < 2) {
        startHeroAnimation();
      }
    }, 3000);
  } else {
    // Если видео вообще нет, сразу запуск
    startHeroAnimation();
  }

  function startHeroAnimation() {
    // Если Lottie контейнер существует, инициализируем Lottie
    let lottieAnim = null;
    if (lottieContainer) {
      try {
        lottieAnim = lottie.loadAnimation({
          container: lottieContainer,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          path: '/assets/lottie/glowing-line.json',
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
          }
        });
        lottieAnim.addEventListener('DOMLoaded', () => {
          // Принудительно подгоняем размер
          const svg = lottieContainer.querySelector('svg');
          if (svg) {
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.style.position = 'absolute';
            svg.style.top = '0';
            svg.style.left = '0';
          }
        });
      } catch (e) {
        console.warn('Lottie не загрузилась, используем CSS-анимацию линии', e);
        createFallbackLine();
      }
    } else {
      createFallbackLine();
    }

    // --- 2. Основная GSAP-анимация ---
    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

    // Сначала показываем контейнер линии
    if (lottieContainer) {
      tl.set(lottieContainer, { opacity: 1 });
    }

    // Запускаем Lottie и одновременно анимируем clip-path
    if (lottieAnim) {
      // Запускаем Lottie вручную через GSAP для точной синхронизации
      tl.call(() => lottieAnim.play(), null, 0);
      // Если Lottie длится ~1.5 секунды, подстрахуем
      const lottieDuration = lottieAnim.totalFrames / lottieAnim.frameRate || 2;
      tl.to(hero.querySelector('.hero__bg-video, .hero__bg-image') || hero, {
        // clip-path анимация (если видео, то оно уже есть, иначе может быть картинка)
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: lottieDuration,
        ease: 'power2.inOut'
      }, 0);
    } else {
      // Если нет Lottie, просто анимируем clip-path с диагональной задержкой
      // Предполагаем, что fallback-линия уже создана и анимируется
      tl.to(hero.querySelector('.hero__bg-video, .hero__bg-image') || hero, {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 1.8,
        ease: 'power2.inOut'
      }, 0);
    }

    // Появление контента
    tl.fromTo(heroContent, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
      '-=0.8'
    );

    // Добавляем микро-анимацию логотипа или кнопки (опционально)
    const cta = heroContent.querySelector('.btn');
    if (cta) {
      tl.fromTo(cta, 
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.4)' },
        '-=0.4'
      );
    }
  }

  // --- 3. Фолбэк: создание CSS-линии, если Lottie не загрузилась ---
  function createFallbackLine() {
    if (!lottieContainer) return;
    // Вставляем SVG-линию или div для анимации
    const line = document.createElement('div');
    line.classList.add('hero__fallback-line');
    line.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="0" y1="100" x2="100" y2="0" stroke="url(#goldGradient)" stroke-width="0.5" 
              stroke-dasharray="150" stroke-dashoffset="150" />
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#d4af37" />
            <stop offset="100%" stop-color="#fff" />
          </linearGradient>
        </defs>
      </svg>`;
    lottieContainer.appendChild(line);
    // Анимируем линию с помощью GSAP
    const svgLine = line.querySelector('line');
    gsap.to(svgLine, {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: 'power2.in',
      delay: 0.2
    });
  }
});
