/**
 * modalAccessibility.js - Correções específicas de acessibilidade para modais
 * Corrige o problema de aria-hidden em modais com elementos focados
 */

/**
 * Corrige problemas de acessibilidade em modais
 */
class ModalAccessibility {
  constructor() {
    this.init();
  }

  /**
   * Inicializa as correções
   */
  init() {
    this.fixClearHistoryModal();
    this.setupGlobalModalFix();
  }

  /**
   * Corrige especificamente o modal de limpeza de histórico
   */
  fixClearHistoryModal() {
    const modal = document.getElementById('clearHistoryModal');
    if (!modal) return;

    // Remove aria-hidden inicial se estiver presente
    if (modal.hasAttribute('aria-hidden')) {
      modal.removeAttribute('aria-hidden');
    }

    // Monitora mudanças no modal
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
          this.handleAriaHiddenChange(modal);
        }
      });
    });

    observer.observe(modal, {
      attributes: true,
      attributeFilter: ['aria-hidden']
    });

    // Corrige o botão de confirmação
    const confirmButton = document.getElementById('confirmClearHistory');
    if (confirmButton) {
      confirmButton.addEventListener('click', () => {
        // Remove aria-hidden antes de processar o clique
        if (modal.hasAttribute('aria-hidden')) {
          modal.removeAttribute('aria-hidden');
        }
      });
    }
  }

  /**
   * Configura correção global para todos os modais
   */
  setupGlobalModalFix() {
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
   * Manipula abertura do modal
   * @param {HTMLElement} modal - Elemento do modal
   */
  handleModalShow(modal) {
    // Remove aria-hidden se estiver presente
    if (modal.hasAttribute('aria-hidden')) {
      modal.removeAttribute('aria-hidden');
    }
  }

  /**
   * Manipula modal totalmente aberto
   * @param {HTMLElement} modal - Elemento do modal
   */
  handleModalShown(modal) {
    // Garante que aria-hidden não está presente
    if (modal.hasAttribute('aria-hidden')) {
      modal.removeAttribute('aria-hidden');
    }
  }

  /**
   * Manipula fechamento do modal
   * @param {HTMLElement} modal - Elemento do modal
   */
  handleModalHide(modal) {
    // Remove foco de elementos dentro do modal antes de fechar
    const focusedElement = modal.querySelector(':focus');
    if (focusedElement) {
      focusedElement.blur();
    }
  }

  /**
   * Manipula modal totalmente fechado
   * @param {HTMLElement} modal - Elemento do modal
   */
  handleModalHidden(modal) {
    // Remove aria-hidden se ainda estiver presente
    if (modal.hasAttribute('aria-hidden')) {
      modal.removeAttribute('aria-hidden');
    }
  }

  /**
   * Manipula mudanças no atributo aria-hidden
   * @param {HTMLElement} modal - Elemento do modal
   */
  handleAriaHiddenChange(modal) {
    const isHidden = modal.getAttribute('aria-hidden') === 'true';
    const hasFocus = modal.contains(document.activeElement);

    if (isHidden && hasFocus) {
      console.warn(`Modal ${modal.id} tem aria-hidden="true" mas contém elemento focado - corrigindo`);
      
      // Remove o foco do elemento dentro do modal
      if (document.activeElement && document.activeElement.blur) {
        document.activeElement.blur();
      }

      // Remove aria-hidden
      modal.removeAttribute('aria-hidden');
    }
  }

  /**
   * Força correção de um modal específico
   * @param {string} modalId - ID do modal
   */
  fixModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      // Remove aria-hidden
      if (modal.hasAttribute('aria-hidden')) {
        modal.removeAttribute('aria-hidden');
      }

      // Remove foco de elementos dentro do modal
      const focusedElement = modal.querySelector(':focus');
      if (focusedElement) {
        focusedElement.blur();
      }

      console.log(`Modal ${modalId} corrigido para acessibilidade`);
    }
  }
}

// Instância global
const modalAccessibility = new ModalAccessibility();

/**
 * Força correção de um modal específico
 * @param {string} modalId - ID do modal
 */
export function fixModalAccessibility(modalId) {
  modalAccessibility.fixModal(modalId);
}

/**
 * Corrige todos os modais da página
 */
export function fixAllModalsAccessibility() {
  document.querySelectorAll('.modal').forEach(modal => {
    if (modal.hasAttribute('aria-hidden')) {
      modal.removeAttribute('aria-hidden');
    }
  });
  console.log('Todos os modais corrigidos para acessibilidade');
}

export default modalAccessibility;
