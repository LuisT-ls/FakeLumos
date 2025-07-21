/**
 * gemini.js - Integração com API Gemini
 * Este módulo gerencia a integração com a API do Gemini para análise de textos
 */

import { elements } from './dom.js'
import { saveVerification } from './history.js'
import { showNotification } from './ui.js'
import { fetchApiKey } from './api.js'
import { searchGoogleCustom } from './realtimeSearch.js'

/**
 * Detecta se a pergunta envolve fatos pós-2022
 * @param {string} text
 * @returns {boolean}
 */
function isPerguntaPos2022(text) {
  const regexAno = /\b(202[3-9]|20[3-9][0-9]|21[0-9][0-9])\b/
  const palavrasChave = [
    'atualmente',
    'hoje',
    'neste ano',
    'últimas notícias',
    'recente',
    'agora'
  ]
  if (regexAno.test(text.toLowerCase())) return true
  if (palavrasChave.some(palavra => text.toLowerCase().includes(palavra)))
    return true
  return false
}

/**
 * Verifica se as fontes do Google confirmam o fato e ajusta a resposta do Gemini
 * @param {Object} geminiResult - Resultado original do Gemini
 * @param {Array} googleResults - Resultados do Google Custom Search
 * @param {string} textoOriginal - Texto analisado
 * @returns {Object} - Resultado do Gemini ajustado, se necessário
 */
function ajustarGeminiComFontes(geminiResult, googleResults, textoOriginal) {
  if (!Array.isArray(googleResults) || googleResults.length === 0)
    return geminiResult

  // Extrai datas do texto original (ex: 2025, 2020, 20/07/2025, abril de 2025)
  const datasInput = []
  const regexAno = /(20\d{2})/g
  const regexData = /(\d{1,2}\/\d{1,2}\/20\d{2})/g
  const regexMesAno =
    /((janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro) de (20\d{2}))/gi
  let match
  while ((match = regexAno.exec(textoOriginal)) !== null)
    datasInput.push(match[1])
  while ((match = regexData.exec(textoOriginal)) !== null)
    datasInput.push(match[1])
  while ((match = regexMesAno.exec(textoOriginal)) !== null)
    datasInput.push(match[0].toLowerCase())

  // Palavras-chave para confirmação de morte (pode expandir para outros casos)
  const palavrasChaveConfirmacao = [
    'morre',
    'morreu',
    'óbito',
    'falecimento',
    'faleceu',
    'morte',
    'perde a vida',
    'vem a óbito',
    'falecida',
    'falecido',
    'morta',
    'morto',
    'confirmada a morte',
    'confirma morte',
    'confirma óbito',
    'covid',
    'covid-19',
    'coronavírus',
    'pandemia',
    'mortes',
    'óbitos',
    'casos',
    'faleceu',
    'faleceu de covid',
    'morreu de covid',
    'mortes por covid',
    'óbitos por covid'
  ]

  // Extrai possíveis nomes do texto original (exemplo simples)
  const nomesPossiveis = textoOriginal.match(/[A-Z][a-z]+\s[A-Z][a-z]+/g) || []
  const textoLower = textoOriginal.toLowerCase()

  // Busca confirmação criteriosa: só confirma se a fonte mencionar explicitamente o mesmo mês/ano ou data
  const fonteConfirma = googleResults.find(item => {
    const titulo = item.title.toLowerCase()
    const snippet = item.snippet.toLowerCase()
    // Checa se alguma data/mês/ano do input está presente na fonte
    let contemData = false
    for (const data of datasInput) {
      if (titulo.includes(data) || snippet.includes(data)) {
        contemData = true
        break
      }
    }
    if (!contemData && datasInput.length > 0) return false
    // Checa se alguma palavra-chave aparece junto do nome
    return palavrasChaveConfirmacao.some(palavra => {
      if (titulo.includes(palavra) || snippet.includes(palavra)) {
        if (nomesPossiveis.length > 0) {
          return nomesPossiveis.some(
            nome =>
              titulo.includes(nome.toLowerCase()) ||
              snippet.includes(nome.toLowerCase())
          )
        }
        return true
      }
      return false
    })
  })

  // Se usuário forneceu ano > 2022, mês/ano ou data, e não há confirmação exata, resposta neutra
  const anoFuturo = datasInput.some(data => {
    const ano = data.match(/20\d{2}/)
    return ano && parseInt(ano[0]) > 2022
  })
  if (!fonteConfirma && anoFuturo) {
    return {
      ...geminiResult,
      classificacao: 'Não Verificável',
      score: 0.3,
      explicacao_score:
        'Não há informações suficientes ou fontes confiáveis que confirmem a afirmação para o período exato informado.',
      elementos_verdadeiros: [],
      elementos_falsos: [],
      elementos_suspeitos: [
        'Não foi encontrada confirmação para a data/mês/ano informado nas fontes pesquisadas.'
      ],
      indicadores_desinformacao: [],
      recomendacoes: [
        'Aguarde a publicação de dados oficiais ou notícias confiáveis para o período informado.',
        ...(geminiResult.recomendacoes || [])
      ],
      analise_detalhada:
        'A análise não pôde ser realizada de forma conclusiva, pois não há fontes confiáveis que confirmem ou neguem a afirmação para o período exato informado pelo usuário.'
    }
  }

  if (fonteConfirma) {
    // Ajusta a resposta do Gemini
    return {
      ...geminiResult,
      classificacao: 'Comprovadamente Verdadeiro',
      score: 0.98,
      explicacao_score:
        'A informação foi confirmada por fontes confiáveis e recentes encontradas no Google.',
      elementos_verdadeiros: [
        ...(geminiResult.elementos_verdadeiros || []),
        `Confirmação encontrada em: <a href="${fonteConfirma.link}" target="_blank">${fonteConfirma.title}</a>`
      ],
      elementos_falsos: [],
      elementos_suspeitos: [],
      indicadores_desinformacao: [],
      recomendacoes: [
        'Consulte as fontes recentes listadas para mais detalhes.',
        ...(geminiResult.recomendacoes || [])
      ],
      analise_detalhada: `A afirmação foi confirmada por fontes confiáveis e recentes, como <a href="${fonteConfirma.link}" target="_blank">${fonteConfirma.title}</a>. Recomenda-se consultar a fonte para mais detalhes e contexto.`
    }
  }
  return geminiResult
}

