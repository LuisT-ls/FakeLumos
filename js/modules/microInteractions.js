/**
 * microInteractions.js - Módulo de micro-interações
 * Implementa animações e feedback visual para melhorar UX
 */

/**
 * Classe para gerenciar micro-interações
 */
class MicroInteractions {
  constructor() {
    this.animations = new Map();
    this.ripples = new Set();
    this.init();
  }

  /**
   * Inicializa o módulo de micro-interações
   */
  init() {
    this.addMicroInteractionStyles();
    this.setupButtonInteractions();
    this.setupFormInteractions();
    this.setupCardInteractions();
    this.setupScrollAnimations();
    this.setupHoverEffects();
  }

  /**
   * Adiciona estilos CSS para micro-interações
   */
  addMicroInteractionStyles() {
    const styleId = 'micro-interactions-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Botões com micro-interações */
      .btn-micro {
        position: relative;
        overflow: hidden;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        transform: translateZ(0);
      }

      .btn-micro:active {
        transform: scale(0.98);
      }

      .btn-micro:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .btn-micro:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
      }

      /* Efeito ripple */
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
      }

      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }

      /* Cards com hover */
      .card-micro {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transform: translateZ(0);
      }

      .card-micro:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      /* Formulários */
      .form-control-micro {
        transition: all 0.2s ease;
        position: relative;
      }

      .form-control-micro:focus {
        transform: scale(1.02);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .form-control-micro.error {
        animation: shake 0.5s ease-in-out;
      }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }

      /* Loading states */
      .loading-micro {
        position: relative;
        overflow: hidden;
      }

      .loading-micro::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.2),
          transparent
        );
        animation: loading-shimmer 1.5s infinite;
      }

      @keyframes loading-shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
      }

      /* Fade in animations */
      .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
      }

      /* Slide animations */
      .slide-in-left {
        opacity: 0;
        transform: translateX(-30px);
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .slide-in-left.visible {
        opacity: 1;
        transform: translateX(0);
      }

      .slide-in-right {
        opacity: 0;
        transform: translateX(30px);
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .slide-in-right.visible {
        opacity: 1;
        transform: translateX(0);
      }

      /* Scale animations */
      .scale-in {
        opacity: 0;
        transform: scale(0.9);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .scale-in.visible {
        opacity: 1;
        transform: scale(1);
      }

      /* Pulse animation */
      .pulse-micro {
        animation: pulse-micro 2s infinite;
      }

      @keyframes pulse-micro {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }

      /* Bounce animation */
      .bounce-micro {
        animation: bounce-micro 1s infinite;
      }

      @keyframes bounce-micro {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }

      /* Success animation */
      .success-micro {
        animation: success-micro 0.6s ease-in-out;
      }

      @keyframes success-micro {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }

      /* Error animation */
      .error-micro {
        animation: error-micro 0.6s ease-in-out;
      }

      @keyframes error-micro {
        0% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
        100% { transform: translateX(0); }
      }

      /* Progress bar animation */
      .progress-micro {
        position: relative;
        overflow: hidden;
      }

      .progress-micro::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.4),
          transparent
        );
        animation: progress-shimmer 2s infinite;
      }

      @keyframes progress-shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }

      /* Tema escuro */
      [data-theme="dark"] .ripple {
        background: rgba(255, 255, 255, 0.3);
      }

      [data-theme="dark"] .loading-micro::after {
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.1),
          transparent
        );
      }

      /* Reduz animações se usuário prefere movimento reduzido */
      @media (prefers-reduced-motion: reduce) {
        .btn-micro,
        .card-micro,
        .form-control-micro,
        .fade-in,
        .slide-in-left,
        .slide-in-right,
        .scale-in {
          transition: none;
          animation: none;
        }
        
        .btn-micro:hover {
          transform: none;
        }
        
        .card-micro:hover {
          transform: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Configura interações para botões
   */
  setupButtonInteractions() {
    // Adiciona classes aos botões existentes
    document.querySelectorAll('.btn').forEach(btn => {
      btn.classList.add('btn-micro');
    });

    // Adiciona efeito ripple
    document.addEventListener('click', (e) => {
      const button = e.target.closest('.btn-micro');
      if (button) {
        this.createRipple(e, button);
      }
    });

    // Observa novos botões
    this.observeNewElements('.btn', (btn) => {
      btn.classList.add('btn-micro');
    });
  }

  /**
   * Configura interações para formulários
   */
  setupFormInteractions() {
    // Adiciona classes aos inputs existentes
    document.querySelectorAll('.form-control').forEach(input => {
      input.classList.add('form-control-micro');
    });

    // Adiciona validação visual
    document.addEventListener('input', (e) => {
      if (e.target.classList.contains('form-control-micro')) {
        this.handleInputValidation(e.target);
      }
    });

    // Observa novos inputs
    this.observeNewElements('.form-control', (input) => {
      input.classList.add('form-control-micro');
    });
  }

  /**
   * Configura interações para cards
   */
  setupCardInteractions() {
    // Adiciona classes aos cards existentes
    document.querySelectorAll('.card, .bg-white.rounded-3').forEach(card => {
      card.classList.add('card-micro');
    });

    // Observa novos cards
    this.observeNewElements('.card, .bg-white.rounded-3', (card) => {
      card.classList.add('card-micro');
    });
  }

  /**
   * Configura animações de scroll
   */
  setupScrollAnimations() {
    // Verifica se o usuário prefere movimento reduzido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Adiciona classes de animação
    this.addScrollAnimationClasses();
    
    // Observa elementos com animações
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * Adiciona classes de animação de scroll
   */
  addScrollAnimationClasses() {
    // Seções principais
    document.querySelectorAll('section').forEach((section, index) => {
      if (index % 2 === 0) {
        section.classList.add('fade-in');
      } else {
        section.classList.add('slide-in-left');
      }
    });

    // Cards
    document.querySelectorAll('.card, .bg-white.rounded-3').forEach((card, index) => {
      if (index % 2 === 0) {
        card.classList.add('slide-in-left');
      } else {
        card.classList.add('slide-in-right');
      }
    });

    // Botões
    document.querySelectorAll('.btn').forEach(btn => {
      btn.classList.add('scale-in');
    });
  }

  /**
   * Configura efeitos de hover
   */
  setupHoverEffects() {
    // Efeito de hover para links
    document.querySelectorAll('a').forEach(link => {
      link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-1px)';
        link.style.transition = 'transform 0.2s ease';
      });

      link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0)';
      });
    });
  }

  /**
   * Cria efeito ripple
   * @param {MouseEvent} e - Evento de clique
   * @param {HTMLElement} button - Botão clicado
   */
  createRipple(e, button) {
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
    `;

    button.appendChild(ripple);

    // Remove após animação
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  /**
   * Gerencia validação visual de inputs
   * @param {HTMLInputElement} input - Input a ser validado
   */
  handleInputValidation(input) {
    // Remove classes anteriores
    input.classList.remove('error', 'success');

    // Validação básica
    if (input.hasAttribute('required') && !input.value.trim()) {
      input.classList.add('error');
      this.shakeElement(input);
    } else if (input.value.trim()) {
      input.classList.add('success');
      this.successAnimation(input);
    }
  }

  /**
   * Animação de shake
   * @param {HTMLElement} element - Elemento a ser animado
   */
  shakeElement(element) {
    element.classList.add('error-micro');
    setTimeout(() => {
      element.classList.remove('error-micro');
    }, 600);
  }

  /**
   * Animação de sucesso
   * @param {HTMLElement} element - Elemento a ser animado
   */
  successAnimation(element) {
    element.classList.add('success-micro');
    setTimeout(() => {
      element.classList.remove('success-micro');
    }, 600);
  }

  /**
   * Adiciona animação de loading
   * @param {HTMLElement} element - Elemento a ser animado
   */
  addLoadingAnimation(element) {
    element.classList.add('loading-micro');
  }

  /**
   * Remove animação de loading
   * @param {HTMLElement} element - Elemento a ser animado
   */
  removeLoadingAnimation(element) {
    element.classList.remove('loading-micro');
  }

  /**
   * Adiciona animação de pulse
   * @param {HTMLElement} element - Elemento a ser animado
   */
  addPulseAnimation(element) {
    element.classList.add('pulse-micro');
  }

  /**
   * Remove animação de pulse
   * @param {HTMLElement} element - Elemento a ser animado
   */
  removePulseAnimation(element) {
    element.classList.remove('pulse-micro');
  }

  /**
   * Adiciona animação de bounce
   * @param {HTMLElement} element - Elemento a ser animado
   */
  addBounceAnimation(element) {
    element.classList.add('bounce-micro');
  }

  /**
   * Remove animação de bounce
   * @param {HTMLElement} element - Elemento a ser animado
   */
  removeBounceAnimation(element) {
    element.classList.remove('bounce-micro');
  }

  /**
   * Observa novos elementos no DOM
   * @param {string} selector - Seletor CSS
   * @param {Function} callback - Callback para novos elementos
   */
  observeNewElements(selector, callback) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Verifica se o próprio nó corresponde ao seletor
            if (node.matches && node.matches(selector)) {
              callback(node);
            }
            
            // Verifica elementos filhos
            const elements = node.querySelectorAll?.(selector);
            elements?.forEach(callback);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Anima entrada de elemento
   * @param {HTMLElement} element - Elemento a ser animado
   * @param {string} animation - Tipo de animação
   */
  animateIn(element, animation = 'fade-in') {
    element.classList.add(animation);
    
    // Força reflow
    element.offsetHeight;
    
    // Adiciona classe visible
    element.classList.add('visible');
  }

  /**
   * Anima saída de elemento
   * @param {HTMLElement} element - Elemento a ser animado
   * @param {string} animation - Tipo de animação
   * @param {number} delay - Delay antes de remover
   */
  animateOut(element, animation = 'fade-out', delay = 300) {
    element.classList.remove('visible');
    
    setTimeout(() => {
      element.classList.remove(animation);
    }, delay);
  }

  /**
   * Cria animação customizada
   * @param {HTMLElement} element - Elemento a ser animado
   * @param {Object} keyframes - Keyframes da animação
   * @param {Object} options - Opções da animação
   */
  customAnimation(element, keyframes, options = {}) {
    const defaultOptions = {
      duration: 300,
      easing: 'ease-in-out',
      fill: 'forwards'
    };

    const animationOptions = { ...defaultOptions, ...options };
    
    return element.animate(keyframes, animationOptions);
  }
}

// Instância global
const microInteractions = new MicroInteractions();

/**
 * Adiciona animação de loading
 * @param {HTMLElement} element - Elemento
 */
export function addLoadingAnimation(element) {
  microInteractions.addLoadingAnimation(element);
}

/**
 * Remove animação de loading
 * @param {HTMLElement} element - Elemento
 */
export function removeLoadingAnimation(element) {
  microInteractions.removeLoadingAnimation(element);
}

/**
 * Adiciona animação de pulse
 * @param {HTMLElement} element - Elemento
 */
export function addPulseAnimation(element) {
  microInteractions.addPulseAnimation(element);
}

/**
 * Remove animação de pulse
 * @param {HTMLElement} element - Elemento
 */
export function removePulseAnimation(element) {
  microInteractions.removePulseAnimation(element);
}

/**
 * Adiciona animação de bounce
 * @param {HTMLElement} element - Elemento
 */
export function addBounceAnimation(element) {
  microInteractions.addBounceAnimation(element);
}

/**
 * Remove animação de bounce
 * @param {HTMLElement} element - Elemento
 */
export function removeBounceAnimation(element) {
  microInteractions.removeBounceAnimation(element);
}

/**
 * Anima entrada de elemento
 * @param {HTMLElement} element - Elemento
 * @param {string} animation - Tipo de animação
 */
export function animateIn(element, animation = 'fade-in') {
  microInteractions.animateIn(element, animation);
}

/**
 * Anima saída de elemento
 * @param {HTMLElement} element - Elemento
 * @param {string} animation - Tipo de animação
 * @param {number} delay - Delay
 */
export function animateOut(element, animation = 'fade-out', delay = 300) {
  microInteractions.animateOut(element, animation, delay);
}

/**
 * Cria animação customizada
 * @param {HTMLElement} element - Elemento
 * @param {Object} keyframes - Keyframes
 * @param {Object} options - Opções
 */
export function customAnimation(element, keyframes, options = {}) {
  return microInteractions.customAnimation(element, keyframes, options);
}

export default microInteractions;
