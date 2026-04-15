document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link, .nav__btn--mobile');
  const fileUpload = document.getElementById('fileUpload');
  const fileInput = document.getElementById('modelFile');
  const fileLabel = document.getElementById('fileLabel');
  const orderForm = document.getElementById('orderForm');
  const submitBtn = document.getElementById('submitBtn');
  const successModal = document.getElementById('successModal');
  const modalClose = document.getElementById('modalClose');

  // ── Sticky header ──
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  });

  // ── Mobile menu ──
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ── File upload ──
  fileUpload.addEventListener('click', (e) => {
    if (e.target !== fileInput) fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      fileLabel.textContent = fileInput.files[0].name;
      fileUpload.classList.add('file-upload--has-file');
    } else {
      resetFileUpload();
    }
  });

  fileUpload.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUpload.style.borderColor = 'var(--accent)';
  });

  fileUpload.addEventListener('dragleave', () => {
    fileUpload.style.borderColor = '';
  });

  fileUpload.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUpload.style.borderColor = '';
    if (e.dataTransfer.files.length > 0) {
      fileInput.files = e.dataTransfer.files;
      fileLabel.textContent = e.dataTransfer.files[0].name;
      fileUpload.classList.add('file-upload--has-file');
    }
  });

  function resetFileUpload() {
    fileLabel.textContent = 'Натисніть для завантаження файлу';
    fileUpload.classList.remove('file-upload--has-file');
  }

  // ── Sanitization ──
  function sanitize(str) {
    return str
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
      .replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, '')
      .replace(/<embed[\s\S]*?>/gi, '')
      .replace(/<link[\s\S]*?>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/on\w+\s*=\s*\S+/gi, '')
      .replace(/javascript\s*:/gi, '')
      .replace(/data\s*:\s*text\/html/gi, '')
      .replace(/<\/?[^>]+(>|$)/g, '')
      .trim();
  }

  // ── Validation ──
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_RE = /^\+?[\d\s().-]{7,20}$/;

  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(el => { el.textContent = ''; });
    document.querySelectorAll('.form-group--error').forEach(el => { el.classList.remove('form-group--error'); });
  }

  function setError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (field) field.closest('.form-group').classList.add('form-group--error');
    if (error) error.textContent = message;
  }

  function validateForm() {
    clearErrors();
    let valid = true;

    const nameVal = sanitize(document.getElementById('name').value);
    if (!nameVal || nameVal.length < 2) {
      setError('name', 'nameError', "Ім'я повинно містити щонайменше 2 символи");
      valid = false;
    } else if (nameVal.length > 100) {
      setError('name', 'nameError', "Ім'я не може перевищувати 100 символів");
      valid = false;
    }

    const emailVal = document.getElementById('email').value.trim();
    if (!emailVal) {
      setError('email', 'emailError', 'Email є обов\'язковим');
      valid = false;
    } else if (!EMAIL_RE.test(emailVal)) {
      setError('email', 'emailError', 'Невірний формат email');
      valid = false;
    }

    const phoneVal = document.getElementById('phone').value.trim();
    if (phoneVal && !PHONE_RE.test(phoneVal)) {
      setError('phone', 'phoneError', 'Невірний формат телефону');
      valid = false;
    }

    const commentVal = document.getElementById('comment').value;
    if (commentVal.length > 2000) {
      setError('comment', 'commentError', 'Коментар не може перевищувати 2000 символів');
      valid = false;
    }
    const commentSanitized = sanitize(commentVal);
    if (commentVal !== commentSanitized) {
      document.getElementById('comment').value = commentSanitized;
    }

    document.getElementById('name').value = nameVal;

    return valid;
  }

  // ── Form submission via Netlify ──
  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Надсилаємо...';

    try {
      const formData = new FormData(orderForm);

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });

      if (response.ok) {
        successModal.classList.add('active');
        orderForm.reset();
        resetFileUpload();
      } else {
        throw new Error('Server error');
      }
    } catch {
      alert('Помилка при відправці. Спробуйте ще раз або напишіть на пошту.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Надіслати замовлення';
    }
  });

  // ── Modal close ──
  modalClose.addEventListener('click', () => {
    successModal.classList.remove('active');
  });

  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      modalClose.click();
    }
  });

  // ── Scroll reveal animation ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.step, .service-card, .feature-card').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
});
