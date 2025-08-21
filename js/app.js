/**
 * app.js - Ponto de entrada principal da aplicação
 * Inicializa todos os módulos e coordena os componentes da aplicação.
 */

// Importação de módulos
import {
  elements,
  initializeDynamicElements,
  setupExpandableSections,
  initializeSkeletonElements
} from './modules/dom.js'

import { setupEventListeners } from './modules/events.js'
import { initThemeSwitch } from './modules/ui.js'
import {
  loadVerificationHistory,
  setupHistoryEvents,
  updateHistoryDisplay
} from './modules/history.js'
import {
  loadAccessibilityPreferences,
  setupAccessibilityListeners,
  setContrast,
  changeFontSize,
  changeLineSpacing,
  toggleHighlightLinks,
  toggleDyslexicFont,
  toggleReducedMotion,
  toggleLargeCursor,
  resetAllAccessibilitySettings
} from './modules/accessibility.js'

import {
  t,
  getCurrentLanguage,
  loadTranslations,
  translateNestedElements
} from './modules/i18n.js'

// Expõe funções imediatamente para que onclick, etc. funcionem
exposeGlobalFunctions()

/**
 * Inicializa a aplicação quando o DOM é carregado
 */
document.addEventListener('DOMContentLoaded', initializeApp)

/**
 * Função principal de inicialização da aplicação
 */
async function initializeApp() {
  try {
    if (window.appInitialized) return
    window.appInitialized = true

    // 1. Carrega traduções primeiro
    await initLanguage()

    // 2. Inicializa o resto da aplicação
    initializeDynamicElements()
    initializeSkeletonElements()
    initThemeSwitch()
    loadAccessibilityPreferences()
    setupExpandableSections()
    await loadVerificationHistory()
    setupEventListeners()
    setupHistoryEvents()
    setupAccessibilityListeners()
    setupLanguageSwitcher()
    registerServiceWorker()
    initPerformanceObservers()

    // Força atualização inicial da UI
    updateUIForLanguage()
  } catch (error) {
    console.error('Erro na inicialização:', error)
  }
}

/**
 * Inicializa o sistema de idiomas
 */
async function initLanguage() {
  try {
    const savedLang = localStorage.getItem('preferredLanguage')
    const browserLang = navigator.language || navigator.userLanguage
    const langToLoad =
      savedLang ||
      (browserLang.startsWith('pt')
        ? 'pt-BR'
        : browserLang.startsWith('es')
        ? 'es'
        : 'en')

    await loadTranslations(langToLoad)

    // Atualiza a UI imediatamente após carregar as traduções
    updateUIForLanguage()
  } catch (error) {
    console.error('Error loading language:', error)
  }
}

/**
 * Atualiza a UI para o idioma atual
 */
function updateUIForLanguage() {
  // Processa todos os elementos com data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    const translation = t(key)

    // Atualiza placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const placeholderKey = el.getAttribute('data-i18n-placeholder')
      const placeholderTranslation = t(placeholderKey)
      if (
        placeholderTranslation &&
        typeof placeholderTranslation === 'string'
      ) {
        el.setAttribute('placeholder', placeholderTranslation)
      }
    })

    // Atualiza atributos aria-label
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      const ariaLabelKey = el.getAttribute('data-i18n-aria-label')
      const ariaLabelTranslation = t(ariaLabelKey)
      if (ariaLabelTranslation && typeof ariaLabelTranslation === 'string') {
        el.setAttribute('aria-label', ariaLabelTranslation)
      }
    })

    // Atualiza atributos content de meta tags
    document.querySelectorAll('[data-i18n-content]').forEach(el => {
      const contentKey = el.getAttribute('data-i18n-content')
      const contentTranslation = t(contentKey)
      if (contentTranslation && typeof contentTranslation === 'string') {
        el.setAttribute('content', contentTranslation)
      }
    })

    // Caso especial para listas (ul/ol)
    if (el.tagName === 'UL' || el.tagName === 'OL') {
      // Se a tradução for um array ou objeto, processa os itens
      if (Array.isArray(translation) || typeof translation === 'object') {
        const items = el.querySelectorAll('li')
        items.forEach((item, index) => {
          const itemKey = `${key}.${index}`
          const itemTranslation = t(itemKey)
          if (itemTranslation && typeof itemTranslation === 'string') {
            item.textContent = itemTranslation
          }
        })
      }
      return
    }

    // Caso especial para elementos de navegação
    if (el.classList.contains('nav-link')) {
      updateNavLink(el, translation)
      return
    }

    // Caso especial para botões com ícones
    if (el.classList.contains('btn-icon')) {
      updateIconButton(el, translation)
      return
    }

    // Processamento padrão
    processElementTranslation(el, translation)

    // Processa elementos com filhos (preserva ícones)
    if (el.children.length > 0) {
      const fragment = document.createDocumentFragment()
      let hasPreservedContent = false

      // Preserva ícones e elementos especiais
      Array.from(el.childNodes).forEach(child => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          // Preserva ícones Font Awesome e elementos com classes específicas
          if (
            child.classList?.contains('fa') ||
            child.classList?.contains('preserve') ||
            child.hasAttribute('data-no-translate')
          ) {
            fragment.appendChild(child.cloneNode(true))
            hasPreservedContent = true
          }
        }
      })

      // Adiciona a tradução
      if (typeof translation === 'string') {
        if (hasPreservedContent) {
          // Adiciona espaço se já houver conteúdo preservado
          fragment.appendChild(document.createTextNode(' ' + translation))
        } else {
          fragment.appendChild(document.createTextNode(translation))
        }
      }

      // Aplica as mudanças
      el.innerHTML = ''
      el.appendChild(fragment)
    }
    // Processa elementos de texto simples
    else if (typeof translation === 'string') {
      el.textContent = translation
    }
  })

  // Processa seções aninhadas (como as dicas)
  const tipsSection = document.querySelector('#dicas')
  if (tipsSection) {
    translateNestedElements(tipsSection, 'tips')
  }

  // Atualiza o idioma do documento
  document.documentElement.lang = getCurrentLanguage()

  // Atualiza o histórico para refletir a mudança de idioma
  updateHistoryDisplay()
}

