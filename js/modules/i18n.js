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
    // Primeiro substitui os parâmetros
    let result = Object.entries(params).reduce((str, [k, v]) => {
      return str.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
    }, value)

    // Depois permite HTML seguro
    if (result.includes('<') || result.includes('>')) {
      const temp = document.createElement('div')
      temp.innerHTML = result
      return temp.textContent ? result : key // Retorna com HTML se for seguro
    }
    return result
  }

  return key
}

export function getCurrentLanguage() {
  return currentLanguage
}
