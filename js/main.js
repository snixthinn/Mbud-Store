document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Page Load Animation
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.8s ease';
    document.body.style.opacity = '1';
  }, 50);

  // 2. Sticky Header and Scroll Effects
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 3. Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('is-active');
      header.classList.toggle('menu-open');
      
      // Prevent body scrolling when menu is open
      if (header.classList.contains('menu-open')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  // 4. 3D Card Tilt Effect (Vanilla JS)
  const cards = document.querySelectorAll('.shoe-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      
      // Optional: Add a subtle glare effect
      // If we had a .glare element inside the card, we could move it here
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });

  // 5. Intersection Observer for Scroll Reveals
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length > 0) {
    const revealOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if no reveal elements found (e.g. pages not fully refactored yet)
    const legacySections = document.querySelectorAll('.section');
    legacySections.forEach(el => el.classList.add('reveal', 'active'));
  }

  // 6. Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if(targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (header && header.classList.contains('menu-open')) {
          menuToggle.click();
        }

        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 7. Form Validation Logic
  
  // Helper to show/hide errors
  const showError = (id, message) => {
    const el = document.getElementById(id);
    if(el) el.textContent = message;
  };
  const clearErrors = (form) => {
    const errors = form.querySelectorAll('.form-error');
    errors.forEach(err => err.textContent = '');
  };

  // Register Form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors(registerForm);
      let isValid = true;
      
      const username = document.getElementById('regUsername').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const pass = document.getElementById('regPass').value;
      
      if (username.length < 3) {
        showError('errRegUser', 'Username must be at least 3 characters');
        isValid = false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showError('errRegEmail', 'Please enter a valid email address');
        isValid = false;
      }
      
      if (pass.length < 6) {
        showError('errRegPass', 'Password must be at least 6 characters');
        isValid = false;
      }
      
      if (isValid) {
        // Simulate loading state on button
        const btn = registerForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Registering...';
        btn.disabled = true;
        
        setTimeout(() => {
          alert('Registration successful! Welcome to MbudStore.');
          registerForm.reset();
          btn.textContent = originalText;
          btn.disabled = false;
        }, 1000);
      }
    });
  }

  // Login Form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors(loginForm);
      
      const u = document.getElementById('loginUser').value.trim();
      const p = document.getElementById('loginPass').value;
      
      const btn = loginForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Authenticating...';
      btn.disabled = true;
      
      setTimeout(() => {
        if(u === 'admin' && p === 'admin123'){ 
          alert('Login successful! Welcome back.'); 
          // Simulate redirect
          window.location.href = 'index.html';
        } else { 
          showError('errLoginAuth', 'Invalid credentials. Please try again.'); 
        }
        btn.textContent = originalText;
        btn.disabled = false;
      }, 800);
    });
  }

  // Forgot Password
  const forgotForm = document.getElementById('forgotForm');
  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors(forgotForm);
      const email = document.getElementById('forgotEmail').value.trim();
      
      if (email.indexOf('@') === -1) {
        showError('errForgot', 'Please enter a valid email address.');
        return;
      }
      
      const btn = forgotForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      
      setTimeout(() => {
        alert('Password reset link sent to your email.');
        forgotForm.reset();
        btn.textContent = originalText;
        btn.disabled = false;
      }, 1000);
    });
  }

  // Purchase Form
  const purchaseForm = document.getElementById('purchaseForm');
  if(purchaseForm) {
    purchaseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors(purchaseForm);
      const qty = Number(document.getElementById('qty').value);
      
      if (!qty || qty <= 0) {
        showError('errQty', 'Please enter a valid quantity greater than 0.');
        return;
      }
      
      const btn = purchaseForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Processing...';
      btn.disabled = true;
      
      setTimeout(() => {
        alert('Purchase processed successfully! Thank you for shopping with us.');
        purchaseForm.reset();
        btn.textContent = originalText;
        btn.disabled = false;
      }, 1500);
    });
  }

  // Add click ripple effect to buttons (optional enhancement)
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      if(this.disabled) return;
      
      let ripple = document.createElement('span');
      ripple.classList.add('ripple');
      this.appendChild(ripple);
      
      let x = e.clientX - e.target.getBoundingClientRect().left;
      let y = e.clientY - e.target.getBoundingClientRect().top;
      
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // 8. Dark Silver Flakes Animation
  const path = window.location.pathname.toLowerCase();
  if (path.endsWith('index.html') || path.endsWith('login.html') || path.endsWith('register.html') || path.endsWith('/')) {
    const flakesContainer = document.createElement('div');
    flakesContainer.className = 'flakes-container';
    document.body.prepend(flakesContainer);

    const flakeCount = 60; // Total number of flakes
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < flakeCount; i++) {
      const flake = document.createElement('div');
      flake.className = 'flake';
      
      // Randomize properties for a natural effect
      const size = Math.random() * 5 + 2; // Size between 2px and 7px
      flake.style.width = `${size}px`;
      flake.style.height = `${size}px`;
      
      flake.style.left = `${Math.random() * 100}vw`; // Horizontal position
      flake.style.animationDuration = `${Math.random() * 15 + 10}s`; // Fall speed 10s-25s
      flake.style.animationDelay = `${Math.random() * 15}s`; // Delay start
      
      fragment.appendChild(flake);
    }
    flakesContainer.appendChild(fragment);
  }
});