function updateNavLink(navLink, translation) {
  if (typeof translation !== 'string') return

  // Preserva a estrutura: <i> + texto
  const icon = navLink.querySelector('i')
  const textSpan = navLink.querySelector('span')

  if (icon && textSpan) {
    textSpan.textContent = translation
  } else {
    navLink.innerHTML = `
      ${icon ? icon.outerHTML : ''}
      <span>${translation}</span>
    `
  }
}

function updateIconButton(button, translation) {
  if (typeof translation !== 'string') return

  // Mantém o ícone e atualiza apenas o aria-label
  button.setAttribute('aria-label', translation)
}

function processElementTranslation(el, translation) {
  // Caso especial para listas
  if (el.tagName === 'UL' || el.tagName === 'OL') {
    processListItems(el, translation)
    return
  }

  // Elementos com filhos (preserva estrutura)
  if (el.children.length > 0) {
    const fragment = document.createDocumentFragment()
    let hasPreservedElements = false

    // Preserva elementos não-texto
    Array.from(el.childNodes).forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        fragment.appendChild(child.cloneNode(true))
        hasPreservedElements = true
      }
    })

    // Adiciona tradução se for string
    if (typeof translation === 'string') {
      if (hasPreservedElements) {
        fragment.appendChild(document.createTextNode(' ' + translation))
      } else {
        fragment.appendChild(document.createTextNode(translation))
      }
    }

    el.innerHTML = ''
    el.appendChild(fragment)
  }
  // Elementos de texto simples
  else if (typeof translation === 'string') {
    el.textContent = translation
  }
}

function processListItems(listEl, translation) {
  if (!translation || typeof translation !== 'object') return

  const items = listEl.querySelectorAll('li')
  items.forEach((item, index) => {
    const itemKey = `${listEl.getAttribute('data-i18n')}.${index}`
    const itemTranslation = t(itemKey)

    if (itemTranslation && typeof itemTranslation === 'string') {
      // Preserva a estrutura interna do <li> se existir
      if (item.children.length > 0) {
        const textElements = item.querySelectorAll('span, p')
        if (textElements.length > 0) {
          textElements[0].textContent = itemTranslation
        } else {
          item.innerHTML = itemTranslation
        }
      } else {
        item.textContent = itemTranslation
      }
    }
  })
}

/**
 * Configura o seletor de idiomas
 */
function setupLanguageSwitcher() {
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const lang = btn.getAttribute('data-lang')
      localStorage.setItem('preferredLanguage', lang)

      try {
        await loadTranslations(lang)
        updateUIForLanguage()

        // Atualiza estado ativo dos botões
        document.querySelectorAll('[data-lang]').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-lang') === lang)
        })
      } catch (error) {
        console.error('Error switching language:', error)
      }
    })
  })

  // Marca o idioma ativo inicialmente
  const currentLang = getCurrentLanguage()
  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.classList.toggle(
      'active',
      btn.getAttribute('data-lang') === currentLang
    )
  })
}

/**
 * Registra o Service Worker
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registrado com sucesso:', registration.scope)
        registration.update()
      })
      .catch(error => {
        console.error('Erro no registro do ServiceWorker:', error)
      })
  }
}

/**
 * Inicializa observadores de performance
 */
function initPerformanceObservers() {
  if (!('PerformanceObserver' in window)) return

  const lcpObserver = new PerformanceObserver(list => {
    list.getEntries().forEach(entry => {
      console.log('LCP:', entry.startTime)
    })
  })
  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

  const resourceObserver = new PerformanceObserver(list => {
    list.getEntries().forEach(entry => {
      if (entry.decodedBodySize > 500000) {
        console.warn(
          'Recurso grande carregado:',
          entry.name,
          entry.decodedBodySize
        )
      }
    })
  })
  resourceObserver.observe({ entryTypes: ['resource'] })
}

/**
 * Expõe funções para acesso global
 */
function exposeGlobalFunctions() {
  if (!window.globalFunctionsExposed) {
    window.setContrast = setContrast
    window.changeFontSize = changeFontSize
    window.changeLineSpacing = changeLineSpacing
    window.toggleHighlightLinks = toggleHighlightLinks
    window.toggleDyslexicFont = toggleDyslexicFont
    window.toggleReducedMotion = toggleReducedMotion
    window.toggleLargeCursor = toggleLargeCursor
    window.resetAllAccessibilitySettings = resetAllAccessibilitySettings
    window.globalFunctionsExposed = true
  }
}
