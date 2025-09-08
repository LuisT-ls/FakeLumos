/**
 * modalManager.js - Gerenciador de modais com acessibilidade
 * Corrige problemas de aria-hidden e gerenciamento de foco em modais
 */

/**
 * Classe para gerenciar modais de forma acessível
 */
class ModalManager {
  constructor() {
    this.activeModals = new Map();
    this.focusHistory = [];
    this.init();
  }

  /**
   * Inicializa o gerenciador de modais
   */
  init() {
    this.setupBootstrapModalEvents();
    this.setupCustomModalEvents();
  }

  /**
   * Configura eventos dos modais Bootstrap
   */
  setupBootstrapModalEvents() {
    // Intercepta eventos de modais Bootstrap
    document.addEventListener('show.bs.modal', (event) => {
      this.handleModalShow(event.target);
    });

    document.addEventListener('shown.bs.modal', (event) => {
      this.handleModalShown(event.target);
    });

    document.addEventListener('hide.bs.modal', (event) => {
      this.handleModalHide(event.target);
    });

    document.addEventListener('hidden.bs.modal', (event) => {
      this.handleModalHidden(event.target);
    });
  }

  /**
   * Configura eventos de modais customizados
   */
  setupCustomModalEvents() {
    // Monitora mudanças de aria-hidden
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
          const modal = mutation.target;
          if (modal.classList.contains('modal')) {
            this.handleAriaHiddenChange(modal);
          }
        }
      });
    });

    // Observa todos os modais
    document.querySelectorAll('.modal').forEach(modal => {
      observer.observe(modal, {
        attributes: true,
        attributeFilter: ['aria-hidden']
      });
    });
  }

  /**
   * Manipula abertura do modal
   * @param {HTMLElement} modal - Elemento do modal
   */
  handleModalShow(modal) {
    // Salva o elemento que tinha foco antes do modal abrir
    this.focusHistory.push(document.activeElement);
    
    // Remove aria-hidden se estiver presente
    if (modal.hasAttribute('aria-hidden')) {
      modal.removeAttribute('aria-hidden');
    }

    // Adiciona ao mapa de modais ativos
    this.activeModals.set(modal.id, {
      element: modal,
      previousFocus: document.activeElement
    });

    console.log(`Modal ${modal.id} sendo aberto`);
  }

  /**
   * Manipula modal totalmente aberto
   * @param {HTMLElement} modal - Elemento do modal
   */
  handleModalShown(modal) {
    // Foca no primeiro elemento interativo do modal
    const focusableElement = this.getFirstFocusableElement(modal);
    if (focusableElement) {
      focusableElement.focus();
    }

    // Remove aria-hidden se ainda estiver presente
    if (modal.hasAttribute('aria-hidden')) {
      modal.removeAttribute('aria-hidden');
    }

    console.log(`Modal ${modal.id} totalmente aberto`);
  }

  /**
   * Manipula fechamento do modal
   * @param {HTMLElement} modal - Elemento do modal
   */
  handleModalHide(modal) {
    // Adiciona aria-hidden antes de fechar
    modal.setAttribute('aria-hidden', 'true');

    console.log(`Modal ${modal.id} sendo fechado`);
  }

  /**
   * Manipula modal totalmente fechado
   * @param {HTMLElement} modal - Elemento do modal
   */
  handleModalHidden(modal) {
    // Restaura o foco para o elemento anterior
    const modalData = this.activeModals.get(modal.id);
    if (modalData && modalData.previousFocus) {
      try {
        modalData.previousFocus.focus();
      } catch (error) {
        console.warn('Erro ao restaurar foco:', error);
        // Se não conseguir restaurar o foco, foca no body
        document.body.focus();
      }
    }

    // Remove do mapa de modais ativos
    this.activeModals.delete(modal.id);

    // Remove aria-hidden se ainda estiver presente
    if (modal.hasAttribute('aria-hidden')) {
      modal.removeAttribute('aria-hidden');
    }

    console.log(`Modal ${modal.id} totalmente fechado`);
  }

  /**
   * Manipula mudanças no atributo aria-hidden
   * @param {HTMLElement} modal - Elemento do modal
   */
  handleAriaHiddenChange(modal) {
    const isHidden = modal.getAttribute('aria-hidden') === 'true';
    const hasFocus = modal.contains(document.activeElement);

    if (isHidden && hasFocus) {
      console.warn(`Modal ${modal.id} tem aria-hidden="true" mas contém elemento focado`);
      
      // Remove o foco do elemento dentro do modal
      if (document.activeElement && document.activeElement.blur) {
        document.activeElement.blur();
      }

      // Foca no body
      document.body.focus();
    }
  }

  /**
   * Obtém o primeiro elemento focado no modal
   * @param {HTMLElement} modal - Elemento do modal
   * @returns {HTMLElement|null} - Primeiro elemento focado
   */
  getFirstFocusableElement(modal) {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ];

    for (const selector of focusableSelectors) {
      const element = modal.querySelector(selector);
      if (element && this.isElementVisible(element)) {
        return element;
      }
    }

    return null;
  }

  /**
   * Verifica se o elemento está visível
   * @param {HTMLElement} element - Elemento a verificar
   * @returns {boolean} - true se visível
   */
  isElementVisible(element) {
    const style = getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0';
  }

  /**
   * Força o fechamento de um modal de forma acessível
   * @param {string} modalId - ID do modal
   */
  forceCloseModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      // Remove aria-hidden
      modal.removeAttribute('aria-hidden');
      
      // Foca no body
      document.body.focus();
      
      // Remove do mapa de modais ativos
      this.activeModals.delete(modalId);
      
      console.log(`Modal ${modalId} forçado a fechar`);
    }
  }

  /**
   * Obtém modais ativos
   * @returns {Map} - Mapa de modais ativos
   */
  getActiveModals() {
    return new Map(this.activeModals);
  }

  /**
   * Limpa histórico de foco
   */
  clearFocusHistory() {
    this.focusHistory = [];
  }
}

// Instância global
const modalManager = new ModalManager();

/**
 * Força o fechamento de um modal
 * @param {string} modalId - ID do modal
 */
export function forceCloseModal(modalId) {
  modalManager.forceCloseModal(modalId);
}

/**
 * Obtém modais ativos
 * @returns {Map} - Mapa de modais ativos
 */
export function getActiveModals() {
  return modalManager.getActiveModals();
}

/**
 * Limpa histórico de foco
 */
export function clearModalFocusHistory() {
  modalManager.clearFocusHistory();
}

export default modalManager;
