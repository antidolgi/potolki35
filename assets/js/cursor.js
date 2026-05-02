/**
 * cursor.js
 * Кастомный курсор-лазерный уровень с длинным шлейфом.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Определяем, нужно ли показывать кастомный курсор
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) return;

  const cursor = document.querySelector('.cursor');
  if (!cursor) return;

  const dot = cursor.querySelector('.cursor__dot');
  const trail = cursor.querySelector('.cursor__trail');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let trailX = mouseX;
  let trailY = mouseY;

  // Позиции для шлейфа и точки
  let currentDotX = mouseX;
  let currentDotY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Увеличение курсора при наведении на кликабельные элементы
  const clickables = document.querySelectorAll('a, button, .btn, input, select, textarea, [role="button"]');
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor--hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--hover');
    });
  });

  function animateCursor() {
    // Точка мгновенно за мышью
    currentDotX += (mouseX - currentDotX) * 0.5;
    currentDotY += (mouseY - currentDotY) * 0.5;
    dot.style.transform = `translate(${currentDotX}px, ${currentDotY}px) translate(-50%, -50%)`;

    // Шлейф плавно тянется
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    trail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Скрываем дефолтный курсор
  document.body.style.cursor = 'none';
  cursor.style.display = 'block';
});
