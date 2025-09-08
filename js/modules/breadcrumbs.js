/**
 * breadcrumbs.js - Módulo de breadcrumbs
 * Implementa navegação hierárquica para melhor UX
 */

/**
 * Classe para gerenciar breadcrumbs
 */
class BreadcrumbManager {
  constructor() {
    this.breadcrumbs = [];
    this.container = null;
    this.init();
  }

  /**
   * Inicializa o gerenciador de breadcrumbs
   */
  init() {
    this.createContainer();
    this.setupEventListeners();
    this.updateBreadcrumbs();
  }

  /**
   * Cria container para breadcrumbs
   */
  createContainer() {
    // Verifica se já existe
    this.container = document.querySelector('.breadcrumb-container');
    if (this.container) return;

    // Cria container
    this.container = document.createElement('nav');
    this.container.className = 'breadcrumb-container';
    this.container.setAttribute('aria-label', 'Breadcrumb');
    this.container.style.cssText = `
      margin: 1rem 0;
      padding: 0.5rem 0;
    `;

    // Adiciona estilos CSS
    this.addBreadcrumbStyles();

    // Insere no início do main
    const main = document.querySelector('main');
    if (main) {
      main.insertBefore(this.container, main.firstChild);
    }
  }

  /**
   * Adiciona estilos CSS para breadcrumbs
   */
  addBreadcrumbStyles() {
    const styleId = 'breadcrumb-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .breadcrumb-container {
        font-size: 0.875rem;
        margin: 1rem 0;
        padding: 0.5rem 0;
      }

      .breadcrumb {
        display: flex;
        flex-wrap: wrap;
        list-style: none;
        margin: 0;
        padding: 0;
        background: transparent;
        border-radius: 0;
      }

      .breadcrumb-item {
        display: flex;
        align-items: center;
      }

      .breadcrumb-item + .breadcrumb-item {
        padding-left: 0.5rem;
      }

      .breadcrumb-item + .breadcrumb-item::before {
        content: ">";
        display: inline-block;
        padding-right: 0.5rem;
        color: #6b7280;
        font-weight: bold;
      }

      .breadcrumb-item a {
        color: #4f46e5;
        text-decoration: none;
        transition: color 0.2s ease;
      }

      .breadcrumb-item a:hover {
        color: #3730a3;
        text-decoration: underline;
      }

      .breadcrumb-item.active {
        color: #6b7280;
      }

      .breadcrumb-item.active a {
        color: #6b7280;
        pointer-events: none;
      }

      /* Tema escuro */
      [data-theme="dark"] .breadcrumb-item + .breadcrumb-item::before {
        color: #9ca3af;
      }

      [data-theme="dark"] .breadcrumb-item a {
        color: #818cf8;
      }

      [data-theme="dark"] .breadcrumb-item a:hover {
        color: #a5b4fc;
      }

      [data-theme="dark"] .breadcrumb-item.active,
      [data-theme="dark"] .breadcrumb-item.active a {
        color: #9ca3af;
      }

      /* Responsivo */
      @media (max-width: 768px) {
        .breadcrumb-container {
          font-size: 0.75rem;
        }
        
        .breadcrumb-item + .breadcrumb-item {
          padding-left: 0.25rem;
        }
        
        .breadcrumb-item + .breadcrumb-item::before {
          padding-right: 0.25rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Configura event listeners
   */
  setupEventListeners() {
    // Atualiza breadcrumbs quando a URL muda
    window.addEventListener('popstate', () => {
      this.updateBreadcrumbs();
    });

    // Atualiza breadcrumbs quando elementos são clicados
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (link && link.href.startsWith(window.location.origin)) {
        // Pequeno delay para permitir navegação
        setTimeout(() => this.updateBreadcrumbs(), 100);
      }
    });
  }

  /**
   * Atualiza breadcrumbs baseado na URL atual
   */
  updateBreadcrumbs() {
    const path = window.location.pathname;
    const breadcrumbs = this.generateBreadcrumbs(path);
    this.renderBreadcrumbs(breadcrumbs);
  }

