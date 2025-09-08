/**
 * icons8Manager.js - Gerenciador de ícones do Icons8
 * Alternativa usando ícones do Icons8 quando FontAwesome não está disponível
 */

/**
 * Classe para gerenciar ícones do Icons8
 */
class Icons8Manager {
  constructor() {
    this.baseUrl = 'https://img.icons8.com/';
    this.style = 'fluency'; // ou 'color', 'ios', 'material', etc.
    this.size = '24';
    this.init();
  }

  /**
   * Inicializa o gerenciador
   */
  init() {
    this.iconMap = new Map();
    this.setupIconMapping();
  }

  /**
   * Configura mapeamento de ícones
   */
  setupIconMapping() {
    // Mapeamento de ícones FontAwesome para Icons8
    this.iconMap.set('shield-alt', 'shield');
    this.iconMap.set('moon', 'moon');
    this.iconMap.set('sun', 'sun');
    this.iconMap.set('universal-access', 'accessibility');
    this.iconMap.set('info-circle', 'info');
    this.iconMap.set('lightbulb', 'lightbulb');
    this.iconMap.set('info', 'info');
    this.iconMap.set('chevron-down', 'expand-arrow');
    this.iconMap.set('paste', 'paste');
    this.iconMap.set('robot', 'robot');
    this.iconMap.set('check-circle', 'checkmark');
    this.iconMap.set('search', 'search');
    this.iconMap.set('history', 'history');
    this.iconMap.set('trash-alt', 'trash');
    this.iconMap.set('calendar-alt', 'calendar');
    this.iconMap.set('newspaper', 'news');
    this.iconMap.set('exclamation-triangle', 'warning');
    this.iconMap.set('image', 'image');
    this.iconMap.set('file-alt', 'file');
    this.iconMap.set('gavel', 'gavel');
    this.iconMap.set('envelope', 'email');
    this.iconMap.set('phone', 'phone');
    this.iconMap.set('times', 'close');
    this.iconMap.set('minus', 'minus');
    this.iconMap.set('plus', 'plus');
    this.iconMap.set('redo', 'refresh');
    this.iconMap.set('circle', 'circle');
    this.iconMap.set('exclamation', 'exclamation');
    
    // Ícones sociais
    this.iconMap.set('twitter', 'twitter');
    this.iconMap.set('whatsapp', 'whatsapp');
    this.iconMap.set('telegram', 'telegram');
    this.iconMap.set('github', 'github');
    this.iconMap.set('instagram', 'instagram');
    this.iconMap.set('linkedin', 'linkedin');
  }

  /**
   * Substitui ícones FontAwesome por ícones do Icons8
   */
  replaceWithIcons8() {
    const iconElements = document.querySelectorAll('.fas, .fab, .far');
    
    iconElements.forEach(element => {
      const iconClass = this.getIconClass(element);
      if (iconClass && this.iconMap.has(iconClass)) {
        this.replaceIcon(element, iconClass);
      }
    });
  }

  /**
   * Obtém a classe do ícone
   * @param {HTMLElement} element - Elemento do ícone
   * @returns {string} - Nome da classe do ícone
   */
  getIconClass(element) {
    const classList = Array.from(element.classList);
    const iconClass = classList.find(cls => cls.startsWith('fa-'));
    return iconClass ? iconClass.replace('fa-', '') : null;
  }

  /**
   * Substitui um ícone por ícone do Icons8
   * @param {HTMLElement} element - Elemento do ícone
   * @param {string} iconName - Nome do ícone
   */
  replaceIcon(element, iconName) {
    const icons8Name = this.iconMap.get(iconName);
    if (icons8Name) {
      // Preserva classes e atributos
      const classes = element.className;
      const attributes = {};
      Array.from(element.attributes).forEach(attr => {
        if (attr.name !== 'class') {
          attributes[attr.name] = attr.value;
        }
      });

      // Cria novo elemento img
      const imgElement = document.createElement('img');
      imgElement.src = `${this.baseUrl}${this.style}/${this.size}/${icons8Name}.png`;
      imgElement.alt = iconName;
      imgElement.className = classes;
      
      // Aplica atributos
      Object.entries(attributes).forEach(([name, value]) => {
        imgElement.setAttribute(name, value);
      });

      // Substitui o elemento
      element.parentNode.replaceChild(imgElement, element);
    }
  }

  /**
   * Obtém URL do ícone
   * @param {string} iconName - Nome do ícone
   * @returns {string} - URL do ícone
   */
  getIconUrl(iconName) {
    const icons8Name = this.iconMap.get(iconName);
    return icons8Name ? `${this.baseUrl}${this.style}/${this.size}/${icons8Name}.png` : null;
  }

  /**
   * Define estilo dos ícones
   * @param {string} style - Estilo dos ícones (fluency, color, ios, material, etc.)
   */
  setStyle(style) {
    this.style = style;
  }

  /**
   * Define tamanho dos ícones
   * @param {string} size - Tamanho dos ícones (16, 24, 32, 48, etc.)
   */
  setSize(size) {
    this.size = size;
  }
}

// Instância global
const icons8Manager = new Icons8Manager();

/**
 * Substitui ícones FontAwesome por ícones do Icons8
 */
export function replaceWithIcons8() {
  icons8Manager.replaceWithIcons8();
}

/**
 * Obtém URL do ícone
 * @param {string} iconName - Nome do ícone
 * @returns {string} - URL do ícone
 */
export function getIconUrl(iconName) {
  return icons8Manager.getIconUrl(iconName);
}

/**
 * Define estilo dos ícones
 * @param {string} style - Estilo dos ícones
 */
export function setIconStyle(style) {
  icons8Manager.setStyle(style);
}

/**
 * Define tamanho dos ícones
 * @param {string} size - Tamanho dos ícones
 */
export function setIconSize(size) {
  icons8Manager.setSize(size);
}

export default icons8Manager;
