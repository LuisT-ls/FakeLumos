/**
 * errorHandler.js - Tratamento global de erros e monitoramento
 * Gerencia erros, Web Vitals e analytics
 */

import { showNotification } from './ui.js';

// Configuração de monitoramento
const MONITORING_CONFIG = {
  enabled: true,
  logErrors: true,
  reportToConsole: true,
  maxErrorReports: 10,
  errorReportingInterval: 30000, // 30 segundos
  isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
};

// Armazena erros para relatório
let errorReports = [];
let lastErrorReport = 0;

/**
 * Classe para gerenciar erros da aplicação
 */
class ErrorHandler {
  constructor() {
    this.setupGlobalErrorHandlers();
    this.setupUnhandledRejectionHandler();
    this.setupPerformanceMonitoring();
  }

  /**
   * Configura handlers globais de erro
   */
  setupGlobalErrorHandlers() {
    // Erro global do JavaScript
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'javascript_error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    });

    // Erro de recursos (imagens, scripts, etc.)
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleError({
          type: 'resource_error',
          message: `Failed to load resource: ${event.target.src || event.target.href}`,
          element: event.target.tagName,
          src: event.target.src || event.target.href,
          timestamp: new Date().toISOString(),
          url: window.location.href
        });
      }
    }, true);
  }

  /**
   * Configura handler para promises rejeitadas
   */
  setupUnhandledRejectionHandler() {
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'unhandled_promise_rejection',
        message: event.reason?.message || 'Unhandled promise rejection',
        reason: event.reason,
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href
      });
    });
  }

  /**
   * Configura monitoramento de performance
   */
  setupPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      // Monitora Core Web Vitals
      this.observeWebVitals();
      
      // Monitora recursos grandes
      this.observeResourceTiming();
      
      // Monitora erros de layout
      this.observeLayoutShifts();
    }
  }

  /**
   * Monitora Core Web Vitals
   */
  observeWebVitals() {
    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.reportMetric('lcp', lastEntry.startTime, {
        element: lastEntry.element?.tagName,
        url: lastEntry.url
      });
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.reportMetric('fid', entry.processingStart - entry.startTime, {
          eventType: entry.name,
          target: entry.target?.tagName
        });
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      if (clsValue > 0) {
        this.reportMetric('cls', clsValue, {
          sources: entries.map(e => e.sources?.[0]?.node?.tagName).filter(Boolean)
        });
      }
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        this.reportMetric('fcp', entry.startTime);
      });
    });
    fcpObserver.observe({ entryTypes: ['paint'] });
  }

  /**
   * Monitora timing de recursos
   */
  observeResourceTiming() {
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        // Reporta recursos grandes (>500KB)
        if (entry.decodedBodySize > 500000) {
          this.reportMetric('large_resource', entry.decodedBodySize, {
            name: entry.name,
            type: entry.initiatorType,
            duration: entry.duration
          });
        }
        
        // Reporta recursos lentos (>3s)
        if (entry.duration > 3000) {
          this.reportMetric('slow_resource', entry.duration, {
            name: entry.name,
            type: entry.initiatorType,
            size: entry.decodedBodySize
          });
        }
      });
    });
    resourceObserver.observe({ entryTypes: ['resource'] });
  }

  /**
   * Monitora layout shifts
   */
  observeLayoutShifts() {
    const layoutObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.value > 0.1) { // CLS > 0.1 é considerado ruim
          this.reportMetric('layout_shift', entry.value, {
            sources: entry.sources?.map(s => s.node?.tagName).filter(Boolean)
          });
        }
      });
    });
    layoutObserver.observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * Trata erros da aplicação
   * @param {Object} errorInfo - Informações do erro
   */
  handleError(errorInfo) {
    if (!MONITORING_CONFIG.enabled) return;

    // Adiciona contexto adicional
    const enrichedError = {
      ...errorInfo,
      sessionId: this.getSessionId(),
      userId: localStorage.getItem('user_id'),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink
      } : null
    };

    // Log no console se habilitado
    if (MONITORING_CONFIG.reportToConsole) {
      console.error('Application Error:', enrichedError);
    }

    // Armazena para relatório
    errorReports.push(enrichedError);

    // Limita número de erros armazenados
    if (errorReports.length > MONITORING_CONFIG.maxErrorReports) {
      errorReports = errorReports.slice(-MONITORING_CONFIG.maxErrorReports);
    }

    // Mostra notificação para erros críticos
    if (this.isCriticalError(errorInfo)) {
      this.showErrorNotification(errorInfo);
    }

    // Tenta reportar erros periodicamente
    this.scheduleErrorReport();
  }

  /**
   * Reporta métrica de performance
   * @param {string} name - Nome da métrica
   * @param {number} value - Valor da métrica
   * @param {Object} metadata - Metadados adicionais
   */
  reportMetric(name, value, metadata = {}) {
    const metric = {
      name,
      value,
      metadata,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      sessionId: this.getSessionId()
    };

    // Log no console para desenvolvimento
    if (MONITORING_CONFIG.isDevelopment) {
      console.log(`Metric: ${name}`, metric);
    }

    // Aqui você pode enviar para um serviço de analytics
    // this.sendToAnalytics(metric);
  }

  /**
   * Verifica se o erro é crítico
   * @param {Object} errorInfo - Informações do erro
   * @returns {boolean}
   */
  isCriticalError(errorInfo) {
    const criticalTypes = [
      'javascript_error',
      'unhandled_promise_rejection'
    ];
    
    return criticalTypes.includes(errorInfo.type) && 
           !errorInfo.message?.includes('ResizeObserver') && // Ignora erros conhecidos
           !errorInfo.message?.includes('Non-Error promise rejection');
  }

  /**
   * Mostra notificação de erro para o usuário
   * @param {Object} errorInfo - Informações do erro
   */
  showErrorNotification(errorInfo) {
    const message = this.getUserFriendlyErrorMessage(errorInfo);
    showNotification(message, 'warning', 5000);
  }

  /**
   * Converte erro técnico em mensagem amigável
   * @param {Object} errorInfo - Informações do erro
   * @returns {string}
   */
  getUserFriendlyErrorMessage(errorInfo) {
    switch (errorInfo.type) {
      case 'javascript_error':
        return 'Ocorreu um erro inesperado. A página será recarregada.';
      case 'unhandled_promise_rejection':
        return 'Erro ao processar solicitação. Tente novamente.';
      case 'resource_error':
        return 'Erro ao carregar recurso. Verifique sua conexão.';
      default:
        return 'Ocorreu um erro. Tente recarregar a página.';
    }
  }

  /**
   * Agenda relatório de erros
   */
  scheduleErrorReport() {
    const now = Date.now();
    if (now - lastErrorReport > MONITORING_CONFIG.errorReportingInterval) {
      this.reportErrors();
      lastErrorReport = now;
    }
  }

  /**
   * Reporta erros acumulados
   */
  reportErrors() {
    if (errorReports.length === 0) return;

    // Aqui você pode enviar para um serviço de monitoramento
    // como Sentry, LogRocket, ou seu próprio backend
    console.log('Reporting errors:', errorReports);
    
    // Limpa erros reportados
    errorReports = [];
  }

  /**
   * Gera ID único da sessão
   * @returns {string}
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Captura erro manualmente
   * @param {Error} error - Erro a ser capturado
   * @param {Object} context - Contexto adicional
   */
  captureError(error, context = {}) {
    this.handleError({
      type: 'manual_capture',
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href
    });
  }

  /**
   * Captura exceção de forma segura
   * @param {Function} fn - Função a ser executada
   * @param {Object} context - Contexto para o erro
   * @returns {*} - Resultado da função ou null se erro
   */
  safeExecute(fn, context = {}) {
    try {
      return fn();
    } catch (error) {
      this.captureError(error, context);
      return null;
    }
  }

  /**
   * Executa função assíncrona de forma segura
   * @param {Function} fn - Função assíncrona
   * @param {Object} context - Contexto para o erro
   * @returns {Promise} - Promise que resolve com resultado ou null
   */
  async safeExecuteAsync(fn, context = {}) {
    try {
      return await fn();
    } catch (error) {
      this.captureError(error, context);
      return null;
    }
  }
}

// Instância global do error handler
const errorHandler = new ErrorHandler();

// Exporta funções úteis
export const captureError = (error, context) => errorHandler.captureError(error, context);
export const safeExecute = (fn, context) => errorHandler.safeExecute(fn, context);
export const safeExecuteAsync = (fn, context) => errorHandler.safeExecuteAsync(fn, context);
export const reportMetric = (name, value, metadata) => errorHandler.reportMetric(name, value, metadata);

export default errorHandler;
