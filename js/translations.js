// Definição de traduções com fallback para inglês
const translations = {
  en: {
    // Navigation
    'Verificador de Fake News': 'Fake News Detector',
    'Como Funciona': 'How It Works',
    Dicas: 'Tips',
    Sobre: 'About',
    'Alternar modo escuro': 'Toggle dark mode',

    // Header
    'Detecte Fake News com IA': 'Detect Fake News with AI',
    'Verifique a credibilidade de notícias em segundos':
      'Check news credibility in seconds',

    // How It Works Section
    'Descubra como funciona nossa análise': 'Discover how our analysis works',
    'Nossa tecnologia de IA analisa o conteúdo em três etapas simples':
      'Our AI technology analyzes content in three simple steps',
    'Cole o Texto': 'Paste Text',
    'Insira o conteúdo que deseja verificar no campo abaixo':
      'Insert the content you want to verify in the field below',
    'Quanto mais completo o texto, mais precisa será a análise.':
      'The more complete the text, the more accurate the analysis will be.',
    'Análise Automática': 'Automatic Analysis',
    'Nossa IA analisa o conteúdo em busca de sinais de desinformação':
      'Our AI analyzes content looking for signs of misinformation',
    'Receba o Resultado': 'Get Results',
    'Obtenha uma análise detalhada sobre a credibilidade do conteúdo':
      "Get a detailed analysis of the content's credibility",

    // Verification Section
    'Verificar Conteúdo': 'Verify Content',
    'Digite ou cole aqui o texto que deseja verificar...':
      'Type or paste here the text you want to verify...',
    'Digite ou cole aqui o texto que deseja verificar:':
      'Type or paste here the text you want to verify:',
    'Verificar Agora': 'Verify Now',
    'Verificando...': 'Verifying...',
    'Nenhuma verificação realizada': 'No verifications performed',
    'Obrigado pelo seu feedback!': 'Thank you for your feedback!',
    'Histórico apagado com sucesso!': 'History cleared successfully!',
    'Você está offline. Algumas funcionalidades podem estar indisponíveis.':
      'You are offline. Some features may be unavailable.',
    'Conexão restabelecida!': 'Connection restored!',
    'Ocorreu um erro durante a verificação. Tente novamente.':
      'An error occurred during verification. Please try again.',
    'Não foi possível realizar a análise. Tente novamente.':
      'Analysis could not be performed. Please try again.',

    // Analysis results translations
    'Elementos Verificados': 'Verified Elements',
    'Elementos Falsos': 'False Elements',
    'Pontos Suspeitos': 'Suspicious Points',
    Recomendações: 'Recommendations',
    'Análise Detalhada': 'Detailed Analysis',
    'Esta análise foi útil?': 'Was this analysis helpful?',

    // Score classifications
    'Comprovadamente Verdadeiro': 'Proven True',
    'Parcialmente Verdadeiro': 'Partially True',
    'Não Verificável': 'Not Verifiable',
    'Provavelmente Falso': 'Probably False',
    'Comprovadamente Falso': 'Proven False',

    'Nenhum resultado encontrado': 'No results found',
    'Sem verificações anteriores': 'No previous verifications',
    'Verifique um texto para ver o resultado aqui':
      'Verify a text to see the result here',
    'Todos os seus resultados aparecerão aqui':
      'All your results will appear here',
    'Suas verificações aparecerão aqui': 'Your verifications will appear here',
    'Resultado da verificação': 'Verification result',
    'Data da verificação': 'Verification date',
    'Ver detalhes': 'See details',
    'Não foi possível carregar o histórico': 'Could not load history',
    'Tente novamente mais tarde': 'Please try again later',
    'Nenhuma verificação': 'No verification',
    'Realize uma verificação para ver o resultado':
      'Perform a verification to see the result',

    // Results Section
    'Resultado da Análise': 'Analysis Result',
    'Compartilhe esta verificação:': 'Share this verification:',

    // Tips Section
    'Dicas para Identificar Fake News': 'Tips to Identify Fake News',
    'Verifique a Fonte': 'Check the Source',
    'Antes de compartilhar uma notícia, considere:':
      'Before sharing news, consider:',
    'Verifique se o site é conhecido e confiável':
      'Check if the website is known and reliable',
    'Procure informações sobre o autor da notícia':
      'Look for information about the news author',
    'Confira se outros veículos respeitados também publicaram o mesmo conteúdo':
      'Check if other respected outlets have also published the same content',
    'Desconfie de sites com nomes muito similares a portais conhecidos':
      'Be suspicious of sites with names very similar to known portals',

    'Analise a Data': 'Check the Date',
    'A data de publicação é crucial:': 'The publication date is crucial:',
    'Verifique quando a notícia foi publicada originalmente':
      'Check when the news was originally published',
    'Fique atento a conteúdos antigos sendo repostados como novos':
      'Be aware of old content being reposted as new',
    'Considere se o contexto temporal faz sentido':
      'Consider if the temporal context makes sense',
    'Busque atualizações mais recentes sobre o assunto':
      'Look for more recent updates on the subject',

    'Pesquise em Outras Fontes': 'Research Other Sources',
    'Compare as informações:': 'Compare the information:',
    'Procure a mesma notícia em diferentes veículos de comunicação':
      'Look for the same news in different media outlets',
    'Consulte agências de fact-checking': 'Consult fact-checking agencies',
    'Verifique se há consenso entre fontes confiáveis':
      'Check if there is consensus among reliable sources',
    'Desconfie quando apenas um site está noticiando algo "bombástico"':
      'Be suspicious when only one site is reporting something "explosive"',

    'Identifique Sinais de Alerta': 'Identify Warning Signs',
    'Fique atento a estes sinais:': 'Watch out for these signs:',
    'Títulos muito chamativos ou alarmistas': 'Very flashy or alarmist titles',
    'Erros de português e formatação': 'Grammar and formatting errors',
    'Pedidos urgentes de compartilhamento': 'Urgent sharing requests',
    'Uso excessivo de pontuação (!!! ???)':
      'Excessive use of punctuation (!!! ???)',
    'Afirmações muito extremas ou improváveis':
      'Very extreme or unlikely claims',

    'Verifique Imagens e Vídeos': 'Check Images and Videos',
    'Ao analisar conteúdo visual:': 'When analyzing visual content:',
    'Faça uma busca reversa da imagem no Google':
      'Do a reverse image search on Google',
    'Verifique se a imagem foi manipulada ou tirada de contexto':
      'Check if the image was manipulated or taken out of context',
    'Procure a fonte original do vídeo': 'Look for the original video source',
    'Observe detalhes como data, local e elementos visuais que possam indicar manipulação':
      'Look for details like date, location, and visual elements that might indicate manipulation',

    // About Section
    'Este projeto foi desenvolvido com a missão de combater a desinformação e estimular o pensamento crítico. Ele é fruto do trabalho final na disciplina "Algoritmo, Política e Sociedade", ministrada pelo professor Dr. Paulo Fonseca na Universidade Federal da Bahia.':
      'This project was developed with the mission of combating misinformation and promoting critical thinking. It is the result of the final project in the course "Algorithm, Politics, and Society," taught by Professor Dr. Paulo Fonseca at the Federal University of Bahia.',

    // Footer
    'Sobre o Projeto': 'About the Project',
    'Links Úteis': 'Useful Links',
    Contato: 'Contact',
    'Política de Privacidade': 'Privacy Policy',
    'Termos de Uso': 'Terms of Use',
    'Verificador de Fake News. Todos os direitos reservados.':
      '© 2025 Fake News Detector. All rights reserved.',

    // History Section
    'Histórico de Verificações': 'Verification History',
    'Limpar Histórico': 'Clear History',
    'Tem certeza que deseja apagar todo o histórico?':
      'Are you sure you want to delete all history?',
    'Esta ação não poderá ser desfeita e você perderá todas as verificações anteriores.':
      'This action cannot be undone and you will lose all previous verifications.',
    Cancelar: 'Cancel',
    Entendi: 'Understood',
    'Histórico Vazio': 'Empty History',
    'Não há histórico para apagar': 'No history to clear',
    'Realize algumas verificações primeiro para construir seu histórico.':
      'Perform some verifications first to build your history.',

    // Notifications
    Notificação: 'Notification'
  },
  pt: {}
}

