/**
 * calculator.js
 * Логика калькулятора стоимости:
 *   - динамический пересчёт цены
 *   - анимация смены числа (anime.js)
 *   - инициализация фонового Lottie (частицы)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Элементы DOM
  const widthInput = document.getElementById('width');
  const lengthInput = document.getElementById('length');
  const textureSelect = document.getElementById('texture');
  const extrasCheckboxes = document.querySelectorAll('.extras input[type="checkbox"]');
  const priceValueEl = document.getElementById('price-value');
  const lottieBg = document.getElementById('calculator-lottie');

  if (!widthInput || !lengthInput || !textureSelect || !priceValueEl) return;

  // Базовая цена за кв.м в зависимости от фактуры
  const basePrice = {
    satin: 2800,
    gloss: 3500,
    fabric: 3200,
    photo: 4500,
  };

  // Стоимость дополнительных работ
  const extraCosts = {
    light: 2500,   // встройка светильников
    curve: 5000,   // криволинейный участок
    cornice: 4000, // теневой карниз
  };

  // Текущая отображаемая цена (для анимации)
  let currentPrice = 0;

  // Сохранённый объект анимации (чтобы не накладывать несколько анимаций)
  let activeAnimation = null;

  // Расчёт итоговой стоимости
  function calculatePrice() {
    const width = parseFloat(widthInput.value) || 0;
    const length = parseFloat(lengthInput.value) || 0;
    const area = width * length;
    const texture = textureSelect.value;
    let price = area * (basePrice[texture] || 2800);

    // Добавляем доп. работы
    extrasCheckboxes.forEach(cb => {
      if (cb.checked && extraCosts[cb.value]) {
        price += extraCosts[cb.value];
      }
    });

    return Math.round(price);
  }

  // Анимация перелистывания чисел с anime.js
  function animatePrice(targetPrice) {
    if (activeAnimation) {
      activeAnimation.pause();
    }

    activeAnimation = anime({
      targets: { value: currentPrice },
      value: targetPrice,
      round: 1,
      easing: 'easeOutExpo',
      duration: 700,
      update: (anim) => {
        const val = anim.animations[0].currentValue;
        priceValueEl.textContent = val.toLocaleString('ru-RU');
      },
      complete: () => {
        activeAnimation = null;
      }
    });

    currentPrice = targetPrice;
  }

  // Обновление цены (вызывается при любом изменении)
  function updatePrice() {
    const newPrice = calculatePrice();
    animatePrice(newPrice);
  }

  // Навешиваем слушатели
  [widthInput, lengthInput, textureSelect].forEach(el => {
    el.addEventListener('input', updatePrice);
    el.addEventListener('change', updatePrice);
  });

  extrasCheckboxes.forEach(cb => {
    cb.addEventListener('change', updatePrice);
  });

  // Инициализация фоновой Lottie-анимации для калькулятора
  if (lottieBg && window.lottie) {
    lottie.loadAnimation({
      container: lottieBg,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'assets/lottie/calculator-bg.json',
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    });
  }

  // Первичный расчёт при загрузке
  updatePrice();
});
