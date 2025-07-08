// /js/modules/i18n.js
let currentLanguage = 'pt-BR'
let translations = {}

// Fallback mais completo
const fallbackTranslations = {
  'pt-BR': {
    home: {
      title: 'Detecte Fake News com IA',
      subtitle: 'Verifique a credibilidade de notícias em segundos',
      verify_button: 'Verificar Agora',
      how_it_works: 'Como Funciona',
      tips_title: 'Dicas para Identificar Fake News',
      history_title: 'Histórico de Verificações',
      clear_history: 'Limpar Histórico',
      result_title: 'Resultado da Análise',
      share_title: 'Compartilhe esta verificação:'
    },
    common: {
      language: 'Português',
      loading: 'Carregando...',
      close: 'Fechar'
    }
  },
  en: {
    home: {
      title: 'Detect Fake News with AI',
      subtitle: 'Check news credibility in seconds',
      verify_button: 'Verify Now',
      how_it_works: 'How It Works',
      tips_title: 'Tips to Identify Fake News',
      history_title: 'Verification History',
      clear_history: 'Clear History',
      result_title: 'Analysis Result',
      share_title: 'Share this verification:'
    },
    common: {
      language: 'English',
      loading: 'Loading...',
      close: 'Close'
    }
  },
  es: {
    home: {
      title: 'Detecta Fake News con IA',
      subtitle: 'Verifica la credibilidad de noticias en segundos',
      verify_button: 'Verificar Ahora',
      how_it_works: 'Cómo Funciona',
      tips_title: 'Consejos para Identificar Fake News',
      history_title: 'Historial de Verificaciones',
      clear_history: 'Limpiar Historial',
      result_title: 'Resultado del Análisis',
      share_title: 'Comparte esta verificación:'
    },
    common: {
      language: 'Español',
      loading: 'Cargando...',
      close: 'Cerrar'
    }
  }
}

export async function loadTranslations(lang = 'pt-BR') {
  try {
    // Carrega home.json
    const homeResponse = await fetch(`/locales/${lang}/home.json`)
    const homeTranslations = homeResponse.ok ? await homeResponse.json() : {}

    // Carrega common.json
    let commonTranslations = {}
    try {
      const commonResponse = await fetch(`/locales/${lang}/common.json`)
      if (commonResponse.ok) {
        commonTranslations = await commonResponse.json()
      }
    } catch (e) {
      console.log(`common.json not found for ${lang}`)
    }

    // Combina fallback, common e home translations
    translations = {
      ...(fallbackTranslations[lang] || fallbackTranslations['pt-BR']),
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
  const keys = key.split('.')
  let value = translations

  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) {
      console.warn(`Translation missing for key: ${key}`)
      return key // Retorna a chave se não encontrar tradução
    }
  }

  if (typeof value === 'string') {
    return Object.entries(params).reduce((str, [k, v]) => {
      return str.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
    }, value)
  }

  return key
}

export function getCurrentLanguage() {
  return currentLanguage
}
