/**
 * progressiveEnhancement.js - Módulo de progressive enhancement
 * Implementa funcionalidades que se adaptam às capacidades do navegador
 */

/**
 * Classe para gerenciar progressive enhancement
 */
class ProgressiveEnhancement {
  constructor() {
    this.capabilities = this.detectCapabilities();
    this.init();
  }

  /**
   * Detecta capacidades do navegador
   */
  detectCapabilities() {
    return {
      // APIs modernas
      intersectionObserver: 'IntersectionObserver' in window,
      mutationObserver: 'MutationObserver' in window,
      performanceObserver: 'PerformanceObserver' in window,
      serviceWorker: 'serviceWorker' in navigator,
      webWorkers: typeof Worker !== 'undefined',
      
      // CSS features
      cssGrid: CSS.supports('display', 'grid'),
      cssFlexbox: CSS.supports('display', 'flex'),
      cssCustomProperties: CSS.supports('--custom', 'value'),
      cssBackdropFilter: CSS.supports('backdrop-filter', 'blur(10px)'),
      
      // JavaScript features
      es6Modules: 'noModule' in HTMLScriptElement.prototype,
      asyncAwait: (async () => {})().then,
      fetch: 'fetch' in window,
      promises: 'Promise' in window,
      
      // Media features
      touch: 'ontouchstart' in window,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      
      // Storage
      localStorage: 'localStorage' in window,
      sessionStorage: 'sessionStorage' in window,
      indexedDB: 'indexedDB' in window
    };
  }

  /**
   * Inicializa progressive enhancement
   */
  init() {
    this.enhanceBasedOnCapabilities();
    this.setupFallbacks();
    this.setupFeatureDetection();
  }

  /**
   * Aplica melhorias baseadas nas capacidades
   */
  enhanceBasedOnCapabilities() {
    // Intersection Observer para lazy loading
    if (this.capabilities.intersectionObserver) {
      this.enableLazyLoading();
    } else {
      this.enableFallbackLazyLoading();
    }

    // Service Worker para cache
    if (this.capabilities.serviceWorker) {
      this.enableServiceWorker();
    }

    // CSS Grid para layout
    if (this.capabilities.cssGrid) {
      this.enableCSSGrid();
    }

    // Custom properties para temas
    if (this.capabilities.cssCustomProperties) {
      this.enableCustomProperties();
    }

    // Fetch para requisições
    if (this.capabilities.fetch) {
      this.enableFetch();
    } else {
      this.enableXMLHttpRequest();
    }
  }

  /**
   * Configura fallbacks
   */
  setupFallbacks() {
    // Fallback para navegadores sem suporte a ES6
    if (!this.capabilities.es6Modules) {
      this.setupES5Fallback();
    }

    // Fallback para navegadores sem localStorage
    if (!this.capabilities.localStorage) {
      this.setupStorageFallback();
    }

    // Fallback para navegadores sem CSS Grid
    if (!this.capabilities.cssGrid) {
      this.setupGridFallback();
    }
  }

  /**
   * Configura detecção de features
   */
  setupFeatureDetection() {
    // Adiciona classes CSS baseadas nas capacidades
    const html = document.documentElement;
    
    Object.entries(this.capabilities).forEach(([feature, supported]) => {
      html.classList.toggle(`supports-${feature}`, supported);
      html.classList.toggle(`no-${feature}`, !supported);
    });

    // Adiciona classe para navegadores modernos
    if (this.capabilities.es6Modules && this.capabilities.fetch) {
      html.classList.add('modern-browser');
    }
  }

  /**
   * Habilita lazy loading com Intersection Observer
   */
  enableLazyLoading() {
    import('./lazyLoading.js').then(module => {
      module.initLazyLoading();
    }).catch(() => {
      this.enableFallbackLazyLoading();
    });
  }

