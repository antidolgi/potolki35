/**
 * form.js
 * Отправка формы обратной связи в Telegram Bot API.
 * Использует Fetch API, минимальную валидацию и анимацию статуса.
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // ===== НАСТРОЙКИ БОТА =====
  const BOT_TOKEN = 'ВАШ_ТОКЕН_БОТА';          // замени на реальный токен
  const CHAT_ID = 'ВАШ_ЧАТ_ID';               // замени на ID чата/группы/пользователя

  const statusEl = document.createElement('div');
  statusEl.className = 'form-status';
  statusEl.setAttribute('aria-live', 'polite');
  form.appendChild(statusEl);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Собираем данные
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();

    // Валидация
    if (!name || !phone) {
      showStatus('Пожалуйста, заполните имя и телефон.', 'error');
      return;
    }

    // Отключаем кнопку на время отправки
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    // Формируем текст сообщения
    const text = `📩 *Новая заявка с сайта Потолки35*%0A%0A` +
                 `👤 *Имя:* ${encodeURIComponent(name)}%0A` +
                 `📞 *Телефон:* ${encodeURIComponent(phone)}%0A` +
                 `💬 *Сообщение:* ${encodeURIComponent(message || 'Не указано')}%0A` +
                 `🕒 *Время:* ${new Date().toLocaleString('ru-RU')}`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
          parse_mode: 'Markdown',
        }),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        showStatus('Спасибо! Мы свяжемся с вами в ближайшее время.', 'success');
        form.reset();
      } else {
        throw new Error(data.description || 'Ошибка Telegram API');
      }
    } catch (err) {
      console.error('Ошибка отправки:', err);
      showStatus('Не удалось отправить. Попробуйте ещё раз или свяжитесь по телефону.', 'error');
    } finally {
      // Восстанавливаем кнопку
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });

  function showStatus(text, type) {
    statusEl.textContent = text;
    statusEl.className = `form-status form-status--${type}`;
    // Автоскрытие через 5 секунд
    clearTimeout(statusEl._timeout);
    statusEl._timeout = setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className = 'form-status';
    }, 5000);
  }
});
