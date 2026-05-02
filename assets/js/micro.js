/**
 * micro.js
 * Микровзаимодействия:
 *   - морфинг Lottie-иконок преимуществ при скролле
 *   - лупа на фото карточек фактур (эффект увеличения фрагмента)
 *   - параллакс градиента фона формы при движении мыши
 *   - активация неонового подчёркивания меню (ScrollTrigger)
 */
document.addEventListener('DOMContentLoaded', () => {
  // ========== 1. МОРФИНГ ИКОНОК ПРЕИМУЩЕСТВ ==========
  const advantages = document.querySelectorAll('.advantage[data-lottie-icon]');
  if (advantages.length && window.lottie) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const container = entry.target.querySelector('.advantage__lottie');
          if (container && !container.dataset.lottieInited) {
            const iconSrc = entry.target.dataset.lottieIcon;
            lottie.loadAnimation({
              container: container,
              renderer: 'svg',
              loop: false,
              autoplay: true,
              path: `/assets/lottie/${iconSrc}.json`,
            });
            container.dataset.lottieInited = 'true';
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

    advantages.forEach(adv => observer.observe(adv));
  }

  // ========== 2. ЛУПА НА КАРТОЧКАХ ФАКТУР ==========
  const textureCards = document.querySelectorAll('.texture-card__image img');
  textureCards.forEach(img => {
    const card = img.closest('.texture-card');
    if (!card) return;

    // Создаём элемент лупы
    const lens = document.createElement('div');
    lens.className = 'texture-lens';
    card.appendChild(lens);

    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 768) return; // на тач-устройствах не показываем

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const lensSize = 140;
      const half = lensSize / 2;

      // Позиция лупы
      let lensX = x - half;
      let lensY = y - half;
      lensX = Math.max(0, Math.min(lensX, rect.width - lensSize));
      lensY = Math.max(0, Math.min(lensY, rect.height - lensSize));

      lens.style.left = `${lensX}px`;
      lens.style.top = `${lensY}px`;
      lens.style.display = 'block';

      // Увеличенный фон
      const scale = 2.5;
      const imgSrc = img.src;
      const bgX = -lensX * scale + half;
      const bgY = -lensY * scale + half;
      lens.style.backgroundImage = `url(${imgSrc})`;
      lens.style.backgroundSize = `${rect.width * scale}px ${rect.height * scale}px`;
      lens.style.backgroundPosition = `${bgX}px ${bgY}px`;
    });

    card.addEventListener('mouseleave', () => {
      lens.style.display = 'none';
    });
  });

  // ========== 3. ПАРАЛЛАКС ФОНА ФОРМЫ ==========
  const contactSection = document.getElementById('contacts');
  if (contactSection) {
    const formWrapper = contactSection.querySelector('.contacts__form-wrapper');
    if (formWrapper) {
      contactSection.addEventListener('mousemove', (e) => {
        const rect = contactSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const moveX = (x / rect.width - 0.5) * 15;
        const moveY = (y / rect.height - 0.5) * 15;
        formWrapper.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
      contactSection.addEventListener('mouseleave', () => {
        formWrapper.style.transform = 'translate(0, 0)';
      });
    }
  }

  // ========== 4. АКТИВНЫЙ ПУНКТ МЕНЮ ПО СКРОЛЛУ ==========
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if (sections.length && navLinks.length) {
    const scrollSpy = () => {
      let currentId = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
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
    // Вызовем сразу, чтобы подсветить текущий раздел
    scrollSpy();
  }
});
