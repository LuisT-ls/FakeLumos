/**
 * analytics.js - Módulo de analytics avançado
 * Implementa tracking de eventos, métricas de performance e insights de usuário
 */

/**
 * Classe para gerenciar analytics
 */
class AnalyticsManager {
  constructor() {
    this.events = [];
    this.metrics = new Map();
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
    this.config = {
      enabled: true,
      debug: false,
      batchSize: 10,
      flushInterval: 30000, // 30 segundos
      maxRetries: 3
    };
    this.init();
  }

  /**
   * Inicializa o analytics
   */
  init() {
    this.setupPerformanceTracking();
    this.setupUserInteractionTracking();
    this.setupErrorTracking();
    this.setupPageTracking();
    this.startFlushTimer();
  }

  /**
   * Configura tracking de performance
   */
  setupPerformanceTracking() {
    // Core Web Vitals
    this.trackWebVitals();
    
    // Resource timing
    this.trackResourceTiming();
    
    // Navigation timing
    this.trackNavigationTiming();
  }

  /**
   * Configura tracking de interações do usuário
   */
  setupUserInteractionTracking() {
    // Cliques
    document.addEventListener('click', (e) => {
      this.trackEvent('click', {
        element: e.target.tagName,
        className: e.target.className,
        id: e.target.id,
        text: e.target.textContent?.substring(0, 50),
        href: e.target.href
      });
    });

    // Formulários
    document.addEventListener('submit', (e) => {
      this.trackEvent('form_submit', {
        formId: e.target.id,
        formClass: e.target.className,
        action: e.target.action
      });
    });

    // Inputs
    document.addEventListener('input', (e) => {
      if (e.target.type === 'text' || e.target.type === 'textarea') {
        this.trackEvent('input_change', {
          element: e.target.tagName,
          type: e.target.type,
          name: e.target.name,
          id: e.target.id
        });
      }
    });

    // Scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.trackScrollDepth();
      }, 250);
    });

    // Resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.trackEvent('window_resize', {
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 250);
    });
  }

  /**
   * Configura tracking de erros
   */
  setupErrorTracking() {
    window.addEventListener('error', (e) => {
      this.trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error?.stack
      });
    });

    window.addEventListener('unhandledrejection', (e) => {
      this.trackEvent('unhandled_promise_rejection', {
        reason: e.reason?.toString(),
        stack: e.reason?.stack
      });
    });
  }

  /**
   * Configura tracking de página
   */
  setupPageTracking() {
    // Page load
    this.trackEvent('page_view', {
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
      timestamp: Date.now()
    });

    // Page visibility
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('page_visibility_change', {
        hidden: document.hidden,
        visibilityState: document.visibilityState
      });
    });

    // Before unload
    window.addEventListener('beforeunload', () => {
      this.trackEvent('page_unload', {
        url: window.location.href,
        timeOnPage: Date.now() - this.pageLoadTime
      });
    });

    this.pageLoadTime = Date.now();
  }

  /**
   * Track Core Web Vitals
   */
  trackWebVitals() {
    // LCP
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.trackMetric('lcp', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // FID
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.trackMetric('fid', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // CLS
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.trackMetric('cls', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  }

  /**
   * Track resource timing
   */
  trackResourceTiming() {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.decodedBodySize > 100000) { // > 100KB
            this.trackEvent('large_resource', {
              name: entry.name,
              size: entry.decodedBodySize,
              duration: entry.duration,
              type: entry.initiatorType
            });
          }
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
    }
  }

  /**
   * Track navigation timing
   */
  trackNavigationTiming() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        this.trackMetric('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
        this.trackMetric('load_complete', navigation.loadEventEnd - navigation.loadEventStart);
        this.trackMetric('total_page_load', navigation.loadEventEnd - navigation.fetchStart);
      }
    });
  }

  /**
   * Track scroll depth
   */
  trackScrollDepth() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / documentHeight) * 100);

    // Track milestones
    const milestones = [25, 50, 75, 90, 100];
    milestones.forEach(milestone => {
      if (scrollPercent >= milestone && !this.scrollMilestones?.includes(milestone)) {
        this.trackEvent('scroll_depth', { percent: milestone });
        if (!this.scrollMilestones) this.scrollMilestones = [];
        this.scrollMilestones.push(milestone);
      }
    });
  }

  /**
   * Track evento customizado
   * @param {string} eventName - Nome do evento
   * @param {Object} properties - Propriedades do evento
   */
  trackEvent(eventName, properties = {}) {
    if (!this.config.enabled) return;

    const event = {
      event: eventName,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    };

    this.events.push(event);

    if (this.config.debug || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('Analytics Event:', event);
    }

    // Flush se atingir batch size
    if (this.events.length >= this.config.batchSize) {
      this.flush();
    }
  }

  /**
   * Track métrica
   * @param {string} metricName - Nome da métrica
   * @param {number} value - Valor da métrica
   * @param {Object} metadata - Metadados adicionais
   */
  trackMetric(metricName, value, metadata = {}) {
    if (!this.config.enabled) return;

    const metric = {
      metric: metricName,
      value,
      metadata: {
        ...metadata,
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: Date.now(),
        url: window.location.href
      }
    };

    // Armazena métrica
    if (!this.metrics.has(metricName)) {
      this.metrics.set(metricName, []);
    }
    this.metrics.get(metricName).push(metric);

    if (this.config.debug || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('Analytics Metric:', metric);
    }
  }

  /**
   * Track verificação de fake news
   * @param {Object} verificationData - Dados da verificação
   */
  trackVerification(verificationData) {
    this.trackEvent('verification_started', {
      textLength: verificationData.text?.length || 0,
      hasRealtimeData: !!verificationData.realtimeData,
      source: verificationData.realtimeSource || 'gemini_only'
    });

    if (verificationData.geminiAnalysis) {
      this.trackEvent('verification_completed', {
        score: verificationData.geminiAnalysis.score,
        classification: verificationData.geminiAnalysis.classificacao,
        confidence: verificationData.geminiAnalysis.confiabilidade,
        textLength: verificationData.text?.length || 0,
        processingTime: verificationData.processingTime || 0
      });
    }
  }

  /**
   * Track interação com acessibilidade
   * @param {string} feature - Feature de acessibilidade
   * @param {string} action - Ação realizada
   * @param {Object} value - Valor da configuração
   */
  trackAccessibility(feature, action, value = null) {
    this.trackEvent('accessibility_interaction', {
      feature,
      action,
      value,
      timestamp: Date.now()
    });
  }

  /**
   * Track mudança de idioma
   * @param {string} fromLang - Idioma anterior
   * @param {string} toLang - Novo idioma
   */
  trackLanguageChange(fromLang, toLang) {
    this.trackEvent('language_change', {
      from: fromLang,
      to: toLang,
      timestamp: Date.now()
    });
  }

  /**
   * Track mudança de tema
   * @param {string} theme - Novo tema
   */
  trackThemeChange(theme) {
    this.trackEvent('theme_change', {
      theme,
      timestamp: Date.now()
    });
  }

  /**
   * Inicia timer para flush automático
   */
  startFlushTimer() {
    setInterval(() => {
      if (this.events.length > 0) {
        this.flush();
      }
    }, this.config.flushInterval);
  }

  /**
   * Envia eventos para o servidor
   */
  async flush() {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      // Aqui você pode enviar para seu backend de analytics
      // await this.sendToServer(eventsToSend);
      
      if (this.config.debug || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Analytics Flush:', eventsToSend);
      }
    } catch (error) {
      console.error('Analytics flush error:', error);
      // Re-adiciona eventos em caso de erro
      this.events.unshift(...eventsToSend);
    }
  }

  /**
   * Gera ID único da sessão
   * @returns {string} - ID da sessão
   */
  generateSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Obtém ID do usuário
   * @returns {string} - ID do usuário
   */
  getUserId() {
    let userId = localStorage.getItem('analytics_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('analytics_user_id', userId);
    }
    return userId;
  }

  /**
   * Obtém estatísticas da sessão
   * @returns {Object} - Estatísticas
   */
  getSessionStats() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      eventsCount: this.events.length,
      metricsCount: Array.from(this.metrics.values()).reduce((sum, arr) => sum + arr.length, 0),
      timeOnPage: Date.now() - this.pageLoadTime,
      scrollMilestones: this.scrollMilestones || []
    };
  }

  /**
   * Obtém métricas de performance
   * @returns {Object} - Métricas de performance
   */
  getPerformanceMetrics() {
    const metrics = {};
    for (const [name, values] of this.metrics.entries()) {
      if (values.length > 0) {
        const latest = values[values.length - 1];
        metrics[name] = {
          latest: latest.value,
          count: values.length,
          average: values.reduce((sum, m) => sum + m.value, 0) / values.length
        };
      }
    }
    return metrics;
  }

  /**
   * Habilita/desabilita analytics
   * @param {boolean} enabled - Se deve estar habilitado
   */
  setEnabled(enabled) {
    this.config.enabled = enabled;
    localStorage.setItem('analytics_enabled', enabled.toString());
  }

  /**
   * Habilita/desabilita modo debug
   * @param {boolean} debug - Se deve estar em modo debug
   */
  setDebug(debug) {
    this.config.debug = debug;
  }

  /**
   * Limpa dados de analytics
   */
  clearData() {
    this.events = [];
    this.metrics.clear();
    this.scrollMilestones = [];
  }
}

