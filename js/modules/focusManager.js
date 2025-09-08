/**
 * focusManager.js - Módulo de gerenciamento de foco
 * Implementa funcionalidades avançadas de acessibilidade e navegação por teclado
 */

/**
 * Classe para gerenciar foco e navegação por teclado
 */
class FocusManager {
  constructor() {
    this.focusHistory = [];
    this.trapStack = [];
    this.skipLinks = [];
    this.init();
  }

  /**
   * Inicializa o gerenciador de foco
   */
  init() {
    this.setupSkipLinks();
    this.setupKeyboardNavigation();
    this.setupFocusTracking();
  }

  /**
   * Configura skip links
   */
  setupSkipLinks() {
    // Cria skip link se não existir
    let skipLink = document.querySelector('.skip-link');
    if (!skipLink) {
      skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-link';
      skipLink.textContent = 'Pular para o conteúdo principal';
      skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
        border-radius: 4px;
        transition: top 0.3s;
      `;
      
      document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Adiciona evento de foco
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    this.skipLinks.push(skipLink);
  }

  /**
   * Configura navegação por teclado
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Escape para fechar modais
      if (e.key === 'Escape') {
        this.handleEscapeKey();
      }

      // Tab para navegação
      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
      }

      // Enter e Space para ativar elementos
      if (e.key === 'Enter' || e.key === ' ') {
        this.handleActivation(e);
      }

      // Arrow keys para navegação em listas
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        this.handleArrowNavigation(e);
      }
    });
  }

  /**
   * Configura rastreamento de foco
   */
  setupFocusTracking() {
    document.addEventListener('focusin', (e) => {
      this.focusHistory.push(e.target);
      
      // Mantém apenas os últimos 10 elementos
      if (this.focusHistory.length > 10) {
        this.focusHistory = this.focusHistory.slice(-10);
      }
    });

    // Adiciona indicador visual de foco
    this.addFocusIndicator();
  }

  /**
   * Adiciona indicador visual de foco
   */
  addFocusIndicator() {
    const style = document.createElement('style');
    style.textContent = `
      .focus-indicator {
        outline: 2px solid #4f46e5 !important;
        outline-offset: 2px !important;
      }

      .focus-trap {
        position: relative;
      }

      .focus-trap::before,
      .focus-trap::after {
        content: '';
        position: absolute;
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Gerencia tecla Escape
   */
  handleEscapeKey() {
    // Fecha modal ativo
    const activeModal = document.querySelector('.modal.show');
    if (activeModal) {
      const closeButton = activeModal.querySelector('[data-bs-dismiss="modal"]');
      if (closeButton) {
        closeButton.click();
        return;
      }
    }

    // Fecha offcanvas ativo
    const activeOffcanvas = document.querySelector('.offcanvas.show');
    if (activeOffcanvas) {
      const closeButton = activeOffcanvas.querySelector('[data-bs-dismiss="offcanvas"]');
      if (closeButton) {
        closeButton.click();
        return;
      }
    }

    // Remove foco de elementos editáveis
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      activeElement.blur();
    }
  }

  /**
   * Gerencia navegação com Tab
   * @param {KeyboardEvent} e - Evento de teclado
   */
  handleTabNavigation(e) {
    const activeElement = document.activeElement;
    
    // Verifica se está em um focus trap
    const focusTrap = this.getActiveFocusTrap();
    if (focusTrap) {
      this.handleFocusTrap(e, focusTrap);
    }

    // Adiciona indicador visual
    this.addFocusIndicatorToElement(activeElement);
  }

  /**
   * Gerencia ativação de elementos
   * @param {KeyboardEvent} e - Evento de teclado
   */
  handleActivation(e) {
    const target = e.target;
    
    // Previne comportamento padrão para elementos não-interativos
    if (target.tagName === 'DIV' || target.tagName === 'SPAN') {
      e.preventDefault();
      
      // Procura por botão ou link próximo
      const interactiveElement = target.closest('button, a, [tabindex]');
      if (interactiveElement) {
        interactiveElement.click();
      }
    }
  }

  /**
   * Gerencia navegação com setas
   * @param {KeyboardEvent} e - Evento de teclado
   */
  handleArrowNavigation(e) {
    const target = e.target;
    
    // Navegação em listas
    if (target.getAttribute('role') === 'listbox' || target.classList.contains('list-group')) {
      this.handleListNavigation(e, target);
    }
    
    // Navegação em menus
    if (target.getAttribute('role') === 'menu' || target.classList.contains('navbar-nav')) {
      this.handleMenuNavigation(e, target);
    }
  }

  /**
   * Gerencia navegação em listas
   * @param {KeyboardEvent} e - Evento de teclado
   * @param {HTMLElement} list - Elemento da lista
   */
  handleListNavigation(e, list) {
    const items = Array.from(list.querySelectorAll('[role="option"], .list-group-item'));
    const currentIndex = items.indexOf(document.activeElement);
    
    let newIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowDown':
        newIndex = Math.min(currentIndex + 1, items.length - 1);
        break;
      case 'ArrowUp':
        newIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = items.length - 1;
        break;
    }
    
    if (newIndex !== currentIndex) {
      e.preventDefault();
      items[newIndex].focus();
    }
  }

  /**
   * Gerencia navegação em menus
   * @param {KeyboardEvent} e - Evento de teclado
   * @param {HTMLElement} menu - Elemento do menu
   */
  handleMenuNavigation(e, menu) {
    const items = Array.from(menu.querySelectorAll('a, button, [tabindex]'));
    const currentIndex = items.indexOf(document.activeElement);
    
    let newIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        newIndex = Math.min(currentIndex + 1, items.length - 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        newIndex = Math.max(currentIndex - 1, 0);
        break;
    }
    
    if (newIndex !== currentIndex) {
      e.preventDefault();
      items[newIndex].focus();
    }
  }

  /**
   * Adiciona indicador visual de foco
   * @param {HTMLElement} element - Elemento
   */
  addFocusIndicatorToElement(element) {
    // Remove indicador anterior
    document.querySelectorAll('.focus-indicator').forEach(el => {
      el.classList.remove('focus-indicator');
    });
    
    // Adiciona indicador ao elemento atual
    if (element) {
      element.classList.add('focus-indicator');
    }
  }

  /**
   * Cria focus trap em um elemento
   * @param {HTMLElement} element - Elemento para criar o trap
   * @returns {string} - ID do focus trap
   */
  createFocusTrap(element) {
    const trapId = `focus-trap-${Date.now()}`;
    
    element.classList.add('focus-trap');
    element.setAttribute('data-focus-trap', trapId);
    
    const trap = {
      id: trapId,
      element,
      firstFocusable: null,
      lastFocusable: null,
      previousActiveElement: document.activeElement
    };
    
    // Encontra elementos focáveis
    const focusableElements = this.getFocusableElements(element);
    if (focusableElements.length > 0) {
      trap.firstFocusable = focusableElements[0];
      trap.lastFocusable = focusableElements[focusableElements.length - 1];
      
      // Foca no primeiro elemento
      trap.firstFocusable.focus();
    }
    
    this.trapStack.push(trap);
    return trapId;
  }

  /**
   * Remove focus trap
   * @param {string} trapId - ID do focus trap
   */
  removeFocusTrap(trapId) {
    const trapIndex = this.trapStack.findIndex(trap => trap.id === trapId);
    if (trapIndex === -1) return;
    
    const trap = this.trapStack[trapIndex];
    
    // Remove classes e atributos
    trap.element.classList.remove('focus-trap');
    trap.element.removeAttribute('data-focus-trap');
    
    // Restaura foco anterior
    if (trap.previousActiveElement) {
      trap.previousActiveElement.focus();
    }
    
    // Remove do stack
    this.trapStack.splice(trapIndex, 1);
  }

  /**
   * Gerencia focus trap durante navegação
   * @param {KeyboardEvent} e - Evento de teclado
   * @param {Object} trap - Focus trap ativo
   */
  handleFocusTrap(e, trap) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab: vai para o último elemento
        if (document.activeElement === trap.firstFocusable) {
          e.preventDefault();
          trap.lastFocusable.focus();
        }
      } else {
        // Tab: vai para o primeiro elemento
        if (document.activeElement === trap.lastFocusable) {
          e.preventDefault();
          trap.firstFocusable.focus();
        }
      }
    }
  }

  /**
   * Obtém focus trap ativo
   * @returns {Object|null} - Focus trap ativo
   */
  getActiveFocusTrap() {
    return this.trapStack.length > 0 ? this.trapStack[this.trapStack.length - 1] : null;
  }

  /**
   * Obtém elementos focáveis em um container
   * @param {HTMLElement} container - Container
   * @returns {HTMLElement[]} - Elementos focáveis
   */
  getFocusableElements(container) {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ];
    
    return Array.from(container.querySelectorAll(focusableSelectors.join(', ')))
      .filter(el => {
        // Verifica se o elemento está visível
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               style.opacity !== '0';
      });
  }

  /**
   * Move foco para um elemento específico
   * @param {HTMLElement} element - Elemento para focar
   * @param {Object} options - Opções
   */
  focusElement(element, options = {}) {
    if (!element) return;
    
    const { 
      preventScroll = false, 
      delay = 0,
      highlight = true 
    } = options;
    
    const focusAction = () => {
      element.focus({ preventScroll });
      
      if (highlight) {
        this.addFocusIndicatorToElement(element);
      }
    };
    
    if (delay > 0) {
      setTimeout(focusAction, delay);
    } else {
      focusAction();
    }
  }

  /**
   * Move foco para o próximo elemento focável
   * @param {HTMLElement} currentElement - Elemento atual
   */
  focusNext(currentElement) {
    const focusableElements = this.getFocusableElements(document.body);
    const currentIndex = focusableElements.indexOf(currentElement);
    
    if (currentIndex < focusableElements.length - 1) {
      this.focusElement(focusableElements[currentIndex + 1]);
    }
  }

  /**
   * Move foco para o elemento focável anterior
   * @param {HTMLElement} currentElement - Elemento atual
   */
  focusPrevious(currentElement) {
    const focusableElements = this.getFocusableElements(document.body);
    const currentIndex = focusableElements.indexOf(currentElement);
    
    if (currentIndex > 0) {
      this.focusElement(focusableElements[currentIndex - 1]);
    }
  }

  /**
   * Move foco para o primeiro elemento focável
   */
  focusFirst() {
    const focusableElements = this.getFocusableElements(document.body);
    if (focusableElements.length > 0) {
      this.focusElement(focusableElements[0]);
    }
  }

  /**
   * Move foco para o último elemento focável
   */
  focusLast() {
    const focusableElements = this.getFocusableElements(document.body);
    if (focusableElements.length > 0) {
      this.focusElement(focusableElements[focusableElements.length - 1]);
    }
  }

  /**
   * Move foco para um elemento por seletor
   * @param {string} selector - Seletor CSS
   * @param {Object} options - Opções
   */
  focusBySelector(selector, options = {}) {
    const element = document.querySelector(selector);
    if (element) {
      this.focusElement(element, options);
    }
  }

  /**
   * Limpa histórico de foco
   */
  clearFocusHistory() {
    this.focusHistory = [];
  }

  /**
   * Obtém histórico de foco
   * @returns {HTMLElement[]} - Histórico de foco
   */
  getFocusHistory() {
    return [...this.focusHistory];
  }
}

