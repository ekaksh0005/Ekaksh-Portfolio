// Intersection Observer for revealing sections
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
const scrollBtn = document.querySelector('.scroll-top');
const scrollIndicator = document.querySelector('.scroll-indicator');

// Initialize AOS-like animations
function initAnimations() {
  document.querySelectorAll('[data-aos]').forEach(item => {
    item.classList.add(item.getAttribute('data-aos'));
  });
}

// Intersection Observer for section visibility
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Update active nav link
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === entry.target.id) {
          link.classList.add('active');
        }
      });
    }
  });
}, {
  threshold: 0.2
});

sections.forEach(section => {
  observer.observe(section);
});

// Scroll to top button visibility
window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    scrollBtn.classList.add('visible');
  } else {
    scrollBtn.classList.remove('visible');
  }
  
  // Update scroll indicator
  const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  if (scrollIndicator) {
    scrollIndicator.style.width = scrollPercentage + '%';
  }
});

// Smooth scroll to top
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle light/dark mode
function toggleMode() {
  document.body.classList.toggle('light-mode');
  
  // Update icon
  const toggleBtn = document.querySelector('.toggle-mode i');
  if (document.body.classList.contains('light-mode')) {
    toggleBtn.className = 'fas fa-sun';
  } else {
    toggleBtn.className = 'fas fa-moon';
  }
  
  // Save preference to localStorage
  const isDarkMode = !document.body.classList.contains('light-mode');
  localStorage.setItem('darkMode', isDarkMode);
}

// Form submission handler
function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const formResponse = document.getElementById('form-response');
  
  // Simulate form submission with loading animation
  formResponse.innerHTML = '<p style="color: var(--accent-color);"><i class="fas fa-spinner fa-spin"></i> Sending message...</p>';
  
  setTimeout(() => {
    formResponse.innerHTML = '<p style="color: var(--accent-color);"><i class="fas fa-check-circle"></i> Thank you for your message! I will get back to you soon.</p>';
    event.target.reset();
  }, 1500);
  
  return false;
}

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    
    window.scrollTo({
      top: targetSection.offsetTop - 100,
      behavior: 'smooth'
    });
    
    // Update active link
    document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
    this.classList.add('active');
  });
});