// Instância global
const analytics = new AnalyticsManager();

/**
 * Track evento customizado
 * @param {string} eventName - Nome do evento
 * @param {Object} properties - Propriedades
 */
export function trackEvent(eventName, properties = {}) {
  analytics.trackEvent(eventName, properties);
}

/**
 * Track métrica
 * @param {string} metricName - Nome da métrica
 * @param {number} value - Valor
 * @param {Object} metadata - Metadados
 */
export function trackMetric(metricName, value, metadata = {}) {
  analytics.trackMetric(metricName, value, metadata);
}

/**
 * Track verificação
 * @param {Object} verificationData - Dados da verificação
 */
export function trackVerification(verificationData) {
  analytics.trackVerification(verificationData);
}

/**
 * Track acessibilidade
 * @param {string} feature - Feature
 * @param {string} action - Ação
 * @param {Object} value - Valor
 */
export function trackAccessibility(feature, action, value = null) {
  analytics.trackAccessibility(feature, action, value);
}

/**
 * Track mudança de idioma
 * @param {string} fromLang - Idioma anterior
 * @param {string} toLang - Novo idioma
 */
export function trackLanguageChange(fromLang, toLang) {
  analytics.trackLanguageChange(fromLang, toLang);
}

/**
 * Track mudança de tema
 * @param {string} theme - Novo tema
 */
export function trackThemeChange(theme) {
  analytics.trackThemeChange(theme);
}

/**
 * Obtém estatísticas da sessão
 * @returns {Object} - Estatísticas
 */
export function getSessionStats() {
  return analytics.getSessionStats();
}

/**
 * Obtém métricas de performance
 * @returns {Object} - Métricas
 */
export function getPerformanceMetrics() {
  return analytics.getPerformanceMetrics();
}

/**
 * Habilita/desabilita analytics
 * @param {boolean} enabled - Se deve estar habilitado
 */
export function setAnalyticsEnabled(enabled) {
  analytics.setEnabled(enabled);
}

/**
 * Habilita/desabilita modo debug
 * @param {boolean} debug - Se deve estar em modo debug
 */
export function setAnalyticsDebug(debug) {
  analytics.setDebug(debug);
}

export default analytics;
