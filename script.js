(function () {
  const header = document.getElementById('site-header');
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('nav-toggle');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const onScroll = () => {
    const scrolled = window.scrollY > 30;
    header.classList.toggle('is-scrolled', scrolled);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  window.Blake = {
    handleForm(event) {
      event.preventDefault();
      const form = event.target;
      const note = document.getElementById('form-note');
      const data = Object.fromEntries(new FormData(form).entries());

      if (!data.nombre || !data.telefono) {
        if (note) {
          note.hidden = false;
          note.textContent = 'Por favor completa los campos requeridos.';
          note.style.background = 'rgba(220, 80, 80, .12)';
          note.style.color = '#a83232';
        }
        return false;
      }

      if (note) {
        note.hidden = false;
        note.style.background = '';
        note.style.color = '';
        note.textContent = `Gracias, ${data.nombre.split(' ')[0]}. Recibimos tu mensaje y te contactaremos a la brevedad.`;
      }
      form.reset();
      return false;
    },
  };
})();