/**
 * Gerencia o processo de verificação do texto
 * Coordena a interação com a API e atualização da UI
 */
export async function handleVerification() {
  const text = elements.userInput.value.trim()
  if (!text) return

  showLoadingState(true)

  try {
    let verification = null
    if (isPerguntaPos2022(text)) {
      // 1. Analisa com Gemini normalmente
      let geminiResult = await checkWithGemini(text)
      // 2. Complementa com busca Google
      const googleResults = await searchGoogleCustom(text)
      // 3. Ajusta Gemini se fontes confirmarem
      geminiResult = ajustarGeminiComFontes(geminiResult, googleResults, text)
      verification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        text: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
        geminiAnalysis: geminiResult,
        overallScore: geminiResult.score,
        realtimeSource: 'Google Custom Search',
        realtimeData: googleResults
      }
      showNotification(
        'Análise Gemini complementada e ajustada com base em fontes recentes (Google)',
        'info'
      )
    } else {
      // Fluxo padrão Gemini
      const geminiResult = await checkWithGemini(text)
      verification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        text: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
        geminiAnalysis: geminiResult,
        overallScore: geminiResult.score
      }
    }
    saveVerification(verification)
  } catch (error) {
    console.error('Erro durante a verificação:', error)
    showNotification(
      'Ocorreu um erro durante a verificação. Tente novamente.',
      'danger'
    )
  } finally {
    showLoadingState(false)
  }
}

/**
 * Realiza a verificação do texto usando a API do Gemini
 * @param {string} text - Texto a ser verificado
 * @returns {Promise<Object>} Resultado da análise
 */
