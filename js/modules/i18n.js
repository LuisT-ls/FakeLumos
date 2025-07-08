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

export async function loadTranslations(lang = 'pt-BR') {
  console.log(`Tentando carregar traduções para: ${lang}`)

  try {
    // Verifica se já está carregado
    const responses = await Promise.all([
      fetch(`/locales/${lang}/home.json`).then(res => {
        console.log(`Status home.json: ${res.status}`) // Log do status
        return res
      }),
      fetch(`/locales/${lang}/common.json`).catch(() => {
        console.log(`Falha ao carregar common.json`) // Log de falha
        return null
      })
    ])

    const [homeRes, commonRes] = responses
    const homeTranslations = homeRes.ok ? await homeRes.json() : {}
    const commonTranslations = commonRes?.ok ? await commonRes.json() : {}

    // Combina traduções com fallback
    translations = {
      ...fallbackTranslations[lang],
      ...commonTranslations,
      ...homeTranslations,
      // Converte estrutura antiga para nova (se necessário)
      ...convertLegacyTranslations(homeTranslations)
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
  // Verifica se as traduções foram carregadas
  if (!translations) {
    console.warn('Translations not loaded yet')
    return key
  }

  // Possíveis variações da chave para tentar encontrar a tradução
  const possibleKeys = [
    key,
    `home.${key}`,
    `how_it_works.${key}`,
    `tips.${key}`,
    key.replace('how_it_works.', 'home.how_it_works.'),
    key.replace('home.', ''),
    key.replace('tips.', 'home.tips.')
  ]

  // Tenta encontrar a tradução em todas as variações possíveis
  for (const k of possibleKeys) {
    const keys = k.split('.')
    let value = translations
    let found = true

    // Navega através do objeto de traduções
    for (const part of keys) {
      // Verifica se a parte atual existe
      if (value[part] === undefined) {
        found = false
        break
      }
      value = value[part]
    }

    // Se encontrou a tradução
    if (found) {
      // Retorna string com parâmetros substituídos
      if (typeof value === 'string') {
        return Object.entries(params).reduce((str, [k, v]) => {
          return str.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
        }, value)
      }
      // Retorna array (para listas)
      else if (Array.isArray(value)) {
        return value
      }
      // Retorna objeto completo (para estruturas complexas)
      else if (typeof value === 'object') {
        return value
      }
    }
  }

  // Fallback: retorna a própria chave se não encontrar tradução
  console.warn(`Translation key not found: ${key}`)
  return key
}

export function translateNestedElements(parentElement, translationKey) {
  const translatedContent = t(translationKey)

  if (
    typeof translatedContent === 'object' &&
    !Array.isArray(translatedContent)
  ) {
    Object.keys(translatedContent).forEach(key => {
      const elements = parentElement.querySelectorAll(
        `[data-i18n="${translationKey}.${key}"]`
      )

      elements.forEach(el => {
        const value = translatedContent[key]

        if (Array.isArray(value)) {
          // Para arrays (como items[]), atualizamos os <li>
          const listItems = el.querySelectorAll('li')
          listItems.forEach((li, index) => {
            if (value[index]) {
              li.textContent = value[index]
            }
          })
        } else {
          // Para strings normais
          el.textContent = value
        }
      })
    })
  }
}

export function getCurrentLanguage() {
  return currentLanguage
}
