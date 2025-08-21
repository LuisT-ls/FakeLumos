/**
 * sobre.js - Funcionalidades específicas da página Sobre
 * Inicializa a funcionalidade de internacionalização e acessibilidade
 */

import { loadTranslations, getCurrentLanguage, t } from './modules/i18n.js'

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

import { initThemeSwitch } from './modules/ui.js'

// Função para inicializar a página sobre
async function initSobrePage() {
  try {
    // 1. Carrega o idioma preferido
    await initLanguage()

    // 2. Inicializa funcionalidades de acessibilidade
    loadAccessibilityPreferences()
    setupAccessibilityListeners() // Função do módulo accessibility.js
    setupSobreAccessibilityListeners() // Função específica da página sobre

    // 3. Marca os botões ativos baseado nas preferências carregadas
    markActiveAccessibilityButtons()

    // 4. Inicializa o tema
    initThemeSwitch()

    // 5. Configura o seletor de idiomas
    setupLanguageSwitcher()

    // 6. Atualiza a UI para o idioma atual
    updateUIForLanguage()

    console.log('Página Sobre inicializada com sucesso')
  } catch (error) {
    console.error('Erro ao inicializar página Sobre:', error)
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
 * Marca os botões ativos baseado nas preferências carregadas
 */
function markActiveAccessibilityButtons() {
  // Marca botão de contraste ativo
  const currentContrast = localStorage.getItem('contrast') || 'normal'
  document.querySelectorAll('[data-contrast]').forEach(btn => {
    btn.classList.remove('active')
    if (btn.getAttribute('data-contrast') === currentContrast) {
      btn.classList.add('active')
    }
  })

  // Marca botão de espaçamento ativo
  const currentSpacing = localStorage.getItem('lineSpacing') || 'normal'
  document.querySelectorAll('[data-spacing]').forEach(btn => {
    btn.classList.remove('active')
    if (btn.getAttribute('data-spacing') === currentSpacing) {
      btn.classList.add('active')
    }
  })
}

/**
 * Configura os event listeners específicos da página sobre
 */
function setupSobreAccessibilityListeners() {
  // Contraste
  document.querySelectorAll('[data-contrast]').forEach(btn => {
    btn.addEventListener('click', () => {
      const contrast = btn.getAttribute('data-contrast')

      setContrast(contrast)

      // Atualiza estado ativo dos botões
      document.querySelectorAll('[data-contrast]').forEach(b => {
        b.classList.remove('active')
      })
      btn.classList.add('active')
    })
  })

  // Tamanho da fonte
  document.querySelectorAll('[data-font-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-font-action')
      changeFontSize(action)
    })
  })

  // Espaçamento de texto
  document.querySelectorAll('[data-spacing]').forEach(btn => {
    btn.addEventListener('click', () => {
      const spacing = btn.getAttribute('data-spacing')

      changeLineSpacing(spacing)

      // Atualiza estado ativo dos botões
      document.querySelectorAll('[data-spacing]').forEach(b => {
        b.classList.remove('active')
      })
      btn.classList.add('active')
    })
  })

  // Toggle switches
  const highlightLinksToggle = document.getElementById('highlightLinksToggle')
  if (highlightLinksToggle) {
    highlightLinksToggle.addEventListener('change', () => {
      toggleHighlightLinks(highlightLinksToggle.checked)
    })
  }

  const dyslexicFontToggle = document.getElementById('dyslexicFontToggle')
  if (dyslexicFontToggle) {
    dyslexicFontToggle.addEventListener('change', () => {
      toggleDyslexicFont(dyslexicFontToggle.checked)
    })
  }

  const reducedMotionToggle = document.getElementById('reducedMotionToggle')
  if (reducedMotionToggle) {
    reducedMotionToggle.addEventListener('change', () => {
      toggleReducedMotion(reducedMotionToggle.checked)
    })
  }

  const largeCursorToggle = document.getElementById('largeCursorToggle')
  if (largeCursorToggle) {
    largeCursorToggle.addEventListener('change', () => {
      toggleLargeCursor(largeCursorToggle.checked)
    })
  }

  // Botão de reset
  const resetAccessibilityBtn = document.getElementById('resetAccessibilityBtn')
  if (resetAccessibilityBtn) {
    resetAccessibilityBtn.addEventListener('click', () => {
      resetAllAccessibilitySettings()

      // Reseta os toggles
      if (highlightLinksToggle) highlightLinksToggle.checked = false
      if (dyslexicFontToggle) dyslexicFontToggle.checked = false
      if (reducedMotionToggle) reducedMotionToggle.checked = false
      if (largeCursorToggle) largeCursorToggle.checked = false

      // Remove classes ativas dos botões
      document
        .querySelectorAll('[data-contrast], [data-spacing]')
        .forEach(b => {
          b.classList.remove('active')
        })

      // Marca o botão de contraste normal como ativo
      const normalContrastBtn = document.querySelector(
        '[data-contrast="normal"]'
      )
      if (normalContrastBtn) {
        normalContrastBtn.classList.add('active')
      }
    })
  }

  // Atalhos de teclado
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.altKey) {
      switch (e.key) {
        case 'c':
          e.preventDefault()
          // Alterna entre diferentes tipos de contraste
          const contrastButtons = document.querySelectorAll('[data-contrast]')
          const currentContrast = document.body.classList.contains(
            'high-contrast'
          )
            ? 'high'
            : document.body.classList.contains('black-yellow-contrast')
            ? 'black-yellow'
            : document.body.classList.contains('yellow-black-contrast')
            ? 'yellow-black'
            : 'normal'

          let nextContrast = 'normal'
          if (currentContrast === 'normal') nextContrast = 'high'
          else if (currentContrast === 'high') nextContrast = 'black-yellow'
          else if (currentContrast === 'black-yellow')
            nextContrast = 'yellow-black'
          else nextContrast = 'normal'

          setContrast(nextContrast)

          // Atualiza estado ativo dos botões
          contrastButtons.forEach(b => b.classList.remove('active'))
          const activeBtn = document.querySelector(
            `[data-contrast="${nextContrast}"]`
          )
          if (activeBtn) activeBtn.classList.add('active')
          break
        case 'f':
          e.preventDefault()
          const dyslexicToggle = document.getElementById('dyslexicFontToggle')
          if (dyslexicToggle) {
            dyslexicToggle.checked = !dyslexicToggle.checked
            toggleDyslexicFont(dyslexicToggle.checked)
          }
          break
        case '+':
        case '=':
          e.preventDefault()
          changeFontSize('increase')
          break
        case '-':
          e.preventDefault()
          changeFontSize('decrease')
          break
        case '0':
          e.preventDefault()
          changeFontSize('reset')
          break
      }
    }
  })
}

