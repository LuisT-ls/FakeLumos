/**
 * app.js - Ponto de entrada principal da aplicação
 * Inicializa todos os módulos e coordena os componentes da aplicação.
 */

// Variável para evitar inicialização duplicada
let adsInitialized = false

function initializeAds() {
  if (!adsInitialized) {
    console.log('Inicializando anúncios...')
    // Seu código de inicialização de ads aqui
    adsInitialized = true
  } else {
    console.log('Anúncios já inicializados - chamada ignorada')
  }
}

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

// Expõe funções imediatamente para que onclick, etc. funcionem
exposeGlobalFunctions()

/**
 * Inicializa a aplicação quando o DOM é carregado
 * Configura event listeners, carrega histórico e inicializa componentes
 */
document.addEventListener('DOMContentLoaded', initializeApp)

/**
 * Função principal de inicialização da aplicação
 */
async function initializeApp() {
  try {
    // Verificar se já inicializamos antes (previne inicialização duplicada)
    if (window.appInitialized) {
      console.warn('A aplicação já foi inicializada')
      return
    }

    // Marca como inicializado
    window.appInitialized = true
    console.log('Inicializando aplicação...')

    // Inicializar elementos do DOM
    initializeDynamicElements()
    initializeSkeletonElements()

    // Configurar temas e preferências
    initThemeSwitch()
    loadAccessibilityPreferences()

    // Inicializar expandable sections
    setupExpandableSections()

    // Carregar histórico (pode ser assíncrono)
    await loadVerificationHistory()

    // Configurar event listeners
    setupEventListeners()
    setupHistoryEvents()
    setupAccessibilityListeners()

    // Registrar o Service Worker
    registerServiceWorker()

    // Iniciar observadores de performance
    initPerformanceObservers()
  } catch (error) {
    console.error('Erro durante a inicialização da aplicação:', error)
  }
}

/**
 * Registra o Service Worker para funcionalidades offline
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registrado com sucesso:', registration.scope)

        // Verifica se há atualizações
        registration.update().then(() => {
          console.log('Verificando atualizações do Service Worker')
        })
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

  // Observador para LCP (Largest Contentful Paint)
  const lcpObserver = new PerformanceObserver(list => {
    const entries = list.getEntries()
    entries.forEach(entry => {
      console.log('LCP:', entry.startTime)
    })
  })
  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

  // Observador para erros de recursos
  const resourceObserver = new PerformanceObserver(list => {
    list.getEntries().forEach(entry => {
      if (entry.decodedBodySize > 500000) {
        // 500KB
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
 * Expõe funções para acesso global para uso no HTML
 */
function exposeGlobalFunctions() {
  if (!window.globalFunctionsExposed) {
    console.log('Expondo funções globais')

    // Expõe as funções de acessibilidade globalmente para uso em atributos HTML
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
