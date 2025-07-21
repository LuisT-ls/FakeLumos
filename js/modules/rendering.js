/**
 * rendering.js - Renderização de resultados
 * Este módulo gerencia a renderização dos resultados da verificação na interface
 */

import { elements } from './dom.js'
import { getScoreClass } from './history.js'
import { handleFeedback } from './events.js'

/**
 * Exibe os resultados da verificação na interface
 * @param {Object} verification - Objeto contendo os resultados da verificação
 */
export function displayResults(verification) {
  if (!verification.geminiAnalysis) {
    elements.result.innerHTML = `<div class="alert alert-danger">Não foi possível realizar a análise. Tente novamente.</div>`
    elements.resultSection.classList.remove('d-none')
    return
  }

  const gemini = verification.geminiAnalysis
  const scorePercentage = Math.round(verification.overallScore * 100)
  const scoreClass = getScoreClass(verification.overallScore)

  // Componente de alerta temporal
  const temporalAlert = gemini.limitacao_temporal?.afeta_analise
    ? `
    <div class="alert alert-warning mb-4">
      <i class="fas fa-clock me-2"></i>
      <strong>Aviso de Limitação Temporal:</strong>
      <p class="mb-2">Esta análise possui elementos posteriores a 2022 que não podem ser completamente verificados.</p>
      ${
        gemini.limitacao_temporal.elementos_nao_verificaveis?.length
          ? `<div class="mb-2">
            <strong>Elementos não verificáveis:</strong>
            <ul class="mb-0">
              ${gemini.limitacao_temporal.elementos_nao_verificaveis
                .map(elem => `<li>${elem}</li>`)
                .join('')}
            </ul>
          </div>`
          : ''
      }
      ${
        gemini.limitacao_temporal.sugestoes_verificacao?.length
          ? `<div>
            <strong>Sugestões para verificação:</strong>
            <ul class="mb-0">
              ${gemini.limitacao_temporal.sugestoes_verificacao
                .map(sug => `<li>${sug}</li>`)
                .join('')}
            </ul>
          </div>`
          : ''
      }
    </div>`
    : ''

  // Seção de fontes do Google
  let googleSection = ''
  if (
    Array.isArray(verification.realtimeData) &&
    verification.realtimeData.length > 0
  ) {
    const topGoogleResults = verification.realtimeData.slice(0, 5)
    googleSection = `
      <div class="card mb-3">
        <div class="card-body">
          <h4 class="h6 mb-3"><i class="fab fa-google me-2"></i>Fontes Recentes (Google)</h4>
          <ul class="list-group list-group-flush">
            ${topGoogleResults
              .map(
                item => `
              <li class="list-group-item">
                <a href="${item.link}" target="_blank" rel="noopener" class="fw-bold">${item.title}</a>
                <div class="small text-muted">${item.snippet}</div>
              </li>
            `
              )
              .join('')}
          </ul>
        </div>
      </div>
    `
  }

  elements.result.innerHTML = `
    <div class="result-card p-4 border rounded shadow-sm">
      ${temporalAlert}
      <div class="mb-4 text-center">
        <div class="display-4 text-${scoreClass}">${scorePercentage}%</div>
        <h3 class="h5">${gemini.classificacao}</h3>
      </div>

      <div class="progress mb-4" style="height: 25px;">
        <div class="progress-bar bg-${scoreClass}"
             role="progressbar"
             style="width: ${scorePercentage}%"
             aria-valuenow="${scorePercentage}"
             aria-valuemin="0"
             aria-valuemax="100">
        </div>
      </div>

      <div class="alert alert-secondary">
        <i class="fas fa-info-circle me-2"></i>
        ${gemini.explicacao_score}
      </div>

      ${generateAnalysisSections(gemini)}
      
      <div class="card mb-3">
        <div class="card-body">
          <h4 class="h6 mb-3">Análise Detalhada</h4>
          <p class="mb-0">${gemini.analise_detalhada}</p>
        </div>
      </div>

      ${googleSection}

      <div class="feedback-section mt-4 text-center" data-verification-id="${
        verification.id
      }">
        <div class="small text-muted mb-2">Esta análise foi útil?</div>
        <div class="btn-group btn-group-sm" role="group" aria-label="Feedback">
          <button class="btn btn-outline-success btn-feedback" data-feedback="positive">
            <i class="fas fa-thumbs-up"></i>
          </button>
          <button class="btn btn-outline-danger btn-feedback" data-feedback="negative">
            <i class="fas fa-thumbs-down"></i>
          </button>
        </div>
      </div>
    </div>
  `

  const feedbackSection = elements.result.querySelector('.feedback-section')
  feedbackSection.querySelectorAll('.btn-feedback').forEach(button => {
    button.addEventListener('click', function () {
      handleFeedback(this, feedbackSection)
    })
  })

  elements.resultSection.classList.remove('d-none')
}

/**
 * Gera as seções HTML para cada parte da análise
 * @param {Object} gemini - Resultado da análise do Gemini
 * @returns {string} HTML das seções de análise
 */
function generateAnalysisSections(gemini) {
  const sections = [
    {
      title: 'Elementos Verificados',
      items: gemini.elementos_verdadeiros,
      colorClass: 'success',
      icon: 'check-circle'
    },
    {
      title: 'Elementos Falsos',
      items: gemini.elementos_falsos,
      colorClass: 'danger',
      icon: 'times-circle'
    },
    {
      title: 'Pontos Suspeitos',
      items: gemini.elementos_suspeitos,
      colorClass: 'warning',
      icon: 'exclamation-triangle'
    },
    {
      title: 'Recomendações',
      items: gemini.recomendacoes,
      colorClass: 'info',
      icon: 'lightbulb'
    }
  ]

  return sections
    .map(({ title, items, colorClass, icon }) =>
      items?.length
        ? `
        <div class="mb-3">
          <h4 class="h6 mb-2">${title}</h4>
          <div class="list-group">
            ${items
              .map(
                item => `
              <div class="list-group-item list-group-item-${colorClass}">
                <i class="fas fa-${icon} me-2"></i>${item}
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `
        : ''
    )
    .join('')
}

export default {
  displayResults
}