// Particle background effect
function setupParticles() {
  const header = document.querySelector('header');
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '-1';
  header.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = header.offsetWidth;
  canvas.height = header.offsetHeight;
  
  const particles = [];
  const particleCount = 100;
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      speedX: Math.random() * 1 - 0.5,
      speedY: Math.random() * 1 - 0.5,
      opacity: Math.random() * 0.5 + 0.1
    });
  }
  
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100, 255, 218, ${particle.opacity})`;
      ctx.fill();
      
      // Move particles
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
    });
    
    requestAnimationFrame(drawParticles);
  }
  
  drawParticles();
}

// Check for saved theme preference
window.addEventListener('DOMContentLoaded', () => {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  if (!isDarkMode) {
    document.body.classList.add('light-mode');
    document.querySelector('.toggle-mode i').className = 'fas fa-sun';
  }
  
  // Initialize animations
  initAnimations();
  
  // Setup particle effect
  setupParticles();
  
  // Make first section visible
  document.querySelector('section').classList.add('visible');
  
  // Add animation classes to project items with delay
  document.querySelectorAll('.project-item, .skill-item, .experience-item').forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('fade-in');
    }, index * 100);
  });
});

// Add hover effects to nav links
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('mouseenter', function() {
    if (!this.classList.contains('active')) {
      this.classList.add('hover');
    }
  });
  
  link.addEventListener('mouseleave', function() {
    this.classList.remove('hover');
  });
});

// Resize event for particle canvas
window.addEventListener('resize', () => {
  const canvas = document.querySelector('canvas');
  if (canvas) {
    canvas.width = document.querySelector('header').offsetWidth;
    canvas.height = document.querySelector('header').offsetHeight;
  }
});

document.addEventListener('DOMContentLoaded', () => {
    const typingElement = document.querySelector('.typing-effect');
    
    if (typingElement) {
      setTimeout(() => {
        typingElement.classList.remove('typing-effect');
        typingElement.classList.add('typing-done');
      }, 3500); // after 3.5s
    }
  });

  // Add this to your main.js file

// Mobile Navigation
function setupMobileNav() {
    // Create the menu toggle button
    const mobileNavToggle = document.createElement('button');
    mobileNavToggle.className = 'mobile-nav-toggle';
    mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.appendChild(mobileNavToggle);
    
    // Create overlay for mobile menu
    const navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);
    
    // Get the navbar
    const navbar = document.getElementById('navbar');
    
    // Toggle mobile navigation
    function toggleMobileNav() {
      navbar.classList.toggle('active');
      navOverlay.classList.toggle('active');
      
      // Change icon based on menu state
      if (navbar.classList.contains('active')) {
        mobileNavToggle.innerHTML = '<i class="fas fa-times"></i>';
      } else {
        mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    }
    
    // Event listeners
    mobileNavToggle.addEventListener('click', toggleMobileNav);
    navOverlay.addEventListener('click', toggleMobileNav);
    
    // Close mobile nav when clicking a link
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', () => {
        if (navbar.classList.contains('active')) {
          toggleMobileNav();
        }
      });
    });
  }
  
  // Call this function when the DOM is loaded
  window.addEventListener('DOMContentLoaded', () => {
    // Your existing DOMContentLoaded code...
    
    // Add mobile navigation setup
    setupMobileNav();
  });

  // Update particle effect to be responsive to theme
function setupParticles() {
    const header = document.querySelector('header');
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    header.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = header.offsetWidth;
    canvas.height = header.offsetHeight;
    
    const particles = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
    
    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const isDarkMode = !document.body.classList.contains('light-mode');
      
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        
        // Change particle color based on theme
        if (isDarkMode) {
          ctx.fillStyle = `rgba(100, 255, 218, ${particle.opacity})`;
        } else {
          ctx.fillStyle = `rgba(67, 97, 238, ${particle.opacity})`;
        }
        
        ctx.fill();
        
        // Move particles
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });
      
      requestAnimationFrame(drawParticles);
    }
    
    drawParticles();
    
    // Update particle colors when theme changes
    const toggleBtn = document.querySelector('.toggle-mode');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        // Particles color will update on next animation frame
      });
    }
  }

  // Enhanced toggle mode function
function toggleMode() {
    document.body.classList.toggle('light-mode');
    
    // Update icon and text
    const toggleBtn = document.querySelector('.toggle-mode i');
    const toggleText = document.querySelector('.toggle-text');
    
    if (document.body.classList.contains('light-mode')) {
      toggleBtn.className = 'fas fa-sun';
      if (toggleText) toggleText.textContent = 'Dark Mode';
      
      // Add smooth transition animation
      document.body.classList.add('theme-transition');
      setTimeout(() => {
        document.body.classList.remove('theme-transition');
      }, 1000);
    } else {
      toggleBtn.className = 'fas fa-moon';
      if (toggleText) toggleText.textContent = 'Light Mode';
      
      // Add smooth transition animation
      document.body.classList.add('theme-transition');
      setTimeout(() => {
        document.body.classList.remove('theme-transition');
      }, 1000);
    }
    
    // Save preference to localStorage
    const isDarkMode = !document.body.classList.contains('light-mode');
    localStorage.setItem('darkMode', isDarkMode);
  }

  // Project page specific animations
if (document.querySelector('.project-detail')) {
  // Animate project gallery images
  document.querySelectorAll('.project-gallery img').forEach((img, index) => {
    img.style.opacity = '0';
    img.style.transform = 'translateY(20px)';
    img.style.transition = `all 0.5s ease ${index * 0.1}s`;
    
    setTimeout(() => {
      img.style.opacity = '1';
      img.style.transform = 'translateY(0)';
    }, 100);
  });
  
  // Animate feature items
  document.querySelectorAll('.feature-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = `all 0.5s ease ${index * 0.1}s`;
    
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 200 + (index * 100));
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
}