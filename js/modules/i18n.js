// /js/modules/i18n.js
let currentLanguage = 'pt-BR'
let translations = {}

// Fallback hardcoded
const fallbackTranslations = {
  'pt-BR': {
    home: {
      title: 'Detecte Fake News com IA',
      subtitle: 'Verifique a credibilidade de notícias em segundos'
    },
    language: 'Português'
  },
  en: {
    home: {
      title: 'Detect Fake News with AI',
      subtitle: 'Check news credibility in seconds'
    },
    language: 'English'
  },
  es: {
    home: {
      title: 'Detecta Fake News con IA',
      subtitle: 'Verifica la credibilidad de noticias en segundos'
    },
    language: 'Español'
  }
}

export async function loadTranslations(lang = 'pt-BR') {
  try {
    const response = await fetch(`/locales/${lang}/home.json`)
    if (!response.ok) throw new Error('Translation not found')

    const homeTranslations = await response.json()

    // Carrega common.json apenas se existir
    let commonTranslations = {}
    try {
      const commonResponse = await fetch(`/locales/${lang}/common.json`)
      if (commonResponse.ok) {
        commonTranslations = await commonResponse.json()
      }
    } catch (e) {
      console.log('Common.json não encontrado para', lang)
    }

    translations = {
      ...fallbackTranslations[lang], // Fallback primeiro
      ...commonTranslations,
      ...homeTranslations
    }

    currentLanguage = lang
    document.documentElement.lang = lang

    return true
  } catch (error) {
    console.error('Failed to load translations:', error)
    translations = fallbackTranslations[lang] || fallbackTranslations['pt-BR']
    return false
  }
}

export function t(key, params = {}) {
  let value = translations

  const keys = key.split('.')
  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) break
  }

  if (typeof value === 'string') {
    return Object.entries(params).reduce((str, [k, v]) => {
      return str.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
    }, value)
  }

  console.warn(`Translation key not found: ${key}`)
  return key // Retorna a chave se não encontrar a tradução
}

export function getCurrentLanguage() {
  return currentLanguage
}
