import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-presentacion',
  standalone: true,
  templateUrl: './presentacion.component.html',
  styleUrls: ['./presentacion.component.css']
})
export class PresentacionComponent implements OnInit, OnDestroy, AfterViewInit {

  private typingInterval: any;
  private texts = ['Analista de Datos', 'Desarrollador Python', 'Especialista en BI', 'Data Scientist'];
  private textIndex = 0;
  private charIndex = 0;
  private isDeleting = false;

  constructor() { }

  ngOnInit(): void {
    this.initializeScrollEffects();
  }

  openProject(url: string): void {
  window.open(url, '_blank');
}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.startTypingEffect();
      this.initializeAnimations();
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
    window.removeEventListener('scroll', this.handleScroll);
  }

  startTypingEffect(): void {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const typeEffect = () => {
      const currentText = this.texts[this.textIndex];
      
      if (this.isDeleting) {
        typingElement.textContent = currentText.substring(0, this.charIndex - 1);
        this.charIndex--;
      } else {
        typingElement.textContent = currentText.substring(0, this.charIndex + 1);
        this.charIndex++;
      }

      if (!this.isDeleting && this.charIndex === currentText.length) {
        setTimeout(() => { this.isDeleting = true; }, 2000);
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.textIndex = (this.textIndex + 1) % this.texts.length;
      }

      const typeSpeed = this.isDeleting ? 100 : 150;
      setTimeout(typeEffect, typeSpeed);
    };

    setTimeout(typeEffect, 1000);
  }

  initializeScrollEffects(): void {
    // Smooth scrolling for navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });

    // Scroll event listener
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll(): void {
    const navbar = document.getElementById('navbar');
    const scrollTop = document.getElementById('scrollTop');
    const sections = document.querySelectorAll('section');

    // Navbar scroll effect
    if (window.scrollY > 100) {
      navbar?.classList.add('scrolled');
      scrollTop?.classList.add('visible');
    } else {
      navbar?.classList.remove('scrolled');
      scrollTop?.classList.remove('visible');
    }

    // Section animation on scroll
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop < window.innerHeight * 0.75) {
        section.classList.add('visible');
      }
    });

    // Parallax effect for hero section
    const hero = document.getElementById('home');
    if (hero) {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      hero.style.transform = `translateY(${rate}px)`;
    }
  }

  initializeAnimations(): void {
    // Initialize section animations
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.classList.add('visible');
      }, index * 200);
    });

    // Card hover effects - mejorado para evitar errores
    const interactiveElements = document.querySelectorAll('.card, .project-item, .timeline-item');
    interactiveElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      
      element.addEventListener('mouseenter', () => {
        if (htmlElement && htmlElement.style) {
          htmlElement.style.transform = 'translateY(-10px) scale(1.02)';
        }
      });

      element.addEventListener('mouseleave', () => {
        if (htmlElement && htmlElement.style) {
          htmlElement.style.transform = 'translateY(0) scale(1)';
        }
      });
    });

    // Create particles periodically
    setInterval(() => {
      this.createParticle();
    }, 3000);
  }

  createParticle(): void {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      width: 4px;
      height: 4px;
      background-color: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      pointer-events: none;
      z-index: 1;
      left: ${Math.random() * 100}%;
      top: 100%;
      opacity: 0;
    `;
    
    document.body.appendChild(particle);

    const keyframes = [
      { transform: 'translateY(0px)', opacity: '0' },
      { transform: 'translateY(-50vh)', opacity: '1' },
      { transform: 'translateY(-100vh)', opacity: '0' }
    ];

    try {
      const animation = particle.animate(keyframes, {
        duration: 8000,
        easing: 'linear'
      });

      animation.onfinish = () => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      };
    } catch (error) {
      // Si animate() no es compatible, remover la partícula después de un tiempo
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 8000);
    }
  }
}