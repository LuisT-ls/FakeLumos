// /js/modules/i18n.js
let currentLanguage = 'pt-BR'
let translations = {}

// Fallback mais completo
const fallbackTranslations = {
  'pt-BR': {
    home: {
      'home.title': 'Detecte Fake News com IA',
      'home.subtitle': 'Verifique a credibilidade de notícias em segundos',
      verify_button: 'Verificar Agora',
      'home.how_it_works': 'Como Funciona',
      'home.tips_title': 'Dicas para Identificar Fake News',
      'home.history_title': 'Histórico de Verificações',
      clear_history: 'Limpar Histórico',
      result_title: 'Resultado da Análise',
      share_title: 'Compartilhe esta verificação:',
      'how_it_works.discover': 'Descubra como funciona nossa análise',
      'how_it_works.title': 'Como Funciona',
      'how_it_works.subtitle':
        'Nossa tecnologia de IA analisa o conteúdo em três etapas simples'
    },
    common: {
      language: 'Português',
      loading: 'Carregando...',
      close: 'Fechar'
    },
    how_it_works: {
      discover: 'Descubra como funciona nossa análise',
      title: 'Como Funciona',
      subtitle:
        'Nossa tecnologia de IA analisa o conteúdo em três etapas simples',
      step1: {
        title: 'Cole o Texto',
        description:
          'Insira o conteúdo que deseja verificar no campo abaixo<br />Quanto mais completo o texto, mais precisa será a análise.'
      },
      step2: {
        title: 'Análise Automática',
        description:
          'Nossa IA analisa o conteúdo em busca de sinais de desinformação'
      },
      step3: {
        title: 'Receba o Resultado',
        description:
          'Obtenha uma análise detalhada sobre a credibilidade do conteúdo'
      }
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
    },
    how_it_works: {
      discover: 'Discover how our analysis works',
      title: 'How It Works',
      subtitle: 'Our AI technology analyzes content in three simple steps',
      step1: {
        title: 'Paste the Text',
        description:
          'Insert the content you want to verify in the field below<br />The more complete the text, the more accurate the analysis will be.'
      },
      step2: {
        title: 'Automatic Analysis',
        description: 'Our AI analyzes the content for signs of misinformation'
      },
      step3: {
        title: 'Get the Result',
        description: "Get a detailed analysis about the content's credibility"
      }
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
    },
    how_it_works: {
      discover: 'Descubre cómo funciona nuestro análisis',
      title: 'Cómo Funciona',
      subtitle:
        'Nuestra tecnología de IA analiza el contenido en tres pasos simples',
      step1: {
        title: 'Pega el Texto',
        description:
          'Inserta el contenido que deseas verificar en el campo abajo<br />Cuanto más completo sea el texto, más precisa será el análisis.'
      },
      step2: {
        title: 'Análisis Automático',
        description:
          'Nuestra IA analiza el contenido en busca de señales de desinformación'
      },
      step3: {
        title: 'Recibe el Resultado',
        description:
          'Obtén un análisis detallado sobre la credibilidad del contenido'
      }
    }
  }
}

function translateNestedElements(parentElement, translationKey) {
  const translatedContent = t(translationKey)

  if (typeof translatedContent === 'object' && translatedContent !== null) {
    if (Array.isArray(translatedContent)) {
      // Process arrays (for lists)
      const listItems = parentElement.querySelectorAll('li')
      listItems.forEach((item, index) => {
        if (translatedContent[index]) {
          item.textContent = translatedContent[index]
        }
      })
    } else {
      // Process nested objects
      Object.keys(translatedContent).forEach(key => {
        const elements = parentElement.querySelectorAll(
          `[data-i18n="${translationKey}.${key}"]`
        )
        elements.forEach(el => {
          const value = translatedContent[key]
          if (typeof value === 'object' && value !== null) {
            translateNestedElements(el, `${translationKey}.${key}`)
          } else {
            el.textContent = value
          }
        })
      })
    }
  }
}

export async function loadTranslations(lang = 'pt-BR') {
  console.log(`Tentando carregar traduções para: ${lang}`)

  try {
    // Limpa as traduções atuais
    translations = {}

    // Carrega fallback primeiro
    translations = { ...fallbackTranslations[lang] }

    // Tenta carregar arquivos externos
    const [homeRes, commonRes] = await Promise.all(
      [
        fetch(`/locales/${lang}/home.json`),
        fetch(`/locales/${lang}/common.json`)
      ].map(p => p.catch(() => null))
    )

    if (homeRes?.ok) {
      const homeTranslations = await homeRes.json()
      translations = { ...translations, ...homeTranslations }
    }

    if (commonRes?.ok) {
      const commonTranslations = await commonRes.json()
      translations = { ...translations, ...commonTranslations }
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

// Helper para compatibilidade com versões antigas
function convertLegacyTranslations(translations) {
  const converted = {}
  for (const key in translations) {
    if (key.startsWith('home.')) {
      converted[key.replace('home.', '')] = translations[key]
    }
  }
  return converted
}

export function t(key, params = {}) {
  if (!translations) {
    console.warn('Translations not loaded yet')
    return key
  }

  // Normaliza a chave (converte items[0] para items.0)
  const normalizedKey = key.replace(/\[(\d+)\]/g, '.$1')

  // Busca direta
  const directValue = getNestedValue(translations, normalizedKey)
  if (directValue !== undefined) {
    return processTranslationValue(directValue, params)
  }

  // Tenta variações da chave
  const possibleKeys = [
    `home.${normalizedKey}`,
    `how_it_works.${normalizedKey}`,
    `tips.${normalizedKey}`,
    normalizedKey.replace('how_it_works.', 'home.how_it_works.'),
    normalizedKey.replace('home.', ''),
    normalizedKey.replace('tips.', 'home.tips.')
  ].filter(k => k !== normalizedKey)

  for (const k of possibleKeys) {
    const value = getNestedValue(translations, k)
    if (value !== undefined) {
      return processTranslationValue(value, params)
    }
  }

  // Fallback
  const fallbackValue = getNestedValue(
    fallbackTranslations[currentLanguage],
    normalizedKey
  )
  if (fallbackValue !== undefined) {
    return processTranslationValue(fallbackValue, params)
  }

  console.warn(`Translation key not found: ${key}`)
  return key
}

// Funções auxiliares
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => {
    if (Array.isArray(acc) && /^\d+$/.test(part)) {
      return acc[parseInt(part)]
    }
    return acc && acc[part]
  }, obj)
}

function processTranslationValue(value, params) {
  if (typeof value === 'string') {
    return Object.entries(params).reduce((str, [k, v]) => {
      return str.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
    }, value)
  }
  return value
}

export function getCurrentLanguage() {
  return currentLanguage
}

export { translateNestedElements }