/**
 * Traduz conteúdo dinâmico com suporte a parâmetros
 * @param {string} text - Texto a ser traduzido
 * @param {string} targetLang - Idioma alvo ('en' ou 'pt')
 * @param {object} params - Parâmetros para substituição (opcional)
 * @returns {string} Texto traduzido
 */
export function translateDynamicContent(text, targetLang, params = {}) {
  if (!text) return ''

  // Primeiro tenta a tradução no idioma alvo, depois em inglês, depois retorna o original
  let translation =
    translations[targetLang]?.[text] || translations['en']?.[text] || text

  // Substitui placeholders como {0}, {nome}, etc.
  return translation.replace(/\{(\w+)\}/g, (match, key) => params[key] || match)
}

/**
 * Adiciona atributos de tradução aos elementos
 * @param {HTMLElement} rootElement - Elemento raiz para busca
 */
function addTranslateAttributes(rootElement) {
  const walker = document.createTreeWalker(
    rootElement,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function (node) {
        const text = node.textContent.trim()
        return text ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
      }
    },
    false
  )

  let node
  while ((node = walker.nextNode())) {
    const parent = node.parentElement
    const text = node.textContent.trim()

    if (parent && !parent.hasAttribute('data-translate') && text) {
      // Marca como processado para evitar reprocessamento
      parent.setAttribute('data-translate-processed', 'true')

      // Normaliza o texto para comparação
      const normalizedText = text.replace(/\s+/g, ' ').trim()

      // Procura pela chave exata ou similar
      const matchingKey = Object.keys(translations.en).find(
        key => key.replace(/\s+/g, ' ').trim() === normalizedText
      )

      if (matchingKey) {
        parent.setAttribute('data-translate', matchingKey)
      }
    }
  }
}

