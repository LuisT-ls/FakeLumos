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
  setupHistoryEvents
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

import { loadTranslations, t, getCurrentLanguage } from './modules/i18n.js'

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
  } catch (error) {
    console.error('Error loading language:', error)
  }
}

/**
 * Atualiza a UI para o idioma atual
 */
function updateUIForLanguage() {
  // Atualiza elementos simples
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    const text = t(key)

    // Verifica se é um objeto complexo (não processa aqui)
    if (typeof text === 'object' && text !== null) return

    // Processa strings e arrays
    if (typeof text === 'string' && text !== key) {
      el.textContent = text // Usamos textContent em vez de innerHTML para segurança
    } else if (Array.isArray(text)) {
      // Para arrays, assumimos que é uma lista <li>
      if (el.tagName === 'UL' || el.tagName === 'OL') {
        const items = el.querySelectorAll('li')
        items.forEach((item, index) => {
          if (text[index]) {
            item.textContent = text[index]
          }
        })
      }
    }
  })

  // Processa seções com elementos aninhados
  const tipsSection = document.querySelector('#dicas')
  if (tipsSection) {
    translateNestedElements(tipsSection, 'tips')
  }
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
}

// Traduz a seção de dicas
const tipsSection = document.querySelector('#dicas')
if (tipsSection) {
  translateNestedElements(tipsSection, 'tips')
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
