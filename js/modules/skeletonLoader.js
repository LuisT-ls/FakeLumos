/**
 * skeletonLoader.js - Módulo de skeleton loading
 * Implementa loading states com skeletons para melhor UX
 */

/**
 * Classe para gerenciar skeleton loading
 */
class SkeletonLoader {
  constructor() {
    this.skeletons = new Map();
    this.init();
  }

  /**
   * Inicializa o skeleton loader
   */
  init() {
    // Adiciona estilos CSS para skeletons
    this.addSkeletonStyles();
  }

  /**
   * Adiciona estilos CSS para skeletons
   */
  addSkeletonStyles() {
    const styleId = 'skeleton-loader-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .skeleton-loader {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
        border-radius: 4px;
        overflow: hidden;
      }

      .skeleton-loader.dark {
        background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
        background-size: 200% 100%;
      }

      @keyframes skeleton-loading {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      .skeleton-text {
        height: 1rem;
        margin: 0.5rem 0;
        border-radius: 4px;
      }

      .skeleton-text.short {
        width: 60%;
      }

      .skeleton-text.medium {
        width: 80%;
      }

      .skeleton-text.long {
        width: 100%;
      }

      .skeleton-title {
        height: 1.5rem;
        margin: 0.5rem 0;
        border-radius: 4px;
        width: 70%;
      }

      .skeleton-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin: 0.5rem;
      }

      .skeleton-button {
        height: 2.5rem;
        width: 120px;
        border-radius: 6px;
        margin: 0.5rem 0;
      }

      .skeleton-card {
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
      }

      .skeleton-image {
        width: 100%;
        height: 200px;
        border-radius: 8px;
        margin: 0.5rem 0;
      }

      .skeleton-list-item {
        display: flex;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #e5e7eb;
      }

      .skeleton-list-item:last-child {
        border-bottom: none;
      }

      .skeleton-list-item .skeleton-avatar {
        margin-right: 1rem;
        margin-bottom: 0;
      }

      .skeleton-list-item .skeleton-text {
        flex: 1;
        margin: 0;
      }

      /* Reduz animação se usuário prefere movimento reduzido */
      @media (prefers-reduced-motion: reduce) {
        .skeleton-loader {
          animation: none;
          background: #f0f0f0;
        }
        
        .skeleton-loader.dark {
          background: #374151;
        }
      }

      /* Tema escuro */
      [data-theme="dark"] .skeleton-loader {
        background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
        background-size: 200% 100%;
      }

