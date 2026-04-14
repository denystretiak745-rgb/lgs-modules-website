document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link, .nav__btn--mobile');
  const fileUpload = document.getElementById('fileUpload');
  const fileInput = document.getElementById('fileInput');
  const fileLabel = document.getElementById('fileLabel');
  const orderForm = document.getElementById('orderForm');
  const successModal = document.getElementById('successModal');
  const modalClose = document.getElementById('modalClose');

  // Sticky header
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScroll = currentScroll;
  });

  // Mobile menu
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

  // File upload
  fileUpload.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      fileLabel.textContent = fileInput.files[0].name;
      fileUpload.classList.add('file-upload--has-file');
    } else {
      fileLabel.textContent = 'Натисніть для завантаження файлу';
      fileUpload.classList.remove('file-upload--has-file');
    }
  });

  // Drag & drop
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

  // Form submission
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    successModal.classList.add('active');
  });

  // Modal close
  modalClose.addEventListener('click', () => {
    successModal.classList.remove('active');
    orderForm.reset();
    fileLabel.textContent = 'Натисніть для завантаження файлу';
    fileUpload.classList.remove('file-upload--has-file');
  });

  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      modalClose.click();
    }
  });

  // Scroll reveal animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.step, .service-card, .feature-card').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
});