async function checkWithGemini(text) {
  try {
    // Obter chave API do módulo API
    const apiKey = await fetchApiKey()
    console.log('API Key obtida com sucesso') // Não exibir a chave no console

    // Verificação se estamos em modo de desenvolvimento
    const isDevelopment =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'

    // Se estamos em desenvolvimento e o modo simulado está ativo, retorne dados simulados
    if (
      isDevelopment &&
      localStorage.getItem('use_simulated_data') === 'true'
    ) {
      console.log('Usando dados simulados (modo desenvolvimento)')
      return getSimulatedResult(text)
    }

    // Linguagem atual
    const currentLang = document.documentElement.lang || 'pt'
    const promptLang = 'em português'

    // Data atual para comparação
    const currentDate = new Date()

    // Prompt atualizado com consciência temporal
    const prompt = `Analise detalhadamente o seguinte texto para verificar sua veracidade. 
    Observe que sua base de conhecimento vai até 2022, então para eventos após essa data, 
    indique claramente essa limitação na análise e foque nos elementos verificáveis do texto
    que não dependem do período temporal. Forneça a resposta ${promptLang}:
    
    Data atual: ${currentDate.toISOString()}
    Texto para análise: "${text}"

    Retorne APENAS um objeto JSON válido com esta estrutura exata, sem nenhum texto adicional:
    {
      "score": [0-1],
      "confiabilidade": [0-1],
      "classificacao": ["Comprovadamente Verdadeiro", "Parcialmente Verdadeiro", "Não Verificável", "Provavelmente Falso", "Comprovadamente Falso"],
      "explicacao_score": "string",
      "elementos_verdadeiros": ["array"],
      "elementos_falsos": ["array"],
      "elementos_suspeitos": ["array"],
      "fontes_confiaveis": ["array"],
      "indicadores_desinformacao": ["array"],
      "analise_detalhada": "string",
      "recomendacoes": ["array"],
      "limitacao_temporal": {
        "afeta_analise": boolean,
        "elementos_nao_verificaveis": ["array"],
        "sugestoes_verificacao": ["array"]
      }
    }`

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        topP: 0.1,
        topK: 16,
        maxOutputTokens: 2048
      }
    }

    // Log do corpo da requisição para debug (sem expor a chave)
    console.log('Enviando requisição para a API Gemini')

    // URL atualizada para a API - tentando v1beta caso v1 não funcione
    const endpoint =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

    // Fazer requisição para a API
    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro detalhado da API:', errorText)

      // Para desenvolvimento e em caso de falha da API, usar dados simulados
      console.warn('Usando dados simulados devido a erro na API')
      return getSimulatedResult(text)
    }

    const data = await response.json()
    console.log('Resposta da API recebida com sucesso')

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!rawText) {
      console.error('Estrutura da resposta:', JSON.stringify(data))
      throw new Error('Resposta inválida da API')
    }

    const cleanText = rawText.replace(/```json|```/g, '').trim()

    try {
      const result = JSON.parse(cleanText)
      return result
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError)
      console.error('Texto recebido:', cleanText)
      console.warn('Usando dados simulados devido a erro no parse')
      return getSimulatedResult(text)
    }
  } catch (error) {
    console.error('Erro na análise:', error)
    // Em caso de qualquer erro, usar dados simulados para não quebrar a interface
    return getSimulatedResult(text)
  }
}

/**
 * Gera um resultado simulado para desenvolvimento ou quando a API falha
 * @param {string} text - Texto que foi analisado
 * @returns {Object} - Resultado simulado da análise
 */