      [data-theme="dark"] .skeleton-loader.dark {
        background: linear-gradient(90deg, #1f2937 25%, #374151 50%, #1f2937 75%);
        background-size: 200% 100%;
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Cria skeleton para texto
   * @param {Object} options - Opções do skeleton
   * @returns {HTMLElement} - Elemento skeleton
   */
  createTextSkeleton(options = {}) {
    const { 
      lines = 3, 
      className = '', 
      id = null,
      shortLines = false 
    } = options;

    const container = document.createElement('div');
    if (id) container.id = id;
    container.className = `skeleton-text-container ${className}`;

    for (let i = 0; i < lines; i++) {
      const line = document.createElement('div');
      line.className = 'skeleton-loader skeleton-text';
      
      if (shortLines && i === lines - 1) {
        line.classList.add('short');
      } else if (i === 0) {
        line.classList.add('medium');
      } else {
        line.classList.add('long');
      }
      
      container.appendChild(line);
    }

    return container;
  }

  /**
   * Cria skeleton para título
   * @param {Object} options - Opções do skeleton
   * @returns {HTMLElement} - Elemento skeleton
   */
  createTitleSkeleton(options = {}) {
    const { className = '', id = null } = options;
    
    const title = document.createElement('div');
    if (id) title.id = id;
    title.className = `skeleton-loader skeleton-title ${className}`;
    
    return title;
  }

  /**
   * Cria skeleton para botão
   * @param {Object} options - Opções do skeleton
   * @returns {HTMLElement} - Elemento skeleton
   */
  createButtonSkeleton(options = {}) {
    const { className = '', id = null, width = '120px' } = options;
    
    const button = document.createElement('div');
    if (id) button.id = id;
    button.className = `skeleton-loader skeleton-button ${className}`;
    button.style.width = width;
    
    return button;
  }

  /**
   * Cria skeleton para avatar
   * @param {Object} options - Opções do skeleton
   * @returns {HTMLElement} - Elemento skeleton
   */
  createAvatarSkeleton(options = {}) {
    const { className = '', id = null, size = '40px' } = options;
    
    const avatar = document.createElement('div');
    if (id) avatar.id = id;
    avatar.className = `skeleton-loader skeleton-avatar ${className}`;
    avatar.style.width = size;
    avatar.style.height = size;
    
    return avatar;
  }

  /**
   * Cria skeleton para card
   * @param {Object} options - Opções do skeleton
   * @returns {HTMLElement} - Elemento skeleton
   */
  createCardSkeleton(options = {}) {
    const { 
      className = '', 
      id = null,
      showImage = true,
      showTitle = true,
      showText = true,
      showButton = true
    } = options;

    const card = document.createElement('div');
    if (id) card.id = id;
    card.className = `skeleton-card ${className}`;

    if (showImage) {
      const image = document.createElement('div');
      image.className = 'skeleton-loader skeleton-image';
      card.appendChild(image);
    }

    if (showTitle) {
      const title = this.createTitleSkeleton();
      card.appendChild(title);
    }

    if (showText) {
      const text = this.createTextSkeleton({ lines: 2, shortLines: true });
      card.appendChild(text);
    }

    if (showButton) {
      const button = this.createButtonSkeleton();
      card.appendChild(button);
    }

    return card;
  }

  /**
   * Cria skeleton para lista
   * @param {Object} options - Opções do skeleton
   * @returns {HTMLElement} - Elemento skeleton
   */
  createListSkeleton(options = {}) {
    const { 
      className = '', 
      id = null,
      items = 5,
      showAvatar = true
    } = options;

    const list = document.createElement('div');
    if (id) list.id = id;
    list.className = `skeleton-list ${className}`;

    for (let i = 0; i < items; i++) {
      const item = document.createElement('div');
      item.className = 'skeleton-list-item';

      if (showAvatar) {
        const avatar = this.createAvatarSkeleton();
        item.appendChild(avatar);
      }

      const text = this.createTextSkeleton({ lines: 1 });
      item.appendChild(text);

      list.appendChild(item);
    }

    return list;
  }

  /**
   * Cria skeleton para resultado de verificação
   * @param {Object} options - Opções do skeleton
   * @returns {HTMLElement} - Elemento skeleton
   */
  createVerificationResultSkeleton(options = {}) {
    const { className = '', id = null } = options;

    const container = document.createElement('div');
    if (id) container.id = id;
    container.className = `verification-skeleton ${className}`;

    // Score skeleton
    const scoreContainer = document.createElement('div');
    scoreContainer.className = 'mb-4';
    
    const scoreTitle = this.createTitleSkeleton({ className: 'mb-2' });
    const scoreBar = document.createElement('div');
    scoreBar.className = 'skeleton-loader';
    scoreBar.style.height = '20px';
    scoreBar.style.borderRadius = '10px';
    scoreBar.style.width = '200px';
    
    scoreContainer.appendChild(scoreTitle);
    scoreContainer.appendChild(scoreBar);
    container.appendChild(scoreContainer);

    // Classification skeleton
    const classification = this.createTitleSkeleton({ className: 'mb-3' });
    container.appendChild(classification);

    // Text skeleton
    const text = this.createTextSkeleton({ lines: 4, shortLines: true });
    container.appendChild(text);

    // Buttons skeleton
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'd-flex gap-2 mt-4';
    
    const button1 = this.createButtonSkeleton({ width: '100px' });
    const button2 = this.createButtonSkeleton({ width: '120px' });
    
    buttonContainer.appendChild(button1);
    buttonContainer.appendChild(button2);
    container.appendChild(buttonContainer);

    return container;
  }

  /**
   * Mostra skeleton em um elemento
   * @param {HTMLElement} element - Elemento onde mostrar o skeleton
   * @param {string} type - Tipo de skeleton
   * @param {Object} options - Opções do skeleton
   */
  showSkeleton(element, type, options = {}) {
    if (!element) return;

    const skeletonId = `skeleton-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    let skeleton;

    switch (type) {
      case 'text':
        skeleton = this.createTextSkeleton({ ...options, id: skeletonId });
        break;
      case 'title':
        skeleton = this.createTitleSkeleton({ ...options, id: skeletonId });
        break;
      case 'button':
        skeleton = this.createButtonSkeleton({ ...options, id: skeletonId });
        break;
      case 'avatar':
        skeleton = this.createAvatarSkeleton({ ...options, id: skeletonId });
        break;
      case 'card':
        skeleton = this.createCardSkeleton({ ...options, id: skeletonId });
        break;
      case 'list':
        skeleton = this.createListSkeleton({ ...options, id: skeletonId });
        break;
      case 'verification':
        skeleton = this.createVerificationResultSkeleton({ ...options, id: skeletonId });
        break;
      default:
        skeleton = this.createTextSkeleton({ ...options, id: skeletonId });
    }

    // Armazena conteúdo original
    const originalContent = element.innerHTML;
    this.skeletons.set(skeletonId, {
      element,
      originalContent,
      type
    });

    // Substitui conteúdo pelo skeleton
    element.innerHTML = '';
    element.appendChild(skeleton);
  }

  /**
   * Remove skeleton de um elemento
   * @param {string} skeletonId - ID do skeleton
   * @param {string} newContent - Novo conteúdo (opcional)
   */
  hideSkeleton(skeletonId, newContent = null) {
    const skeletonData = this.skeletons.get(skeletonId);
    if (!skeletonData) return;

    const { element, originalContent } = skeletonData;

    // Restaura conteúdo original ou usa novo conteúdo
    element.innerHTML = newContent || originalContent;
    
    // Remove do mapa
    this.skeletons.delete(skeletonId);
  }

  /**
   * Remove todos os skeletons
   */
  hideAllSkeletons() {
    for (const [skeletonId, skeletonData] of this.skeletons.entries()) {
      this.hideSkeleton(skeletonId);
    }
  }

  /**
   * Cria skeleton customizado
   * @param {string} html - HTML do skeleton
   * @param {Object} options - Opções
   * @returns {HTMLElement} - Elemento skeleton
   */
  createCustomSkeleton(html, options = {}) {
    const { className = '', id = null } = options;
    
    const container = document.createElement('div');
    if (id) container.id = id;
    container.className = `skeleton-custom ${className}`;
    container.innerHTML = html;
    
    // Adiciona classe skeleton-loader a todos os elementos filhos
    const elements = container.querySelectorAll('*');
    elements.forEach(el => {
      if (!el.classList.contains('skeleton-loader')) {
        el.classList.add('skeleton-loader');
      }
    });
    
    return container;
  }
}

// Instância global
const skeletonLoader = new SkeletonLoader();

/**
 * Mostra skeleton em um elemento
 * @param {HTMLElement} element - Elemento
 * @param {string} type - Tipo de skeleton
 * @param {Object} options - Opções
 */
export function showSkeleton(element, type, options = {}) {
  skeletonLoader.showSkeleton(element, type, options);
}

/**
 * Remove skeleton de um elemento
 * @param {string} skeletonId - ID do skeleton
 * @param {string} newContent - Novo conteúdo
 */
export function hideSkeleton(skeletonId, newContent = null) {
  skeletonLoader.hideSkeleton(skeletonId, newContent);
}

/**
 * Remove todos os skeletons
 */
export function hideAllSkeletons() {
  skeletonLoader.hideAllSkeletons();
}

/**
 * Cria skeleton customizado
 * @param {string} html - HTML do skeleton
 * @param {Object} options - Opções
 * @returns {HTMLElement} - Elemento skeleton
 */
export function createCustomSkeleton(html, options = {}) {
  return skeletonLoader.createCustomSkeleton(html, options);
}

export default skeletonLoader;