/**
 * Traduz a página inteira
 * @param {string} targetLang - Idioma alvo ('en' ou 'pt')
 */
function translatePage(targetLang) {
  // Primeiro processa os atributos de tradução
  addTranslateAttributes(document.body)

  // Aplica as traduções
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate')
    const translation = translateDynamicContent(key, targetLang)

    if (translation) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translation
      } else if (element.tagName === 'IMG' && element.alt) {
        element.alt = translation
      } else {
        element.textContent = translation
      }
    }
  })

  // Atualiza metatags e outros elementos
  updateMetaTags(targetLang)
  updateDynamicPlaceholders(targetLang)
  updateLanguageButton(targetLang)
}

/**
 * Atualiza metatags para SEO
 * @param {string} lang - Idioma atual
 */
function updateMetaTags(lang) {
  const metaTags = {
    en: {
      description:
        'Free fake news verification tool using Artificial Intelligence.',
      ogTitle: 'Fake News Detector',
      ogDescription:
        'Online tool to help identify fake news and misinformation.'
    },
    pt: {
      description:
        'Ferramenta gratuita de verificação de fake news usando Inteligência Artificial.',
      ogTitle: 'Verificador de Fake News',
      ogDescription:
        'Ferramenta online para ajudar na identificação de fake news.'
    }
  }

  const meta = metaTags[lang] || metaTags.pt

  // Atualiza meta tags existentes
  const descriptionMeta = document.querySelector('meta[name="description"]')
  const ogTitleMeta = document.querySelector('meta[property="og:title"]')
  const ogDescriptionMeta = document.querySelector(
    'meta[property="og:description"]'
  )

  if (descriptionMeta) descriptionMeta.content = meta.description
  if (ogTitleMeta) ogTitleMeta.content = meta.ogTitle
  if (ogDescriptionMeta) ogDescriptionMeta.content = meta.ogDescription

  // Atualiza o atributo lang do HTML
  document.documentElement.lang = lang
}