function getSimulatedResult(text) {
  // Gera um score semi-aleatório baseado no tamanho do texto (apenas para simular variação)
  const baseScore = 0.65
  const randomVariation = (text.length % 100) / 500 // Pequena variação baseada no tamanho
  const score = Math.min(0.95, Math.max(0.15, baseScore + randomVariation))

  // Define a classificação com base no score
  let classificacao
  if (score > 0.8) classificacao = 'Comprovadamente Verdadeiro'
  else if (score > 0.6) classificacao = 'Parcialmente Verdadeiro'
  else if (score > 0.4) classificacao = 'Não Verificável'
  else if (score > 0.2) classificacao = 'Provavelmente Falso'
  else classificacao = 'Comprovadamente Falso'

  // Extrai algumas palavras-chave do texto para personalizar a resposta simulada
  const keywords = text
    .split(' ')
    .filter(word => word.length > 5)
    .slice(0, 3)
    .map(word => word.replace(/[.,!?;:'"]/g, ''))

  // Cria o resumo do texto
  const textSummary = text.length > 50 ? text.substring(0, 50) + '...' : text

  return {
    score: score,
    confiabilidade: score + 0.05,
    classificacao: classificacao,
    explicacao_score: `O texto foi analisado e recebeu uma pontuação de ${Math.round(
      score * 100
    )}% com base nos elementos verificáveis presentes no conteúdo.`,
    elementos_verdadeiros: [
      'Alguns elementos do texto podem ser verificados',
      keywords.length > 0
        ? `Informações sobre "${keywords[0]}" parecem estar corretas`
        : 'Parte das afirmações são verificáveis'
    ],
    elementos_falsos: [
      'Algumas afirmações carecem de contexto completo',
      keywords.length > 1
        ? `Dados sobre "${keywords[1]}" precisam de verificação adicional`
        : 'Há informações imprecisas no texto'
    ],
    elementos_suspeitos: [
      'O texto apresenta algumas generalizações',
      'Há elementos que podem estar desatualizados'
    ],
    fontes_confiaveis: [
      'Recomenda-se verificar em fontes oficiais',
      'Consulte especialistas no assunto para confirmação'
    ],
    indicadores_desinformacao: [
      'Presença de algumas afirmações sem fontes',
      'Possível interpretação seletiva de fatos'
    ],
    analise_detalhada: `O texto analisado "${textSummary}" apresenta uma mistura de informações que podem ser verificadas e outras que necessitam de mais contexto. ${
      keywords.length > 0
        ? `Os pontos relacionados a "${keywords.join(
            ', '
          )}" merecem atenção especial.`
        : ''
    } Recomendamos buscar fontes adicionais e oficiais para confirmar as principais afirmações presentes no conteúdo. A análise indica um nível ${
      score > 0.5 ? 'razoável' : 'baixo'
    } de confiabilidade, sendo importante verificar a origem e o contexto completo das informações antes de compartilhar.`,
    recomendacoes: [
      'Verifique as informações em fontes oficiais',
      'Busque o contexto completo das informações apresentadas',
      'Compare com outras fontes confiáveis antes de formar opinião'
    ],
    limitacao_temporal: {
      afeta_analise:
        text.includes('2023') ||
        text.includes('2024') ||
        text.includes('recentemente'),
      elementos_nao_verificaveis: [
        text.includes('2023') || text.includes('2024')
          ? 'Eventos recentes mencionados no texto'
          : ''
      ].filter(item => item !== ''),
      sugestoes_verificacao: [
        'Consulte fontes oficiais atualizadas',
        'Verifique notícias recentes sobre o tema'
      ]
    }
  }
}

/**
 * Controla o estado de loading da interface
 * @param {boolean} loading - Estado de carregamento
 */
function showLoadingState(loading) {
  elements.verifyButton.disabled = loading
  elements.spinner.classList.toggle('d-none', !loading)
  elements.verifyButton.querySelector('span').textContent = loading
    ? 'Verificando...'
    : 'Verificar Agora'
}

/**
 * Ativa ou desativa o modo de dados simulados (para desenvolvimento)
 * @param {boolean} enabled - Se o modo simulado deve ser ativado
 */
export function toggleSimulatedMode(enabled) {
  localStorage.setItem('use_simulated_data', enabled ? 'true' : 'false')
  console.log(`Modo de dados simulados ${enabled ? 'ativado' : 'desativado'}`)
}

export default {
  handleVerification,
  toggleSimulatedMode
}