/**
 * Atualiza a UI para o idioma atual
 */
function updateUIForLanguage() {
  // Processa todos os elementos com data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    const translation = t(key)

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

  // Atualiza o idioma do documento
  document.documentElement.lang = getCurrentLanguage()
}

/**
 * Atualiza links de navegação
 */
function updateNavLink(el, translation) {
  if (typeof translation === 'string') {
    const icon = el.querySelector('i')
    const span = el.querySelector('span')

    if (icon && span) {
      span.textContent = translation
    } else {
      el.textContent = translation
    }
  }
}

/**
 * Atualiza botões com ícones
 */
function updateIconButton(el, translation) {
  if (typeof translation === 'string') {
    el.setAttribute('aria-label', translation)
  }
}

/**
 * Processa a tradução de um elemento
 */
function processElementTranslation(el, translation) {
  if (typeof translation === 'string') {
    el.textContent = translation
  }
}

// Inicializa a página quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initSobrePage)

// Expõe funções para acesso global
window.setContrast = setContrast
window.changeFontSize = changeFontSize
window.changeLineSpacing = changeLineSpacing
window.toggleHighlightLinks = toggleHighlightLinks
window.toggleDyslexicFont = toggleDyslexicFont
window.toggleReducedMotion = toggleReducedMotion
window.toggleLargeCursor = toggleLargeCursor
window.resetAllAccessibilitySettings = resetAllAccessibilitySettings