  /**
   * Habilita lazy loading fallback
   */
  enableFallbackLazyLoading() {
    // Carrega todas as imagens imediatamente
    document.querySelectorAll('img[data-src]').forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.classList.add('loaded');
      }
    });
  }

  /**
   * Habilita Service Worker
   */
  enableServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registrado:', registration);
        })
        .catch(error => {
          console.log('Erro no Service Worker:', error);
        });
    }
  }

  /**
   * Habilita CSS Grid
   */
  enableCSSGrid() {
    document.body.classList.add('css-grid-enabled');
  }

  /**
   * Habilita custom properties
   */
  enableCustomProperties() {
    document.body.classList.add('custom-properties-enabled');
  }

  /**
   * Habilita Fetch
   */
  enableFetch() {
    window.enhancedFetch = window.fetch;
  }

  /**
   * Habilita XMLHttpRequest como fallback
   */
  enableXMLHttpRequest() {
    window.enhancedFetch = function(url, options = {}) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(options.method || 'GET', url);
        
        if (options.headers) {
          Object.entries(options.headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }
        
        xhr.onload = () => {
          resolve({
            ok: xhr.status >= 200 && xhr.status < 300,
            status: xhr.status,
            json: () => Promise.resolve(JSON.parse(xhr.responseText)),
            text: () => Promise.resolve(xhr.responseText)
          });
        };
        
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.send(options.body);
      });
    };
  }

  /**
   * Configura fallback para ES5
   */
  setupES5Fallback() {
    // Adiciona polyfills básicos
    if (!Array.prototype.includes) {
      Array.prototype.includes = function(searchElement) {
        return this.indexOf(searchElement) !== -1;
      };
    }

    if (!String.prototype.startsWith) {
      String.prototype.startsWith = function(searchString) {
        return this.indexOf(searchString) === 0;
      };
    }
  }

  /**
   * Configura fallback para storage
   */
  setupStorageFallback() {
    // Fallback usando cookies
    window.fallbackStorage = {
      getItem: function(key) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
          const [name, value] = cookie.trim().split('=');
          if (name === key) {
            return decodeURIComponent(value);
          }
        }
        return null;
      },
      
      setItem: function(key, value) {
        document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000`;
      },
      
      removeItem: function(key) {
        document.cookie = `${key}=; path=/; max-age=0`;
      }
    };
  }

  /**
   * Configura fallback para CSS Grid
   */
  setupGridFallback() {
    // Adiciona classes para flexbox fallback
    document.querySelectorAll('.grid').forEach(element => {
      element.classList.add('flex-fallback');
    });
  }

  /**
   * Verifica se uma feature é suportada
   * @param {string} feature - Nome da feature
   * @returns {boolean} - Se é suportada
   */
  isSupported(feature) {
    return this.capabilities[feature] || false;
  }

  /**
   * Aplica enhancement condicional
   * @param {string} feature - Feature necessária
   * @param {Function} enhancement - Função de enhancement
   * @param {Function} fallback - Função de fallback
   */
  conditionalEnhancement(feature, enhancement, fallback) {
    if (this.isSupported(feature)) {
      enhancement();
    } else if (fallback) {
      fallback();
    }
  }

  /**
   * Obtém informações das capacidades
   * @returns {Object} - Capacidades detectadas
   */
  getCapabilities() {
    return { ...this.capabilities };
  }
}

// Instância global
const progressiveEnhancement = new ProgressiveEnhancement();

/**
 * Verifica se uma feature é suportada
 * @param {string} feature - Nome da feature
 * @returns {boolean} - Se é suportada
 */
export function isSupported(feature) {
  return progressiveEnhancement.isSupported(feature);
}

/**
 * Aplica enhancement condicional
 * @param {string} feature - Feature necessária
 * @param {Function} enhancement - Função de enhancement
 * @param {Function} fallback - Função de fallback
 */
export function conditionalEnhancement(feature, enhancement, fallback) {
  progressiveEnhancement.conditionalEnhancement(feature, enhancement, fallback);
}

/**
 * Obtém capacidades do navegador
 * @returns {Object} - Capacidades
 */
export function getCapabilities() {
  return progressiveEnhancement.getCapabilities();
}

export default progressiveEnhancement;