  /**
   * Gera breadcrumbs baseado no caminho
   * @param {string} path - Caminho da URL
   * @returns {Array} - Array de breadcrumbs
   */
  generateBreadcrumbs(path) {
    const breadcrumbs = [];
    
    // Página inicial
    breadcrumbs.push({
      label: 'Início',
      url: '/',
      active: path === '/'
    });

    // Remove barra inicial e divide o caminho
    const segments = path.replace(/^\//, '').split('/').filter(segment => segment);

    let currentPath = '';
    
    segments.forEach((segment, index) => {
      currentPath += '/' + segment;
      
      // Determina se é a última página
      const isLast = index === segments.length - 1;
      
      // Gera label baseado no segmento
      const label = this.generateLabel(segment, currentPath);
      
      breadcrumbs.push({
        label,
        url: currentPath,
        active: isLast
      });
    });

    return breadcrumbs;
  }

  /**
   * Gera label para um segmento do caminho
   * @param {string} segment - Segmento do caminho
   * @param {string} fullPath - Caminho completo
   * @returns {string} - Label formatado
   */
  generateLabel(segment, fullPath) {
    // Mapeamento de segmentos conhecidos
    const labelMap = {
      'pages': 'Páginas',
      'sobre': 'Sobre',
      'privacy': 'Privacidade',
      'terms-of-service': 'Termos de Uso',
      'en': 'English',
      'es': 'Español',
      'pt-BR': 'Português'
    };

    // Verifica se há um mapeamento direto
    if (labelMap[segment]) {
      return labelMap[segment];
    }

    // Tenta encontrar título da página
    const pageTitle = this.getPageTitle(fullPath);
    if (pageTitle) {
      return pageTitle;
    }

    // Formata o segmento (remove hífens, capitaliza)
    return segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Obtém título da página
   * @param {string} path - Caminho da página
   * @returns {string|null} - Título da página
   */
  getPageTitle(path) {
    // Tenta encontrar elemento h1 na página
    const h1 = document.querySelector('h1');
    if (h1 && h1.textContent.trim()) {
      return h1.textContent.trim();
    }

    // Tenta encontrar título no meta
    const titleMeta = document.querySelector('meta[property="og:title"]');
    if (titleMeta) {
      return titleMeta.getAttribute('content');
    }

    // Tenta encontrar título no head
    const title = document.querySelector('title');
    if (title && title.textContent) {
      // Remove sufixo comum do título
      return title.textContent
        .replace(' - Verificador de Fake News', '')
        .replace(' | Detector Gratuito', '')
        .trim();
    }

    return null;
  }

  /**
   * Renderiza breadcrumbs no DOM
   * @param {Array} breadcrumbs - Array de breadcrumbs
   */
  renderBreadcrumbs(breadcrumbs) {
    if (!this.container) return;

    // Cria elemento ol
    const ol = document.createElement('ol');
    ol.className = 'breadcrumb';

    breadcrumbs.forEach((breadcrumb, index) => {
      const li = document.createElement('li');
      li.className = `breadcrumb-item ${breadcrumb.active ? 'active' : ''}`;

      if (breadcrumb.active) {
        // Item ativo (sem link)
        li.innerHTML = `
          <span aria-current="page">${breadcrumb.label}</span>
        `;
      } else {
        // Item com link
        li.innerHTML = `
          <a href="${breadcrumb.url}" aria-label="Ir para ${breadcrumb.label}">
            ${breadcrumb.label}
          </a>
        `;
      }

      ol.appendChild(li);
    });

    // Limpa container e adiciona novo conteúdo
    this.container.innerHTML = '';
    this.container.appendChild(ol);
  }

  /**
   * Adiciona breadcrumb customizado
   * @param {string} label - Label do breadcrumb
   * @param {string} url - URL do breadcrumb
   * @param {boolean} active - Se é o item ativo
   */
  addBreadcrumb(label, url, active = false) {
    const breadcrumb = {
      label,
      url,
      active
    };

    if (active) {
      // Remove active de outros breadcrumbs
      this.breadcrumbs.forEach(b => b.active = false);
    }

    this.breadcrumbs.push(breadcrumb);
    this.renderBreadcrumbs(this.breadcrumbs);
  }

  /**
   * Limpa breadcrumbs
   */
  clearBreadcrumbs() {
    this.breadcrumbs = [];
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  /**
   * Define breadcrumbs customizados
   * @param {Array} breadcrumbs - Array de breadcrumbs
   */
  setBreadcrumbs(breadcrumbs) {
    this.breadcrumbs = breadcrumbs;
    this.renderBreadcrumbs(this.breadcrumbs);
  }

  /**
   * Obtém breadcrumbs atuais
   * @returns {Array} - Array de breadcrumbs
   */
  getBreadcrumbs() {
    return [...this.breadcrumbs];
  }

  /**
   * Atualiza breadcrumbs para uma seção específica
   * @param {string} section - Nome da seção
   */
  updateForSection(section) {
    const breadcrumbs = [
      {
        label: 'Início',
        url: '/',
        active: false
      },
      {
        label: section,
        url: `#${section}`,
        active: true
      }
    ];

    this.setBreadcrumbs(breadcrumbs);
  }

  /**
   * Atualiza breadcrumbs para verificação
   */
  updateForVerification() {
    const breadcrumbs = [
      {
        label: 'Início',
        url: '/',
        active: false
      },
      {
        label: 'Verificação',
        url: '#verification',
        active: true
      }
    ];

    this.setBreadcrumbs(breadcrumbs);
  }

  /**
   * Atualiza breadcrumbs para histórico
   */
  updateForHistory() {
    const breadcrumbs = [
      {
        label: 'Início',
        url: '/',
        active: false
      },
      {
        label: 'Histórico',
        url: '#history',
        active: true
      }
    ];

    this.setBreadcrumbs(breadcrumbs);
  }
}

// Instância global
const breadcrumbManager = new BreadcrumbManager();

/**
 * Atualiza breadcrumbs para uma seção
 * @param {string} section - Nome da seção
 */
export function updateBreadcrumbsForSection(section) {
  breadcrumbManager.updateForSection(section);
}

/**
 * Atualiza breadcrumbs para verificação
 */
export function updateBreadcrumbsForVerification() {
  breadcrumbManager.updateForVerification();
}

/**
 * Atualiza breadcrumbs para histórico
 */
export function updateBreadcrumbsForHistory() {
  breadcrumbManager.updateForHistory();
}

/**
 * Adiciona breadcrumb customizado
 * @param {string} label - Label
 * @param {string} url - URL
 * @param {boolean} active - Se é ativo
 */
export function addBreadcrumb(label, url, active = false) {
  breadcrumbManager.addBreadcrumb(label, url, active);
}

/**
 * Define breadcrumbs customizados
 * @param {Array} breadcrumbs - Array de breadcrumbs
 */
export function setBreadcrumbs(breadcrumbs) {
  breadcrumbManager.setBreadcrumbs(breadcrumbs);
}

/**
 * Limpa breadcrumbs
 */
export function clearBreadcrumbs() {
  breadcrumbManager.clearBreadcrumbs();
}

export default breadcrumbManager;
