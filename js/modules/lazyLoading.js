/**
 * lazyLoading.js - Módulo de lazy loading para imagens e recursos
 * Implementa carregamento sob demanda para melhorar performance
 */

/**
 * Classe para gerenciar lazy loading
 */
class LazyLoader {
  constructor() {
    this.observer = null;
    this.images = new Set();
    this.loadedImages = new Set();
    this.init();
  }

  /**
   * Inicializa o lazy loader
   */
  init() {
    // Verifica suporte ao IntersectionObserver
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    } else {
      // Fallback para navegadores sem suporte
      this.loadAllImages();
    }
  }

  /**
   * Configura o IntersectionObserver
   */
  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '50px', // Carrega 50px antes de entrar na viewport
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
  }

  /**
   * Registra uma imagem para lazy loading
   * @param {HTMLImageElement} img - Elemento de imagem
   */
  registerImage(img) {
    if (!img || this.images.has(img)) return;

    this.images.add(img);

    // Se já tem src, não precisa de lazy loading
    if (img.src && !img.dataset.src) {
      this.loadedImages.add(img);
      return;
    }

    // Adiciona placeholder se não tiver
    if (!img.src) {
      this.addPlaceholder(img);
    }

    // Observa a imagem se o observer estiver disponível
    if (this.observer) {
      this.observer.observe(img);
    } else {
      // Fallback: carrega imediatamente
      this.loadImage(img);
    }
  }

  /**
   * Adiciona placeholder para a imagem
   * @param {HTMLImageElement} img - Elemento de imagem
   */
  addPlaceholder(img) {
    // Cria um placeholder SVG
    const placeholder = this.createPlaceholderSVG(
      img.dataset.width || '300',
      img.dataset.height || '200'
    );
    
    img.src = placeholder;
    img.classList.add('lazy-loading');
  }

  /**
   * Cria um placeholder SVG
   * @param {string} width - Largura do placeholder
   * @param {string} height - Altura do placeholder
   * @returns {string} - Data URL do SVG
   */
  createPlaceholderSVG(width, height) {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="14">
          Carregando...
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Carrega uma imagem
   * @param {HTMLImageElement} img - Elemento de imagem
   */
  loadImage(img) {
    if (this.loadedImages.has(img)) return;

    const src = img.dataset.src;
    if (!src) return;

    // Cria nova imagem para testar carregamento
    const tempImg = new Image();
    
    tempImg.onload = () => {
      // Sucesso: substitui a imagem
      img.src = src;
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-loaded');
      this.loadedImages.add(img);
      
      // Remove atributos de lazy loading
      delete img.dataset.src;
      delete img.dataset.width;
      delete img.dataset.height;
    };

    tempImg.onerror = () => {
      // Erro: mostra placeholder de erro
      img.src = this.createErrorPlaceholder(
        img.dataset.width || '300',
        img.dataset.height || '200'
      );
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-error');
      this.loadedImages.add(img);
    };

    // Inicia carregamento
    tempImg.src = src;
  }

  /**
   * Cria placeholder de erro
   * @param {string} width - Largura
   * @param {string} height - Altura
   * @returns {string} - Data URL do SVG de erro
   */
  createErrorPlaceholder(width, height) {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fee2e2"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#dc2626" font-family="Arial, sans-serif" font-size="12">
          Erro ao carregar
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  /**
   * Carrega todas as imagens (fallback)
   */
  loadAllImages() {
    this.images.forEach(img => this.loadImage(img));
  }

  /**
   * Força carregamento de uma imagem específica
   * @param {HTMLImageElement} img - Elemento de imagem
   */
  forceLoad(img) {
    if (this.observer) {
      this.observer.unobserve(img);
    }
    this.loadImage(img);
  }

  /**
   * Limpa recursos
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.images.clear();
    this.loadedImages.clear();
  }
}

// Instância global
const lazyLoader = new LazyLoader();

/**
 * Inicializa lazy loading para todas as imagens da página
 */
export function initLazyLoading() {
  // Encontra todas as imagens com data-src
  const images = document.querySelectorAll('img[data-src]');
  images.forEach(img => lazyLoader.registerImage(img));

  // Observa mudanças no DOM para novas imagens
  if ('MutationObserver' in window) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Verifica se é uma imagem
            if (node.tagName === 'IMG' && node.dataset.src) {
              lazyLoader.registerImage(node);
            }
            
            // Verifica imagens dentro do nó
            const images = node.querySelectorAll?.('img[data-src]');
            images?.forEach(img => lazyLoader.registerImage(img));
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

/**
 * Adiciona lazy loading a uma imagem específica
 * @param {HTMLImageElement} img - Elemento de imagem
 */
export function addLazyLoading(img) {
  lazyLoader.registerImage(img);
}

/**
 * Força carregamento de uma imagem
 * @param {HTMLImageElement} img - Elemento de imagem
 */
export function forceLoadImage(img) {
  lazyLoader.forceLoad(img);
}

/**
 * Converte imagem normal para lazy loading
 * @param {HTMLImageElement} img - Elemento de imagem
 */
export function convertToLazy(img) {
  if (img.src && !img.dataset.src) {
    img.dataset.src = img.src;
    img.dataset.width = img.width || '300';
    img.dataset.height = img.height || '200';
    img.src = '';
    lazyLoader.registerImage(img);
  }
}

export default lazyLoader;