/**
 * Alterna o idioma entre português e inglês
 */
function toggleLanguage() {
  const currentLang = document.documentElement.lang || 'pt'
  const newLang = currentLang === 'pt' ? 'en' : 'pt'

  // Salva preferência no localStorage
  localStorage.setItem('language', newLang)

  // Atualiza a página
  translatePage(newLang)

  // Dispara evento para outros componentes
  window.dispatchEvent(
    new CustomEvent('languageChanged', { detail: { lang: newLang } })
  )
}

/**
 * Atualiza o texto do botão de idioma
 * @param {string} lang - Idioma atual
 */
function updateLanguageButton(lang) {
  const langButtons = document.querySelectorAll('.language-text')
  langButtons.forEach(btn => {
    btn.textContent = lang === 'pt' ? 'EN' : 'PT'
  })
}

/**
 * Atualiza placeholders dinâmicos
 * @param {string} targetLang - Idioma alvo
 */
function updateDynamicPlaceholders(targetLang) {
  const elementsToUpdate = [
    {
      id: 'userInput',
      key: 'Digite ou cole aqui o texto que deseja verificar...'
    }
    // Adicione outros elementos dinâmicos aqui
  ]

  elementsToUpdate.forEach(item => {
    const element = document.getElementById(item.id)
    if (element) {
      const translation = translateDynamicContent(item.key, targetLang)
      if (element.placeholder !== undefined) {
        element.placeholder = translation
      } else if (element.textContent !== undefined) {
        element.textContent = translation
      }
    }
  })
}

/**
 * Adiciona o botão de alternar idioma na navegação
 */
function addLanguageSwitcher() {
  const navbarNav = document.querySelector('#navbarNav .navbar-nav')
  if (!navbarNav || document.getElementById('languageSwitcher')) return

  const langSwitcher = document.createElement('li')
  langSwitcher.className = 'nav-item'
  langSwitcher.innerHTML = `
    <button class="nav-link btn btn-link" id="languageSwitcher" aria-label="Toggle language">
      <i class="fas fa-globe me-1"></i>
      <span class="language-text">${
        document.documentElement.lang === 'pt' ? 'EN' : 'PT'
      }</span>
    </button>
  `
  navbarNav.appendChild(langSwitcher)

  // Adiciona evento de clique
  document
    .getElementById('languageSwitcher')
    .addEventListener('click', toggleLanguage)
}

/**
 * Observa mudanças no DOM para traduzir conteúdo dinâmico
 */
function observeDynamicContent() {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          addTranslateAttributes(node)
          translatePage(document.documentElement.lang || 'pt')
        }
      })
    })
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  })
}

/**
 * Inicializa o sistema de internacionalização
 */
function initializeI18n() {
  // Define o idioma padrão (pt) ou recupera do localStorage
  const defaultLang = navigator.language.startsWith('pt') ? 'pt' : 'en'
  const savedLang = localStorage.getItem('language')
  const currentLang = savedLang || defaultLang

  // Configura o idioma inicial
  document.documentElement.lang = currentLang

  // Adiciona o botão de idioma
  addLanguageSwitcher()

  // Traduz a página
  translatePage(currentLang)

  // Observa mudanças no DOM
  observeDynamicContent()
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeI18n)

// Exportações
export {
  translations,
  translatePage,
  toggleLanguage,
  initializeI18n
}

export default {
  translate: translateDynamicContent,
  changeLanguage: toggleLanguage,
  init: initializeI18n
}
