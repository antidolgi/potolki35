/**
 * comparison.js
 * Кастомный слайдер «До/После» с плавным разделением.
 * Поддерживает drag мышью и touch-события.
 */
document.addEventListener('DOMContentLoaded', () => {
  const comparisons = document.querySelectorAll('[data-comparison]');
  if (!comparisons.length) return;

  comparisons.forEach(container => {
    const afterImg = container.querySelector('.comp-after');
    const slider = container.querySelector('.comp-slider');
    const handle = container.querySelector('.comp-handle');

    if (!afterImg || !slider) return;

    // Функция обновления позиции
    function setPosition(percent) {
      // Ограничиваем диапазон
      const clamped = Math.min(100, Math.max(0, percent));
      // Обновляем clip-path для изображения "после"
      afterImg.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
      // Синхронизируем ползунок
      slider.value = clamped;
      // Позиционируем ручку
      if (handle) {
        handle.style.left = `${clamped}%`;
      }
    }

    // Обработчики для range input (мышь, клавиатура)
    slider.addEventListener('input', (e) => {
      setPosition(e.target.value);
    });

    // --- Drag & Drop для мыши ---
    let isDragging = false;

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      container.style.cursor = 'ew-resize';
      updateFromMouse(e);
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateFromMouse(e);
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        container.style.cursor = 'ew-resize';
      }
    });

    function updateFromMouse(e) {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = (x / rect.width) * 100;
      setPosition(percent);
    }

    // --- Поддержка touch-событий ---
    container.addEventListener('touchstart', (e) => {
      isDragging = true;
      updateFromTouch(e);
      e.preventDefault();
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      updateFromTouch(e);
      e.preventDefault();
    }, { passive: false });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    function updateFromTouch(e) {
      if (!e.touches.length) return;
      const rect = container.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const percent = (x / rect.width) * 100;
      setPosition(percent);
    }

    // Исходное положение 50%
    setPosition(50);
  });
});
