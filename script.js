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

  function showNote(note, msg, type) {
    if (!note) return;
    note.hidden = false;
    note.textContent = msg;
    if (type === 'error') {
      note.style.background = 'rgba(220, 80, 80, .12)';
      note.style.color = '#a83232';
    } else {
      note.style.background = '';
      note.style.color = '';
    }
  }

  window.Blake = {
    async handleForm(event) {
      event.preventDefault();
      const form = event.target;
      const note = document.getElementById('form-note');
      const submitBtn = form.querySelector('button[type="submit"]');
      const data = Object.fromEntries(new FormData(form).entries());

      if (!data.nombre || !data.telefono) {
        showNote(note, 'Por favor completa los campos requeridos.', 'error');
        return false;
      }

      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(data),
        });

        let result = null;
        try { result = await response.json(); } catch (_) {}
        console.log('FormSubmit response:', response.status, result);

        const success = result && (result.success === 'true' || result.success === true);

        if (response.ok && success) {
          showNote(
            note,
            `Gracias, ${data.nombre.split(' ')[0]}. Recibimos tu mensaje y te contactaremos a la brevedad.`,
            'success'
          );
          form.reset();
        } else {
          const reason = (result && (result.message || result.error)) || `HTTP ${response.status}`;
          throw new Error(reason);
        }
      } catch (err) {
        console.error('Form submit error:', err);
        showNote(
          note,
          'Ocurrió un error al enviar. Intenta de nuevo o escríbenos por WhatsApp.',
          'error'
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
      return false;
    },
  };
})();
