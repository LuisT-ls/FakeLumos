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
    nav: {
      brand: 'Fake Lumos',
      how_it_works: 'Como Funciona',
      tips: 'Dicas',
      about: 'Sobre',
      theme_switcher: 'Alternar tema',
      accessibility_menu: 'Acessibilidade'
    },
    sobre: {
      title: 'Sobre - Fake Lumos',
      'header.title': 'Detecte Fake News com IA',
      'header.subtitle': 'Verifique a credibilidade de notícias em segundos',
      'mission.title': 'Nossa Missão',
      'mission.content1':
        'O Fake Lumos nasceu da necessidade de combater a crescente onda de desinformação em nossa sociedade. Nossa missão é empoderar as pessoas com ferramentas e conhecimento para identificar e combater notícias falsas.',
      'mission.content2':
        'Através da combinação de tecnologia avançada e educação digital, buscamos criar um ambiente online mais confiável e transparente.',
      'vision.title': 'Nossa Visão',
      'vision.content1':
        'Aspiramos criar uma sociedade mais consciente e crítica em relação às informações que consome. Visualizamos um futuro onde cada cidadão tenha as ferramentas e o conhecimento necessários para distinguir fatos de ficção.',
      'vision.content2':
        'Queremos ser referência no combate à desinformação, contribuindo para um debate público mais saudável e baseado em fatos.',
      'history.title': 'História do Projeto',
      'history.development.title': 'Início do Desenvolvimento',
      'history.development.content':
        'O projeto começou como trabalho final na disciplina "Algoritmo, Política e Sociedade" na UFBA, sob orientação do Prof. Dr. Paulo Fonseca.',
      'history.ai.title': 'Desenvolvimento da IA',
      'history.ai.content':
        'Implementação de algoritmos de análise de texto e integração com APIs de fact-checking para melhorar a precisão das verificações.',
      'history.launch.title': 'Lançamento',
      'history.launch.content':
        'Disponibilização da ferramenta para o público, com foco em usabilidade e acessibilidade.',
      'team.title': 'Nossa Equipe',
      'team.luis.name': 'Luís Teixeira',
      'team.luis.role': 'Desenvolvedor Full-Stack e Estudante',
      'team.paulo.name': 'Prof. Dr. Paulo Fonseca',
      'team.paulo.role': 'Orientador do Projeto',
      'technologies.title': 'Tecnologias Utilizadas',
      'technologies.bootstrap.name': 'Bootstrap',
      'technologies.bootstrap.description': 'Frontend',
      'technologies.ml.name': 'Machine Learning',
      'technologies.ml.description': 'Análise de Texto',
      'technologies.apis.name': 'APIs',
      'technologies.apis.description': 'Fact-checking',
      'technologies.pwa.name': 'PWA',
      'technologies.pwa.description': 'Mobile-first',
      'footer.about': 'Fake Lumos',
      'footer.description':
        'Combatendo a desinformação com tecnologia e análise crítica.',
      'footer.social': 'Redes Sociais',
      'footer.copyright': '© 2025 Fake Lumos. Todos os direitos reservados.'
    },
    common: {
      language: 'Português',
      loading: 'Carregando...',
      close: 'Fechar'
    },
    accessibility: {
      menu_title: 'Acessibilidade',
      close: 'Fechar',
      contrast: {
        title: 'Contraste',
        normal: 'Normal',
        high: 'Alto Contraste',
        black_yellow: 'Preto/Amarelo',
        yellow_black: 'Amarelo/Preto'
      },
      font_size: {
        title: 'Tamanho da Fonte',
        decrease: 'A-',
        reset: 'A',
        increase: 'A+'
      },
      text_spacing: {
        title: 'Espaçamento de Texto',
        normal: 'Normal',
        medium: 'Médio',
        large: 'Ampliado'
      },
      links: {
        title: 'Links',
        highlight: 'Destacar Links'
      },
      reading: {
        title: 'Leitura Facilitada',
        dyslexic_font: 'Fonte para Dislexia'
      },
      animations: {
        title: 'Animações',
        reduce_motion: 'Reduzir Animações'
      },
      cursor: {
        title: 'Cursor',
        large_cursor: 'Cursor Ampliado'
      },
      reset: {
        button: 'Restaurar Configurações Padrão'
      },
      keyboard_shortcuts: {
        title: 'Atalhos de Teclado',
        toggle_contrast: 'Alternar Contraste',
        toggle_dyslexic_font: 'Alternar Fonte para Dislexia',
        increase_font: 'Aumentar Fonte',
        decrease_font: 'Diminuir Fonte',
        reset_font: 'Resetar Fonte'
      }
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
    accessibility: {
      menu_title: 'Accessibility',
      close: 'Close',
      contrast: {
        title: 'Contrast',
        normal: 'Normal',
        high: 'High Contrast',
        black_yellow: 'Black/Yellow',
        yellow_black: 'Yellow/Black'
      },
      font_size: {
        title: 'Font Size',
        decrease: 'A-',
        reset: 'A',
        increase: 'A+'
      },
      text_spacing: {
        title: 'Text Spacing',
        normal: 'Normal',
        medium: 'Medium',
        large: 'Large'
      },
      links: {
        title: 'Links',
        highlight: 'Highlight Links'
      },
      reading: {
        title: 'Reading Assistance',
        dyslexic_font: 'Dyslexic Font'
      },
      animations: {
        title: 'Animations',
        reduce_motion: 'Reduce Animations'
      },
      cursor: {
        title: 'Cursor',
        large_cursor: 'Large Cursor'
      },
      reset: {
        button: 'Restore Default Settings'
      },
      keyboard_shortcuts: {
        title: 'Keyboard Shortcuts',
        toggle_contrast: 'Toggle Contrast',
        toggle_dyslexic_font: 'Toggle Dyslexic Font',
        increase_font: 'Increase Font',
        decrease_font: 'Decrease Font',
        reset_font: 'Reset Font'
      }
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
    accessibility: {
      menu_title: 'Accesibilidad',
      close: 'Cerrar',
      contrast: {
        title: 'Contraste',
        normal: 'Normal',
        high: 'Alto Contraste',
        black_yellow: 'Negro/Amarillo',
        yellow_black: 'Amarillo/Negro'
      },
      font_size: {
        title: 'Tamaño de Fuente',
        decrease: 'A-',
        reset: 'A',
        increase: 'A+'
      },
      text_spacing: {
        title: 'Espaciado de Texto',
        normal: 'Normal',
        medium: 'Medio',
        large: 'Ampliado'
      },
      links: {
        title: 'Enlaces',
        highlight: 'Resaltar Enlaces'
      },
      reading: {
        title: 'Lectura Facilitada',
        dyslexic_font: 'Fuente para Dislexia'
      },
      animations: {
        title: 'Animaciones',
        reduce_motion: 'Reducir Animaciones'
      },
      cursor: {
        title: 'Cursor',
        large_cursor: 'Cursor Ampliado'
      },
      reset: {
        button: 'Restaurar Configuraciones Predeterminadas'
      },
      keyboard_shortcuts: {
        title: 'Atajos de Teclado',
        toggle_contrast: 'Alternar Contraste',
        toggle_dyslexic_font: 'Alternar Fuente para Dislexia',
        increase_font: 'Aumentar Fuente',
        decrease_font: 'Disminuir Fuente',
        reset_font: 'Restablecer Fuente'
      }
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
    // Processa objetos (seções com intro e items)
    Object.keys(translatedContent).forEach(key => {
      const elements = parentElement.querySelectorAll(
        `[data-i18n="${translationKey}.${key}"]`
      )

      elements.forEach(el => {
        const value = translatedContent[key]

        // Se for um array (lista de itens)
        if (Array.isArray(value)) {
          if (el.tagName === 'UL' || el.tagName === 'OL') {
            const items = el.querySelectorAll('li')
            items.forEach((item, index) => {
              if (value[index]) {
                item.textContent = value[index]
              }
            })
          }
        }
        // Se for um objeto (subseções)
        else if (typeof value === 'object') {
          translateNestedElements(el, `${translationKey}.${key}`)
        }
        // Se for texto simples
        else {
          el.textContent = value
        }
      })
    })
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
    const [homeRes, commonRes, sobreRes] = await Promise.all(
      [
        fetch(`/locales/${lang}/home.json`),
        fetch(`/locales/${lang}/common.json`),
        fetch(`/locales/${lang}/sobre.json`)
      ].map(p =>
        p.catch(err => {
          console.warn(`Failed to load translation file: ${p.url}`, err)
          return null
        })
      )
    )

    if (homeRes?.ok) {
      try {
        const homeTranslations = await homeRes.json()
        translations = { ...translations, ...homeTranslations }
        console.log('Home translations loaded successfully')
      } catch (err) {
        console.warn('Failed to parse home.json:', err)
      }
    }

    if (commonRes?.ok) {
      try {
        const commonTranslations = await commonRes.json()
        translations = { ...translations, ...commonTranslations }
        console.log('Common translations loaded successfully')
      } catch (err) {
        console.warn('Failed to parse common.json:', err)
      }
    }

    if (sobreRes?.ok) {
      try {
        const sobreTranslations = await sobreRes.json()
        translations = { ...translations, ...sobreTranslations }
        console.log('Sobre translations loaded successfully')
      } catch (err) {
        console.warn('Failed to parse sobre.json:', err)
      }
    }

    currentLanguage = lang
    document.documentElement.lang = lang

    console.log('Final translations object:', translations)
    return true
  } catch (error) {
    console.error('Failed to load translations:', error)
    translations = fallbackTranslations[lang] || fallbackTranslations['pt-BR']
    currentLanguage = lang
    document.documentElement.lang = lang
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
    `accessibility.${normalizedKey}`,
    normalizedKey.replace('how_it_works.', 'home.how_it_works.'),
    normalizedKey.replace('home.', ''),
    normalizedKey.replace('tips.', 'home.tips.'),
    normalizedKey.replace('accessibility.', '')
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

  // Debug: log das chaves tentadas
  console.warn(`Translation key not found: ${key}`)
  console.warn(`Tried keys: ${normalizedKey}, ${possibleKeys.join(', ')}`)
  console.warn(`Current translations structure:`, translations)
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
