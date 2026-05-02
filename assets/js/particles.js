/**
 * particles.js
 * Лёгкий анимированный фон из светящихся точек.
 */
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 80; // плотность

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = document.body.scrollHeight;
  }
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -10;
      this.radius = Math.random() * 2 + 0.5;
      this.speedY = 0.2 + Math.random() * 0.4;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.opacityDirection = Math.random() > 0.5 ? 0.005 : -0.005;
    }
    update() {
      this.y += this.speedY;
      this.opacity += this.opacityDirection;
      if (this.opacity >= 0.7 || this.opacity <= 0.1) {
        this.opacityDirection *= -1;
      }
      if (this.y > canvas.height + 10) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`; // золотой оттенок
      ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  resize();
  init();
  animate();

  // Обновление высоты канваса при скролле (динамический контент)
  const observer = new ResizeObserver(() => {
    canvas.height = document.body.scrollHeight;
  });
  observer.observe(document.body);
});