// Instância global
const focusManager = new FocusManager();

/**
 * Cria focus trap em um elemento
 * @param {HTMLElement} element - Elemento
 * @returns {string} - ID do focus trap
 */
export function createFocusTrap(element) {
  return focusManager.createFocusTrap(element);
}

/**
 * Remove focus trap
 * @param {string} trapId - ID do focus trap
 */
export function removeFocusTrap(trapId) {
  focusManager.removeFocusTrap(trapId);
}

/**
 * Move foco para um elemento
 * @param {HTMLElement} element - Elemento
 * @param {Object} options - Opções
 */
export function focusElement(element, options = {}) {
  focusManager.focusElement(element, options);
}

/**
 * Move foco para o próximo elemento
 * @param {HTMLElement} currentElement - Elemento atual
 */
export function focusNext(currentElement) {
  focusManager.focusNext(currentElement);
}

/**
 * Move foco para o elemento anterior
 * @param {HTMLElement} currentElement - Elemento atual
 */
export function focusPrevious(currentElement) {
  focusManager.focusPrevious(currentElement);
}

/**
 * Move foco para o primeiro elemento
 */
export function focusFirst() {
  focusManager.focusFirst();
}

/**
 * Move foco para o último elemento
 */
export function focusLast() {
  focusManager.focusLast();
}

/**
 * Move foco por seletor
 * @param {string} selector - Seletor CSS
 * @param {Object} options - Opções
 */
export function focusBySelector(selector, options = {}) {
  focusManager.focusBySelector(selector, options);
}

export default focusManager;
