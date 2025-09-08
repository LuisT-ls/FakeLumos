/**
 * validation.js - Módulo de validação e sanitização
 * Gerencia validação de entrada, sanitização e rate limiting
 */

// Rate Limiter
const rateLimiter = {
  requests: new Map(),
  limit: 10, // 10 requisições
  window: 60000, // por minuto (60 segundos)
  
  /**
   * Verifica se o usuário pode fazer uma requisição
   * @param {string} userId - Identificador do usuário (IP ou ID)
   * @returns {boolean} - Se pode fazer a requisição
   */
  canMakeRequest(userId) {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    // Remove requisições antigas
    const validRequests = userRequests.filter(time => now - time < this.window);
    
    if (validRequests.length >= this.limit) {
      return false;
    }
    
    // Adiciona a nova requisição
    validRequests.push(now);
    this.requests.set(userId, validRequests);
    
    return true;
  },
  
  /**
   * Obtém o tempo restante até poder fazer nova requisição
   * @param {string} userId - Identificador do usuário
   * @returns {number} - Tempo em milissegundos
   */
  getTimeUntilReset(userId) {
    const userRequests = this.requests.get(userId) || [];
    if (userRequests.length === 0) return 0;
    
    const oldestRequest = Math.min(...userRequests);
    const resetTime = oldestRequest + this.window;
    const now = Date.now();
    
    return Math.max(0, resetTime - now);
  },
  
  /**
   * Limpa requisições antigas (chamado periodicamente)
   */
  cleanup() {
    const now = Date.now();
    for (const [userId, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => now - time < this.window);
      if (validRequests.length === 0) {
        this.requests.delete(userId);
      } else {
        this.requests.set(userId, validRequests);
      }
    }
  }
};

// Limpa requisições antigas a cada 5 minutos
setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);

/**
 * Sanitiza texto de entrada removendo conteúdo malicioso
 * @param {string} text - Texto a ser sanitizado
 * @returns {string} - Texto sanitizado
 */
export function sanitizeInput(text) {
  if (typeof text !== 'string') {
    return '';
  }
  
  return text
    // Remove scripts
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: URLs
    .replace(/javascript:/gi, '')
    // Remove data: URLs suspeitos
    .replace(/data:(?!image\/[png|jpg|jpeg|gif|webp])/gi, '')
    // Remove on* attributes
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove tags HTML perigosas
    .replace(/<(iframe|object|embed|link|meta|style)\b[^>]*>/gi, '')
    // Limita tamanho
    .substring(0, 10000)
    .trim();
}

/**
 * Valida se o texto é adequado para análise
 * @param {string} text - Texto a ser validado
 * @returns {Object} - Resultado da validação
 */
export function validateText(text) {
  const errors = [];
  const warnings = [];
  
  // Verifica se o texto existe
  if (!text || typeof text !== 'string') {
    errors.push('Texto é obrigatório');
    return { isValid: false, errors, warnings };
  }
  
  const sanitizedText = sanitizeInput(text);
  
  // Verifica se o texto não está vazio após sanitização
  if (!sanitizedText.trim()) {
    errors.push('Texto contém apenas conteúdo inválido');
    return { isValid: false, errors, warnings };
  }
  
  // Verifica tamanho mínimo
  if (sanitizedText.trim().length < 10) {
    errors.push('Texto deve ter pelo menos 10 caracteres');
    return { isValid: false, errors, warnings };
  }
  
  // Verifica tamanho máximo
  if (sanitizedText.length > 10000) {
    errors.push('Texto muito longo (máximo 10.000 caracteres)');
    return { isValid: false, errors, warnings };
  }
  
  // Avisos
  if (sanitizedText.length < 50) {
    warnings.push('Texto muito curto pode resultar em análise menos precisa');
  }
  
  if (sanitizedText.length > 5000) {
    warnings.push('Texto muito longo pode demorar mais para ser processado');
  }
  
  // Verifica se contém apenas caracteres especiais
  if (!/[a-zA-ZÀ-ÿ]/.test(sanitizedText)) {
    errors.push('Texto deve conter pelo menos algumas letras');
    return { isValid: false, errors, warnings };
  }
  
  return {
    isValid: true,
    errors,
    warnings,
    sanitizedText
  };
}

/**
 * Gera um ID único para o usuário baseado no navegador
 * @returns {string} - ID único do usuário
 */
function generateUserId() {
  // Tenta usar um ID persistente do localStorage
  let userId = localStorage.getItem('user_id');
  
  if (!userId) {
    // Gera um novo ID baseado em timestamp e random
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('user_id', userId);
  }
  
  return userId;
}

/**
 * Verifica rate limiting para o usuário atual
 * @returns {Object} - Resultado da verificação
 */
export function checkRateLimit() {
  const userId = generateUserId();
  const canRequest = rateLimiter.canMakeRequest(userId);
  
  if (!canRequest) {
    const timeUntilReset = rateLimiter.getTimeUntilReset(userId);
    const minutesLeft = Math.ceil(timeUntilReset / 60000);
    
    return {
      allowed: false,
      timeUntilReset,
      message: `Muitas requisições. Tente novamente em ${minutesLeft} minuto(s)`
    };
  }
  
  return { allowed: true };
}

/**
 * Valida e sanitiza entrada do usuário
 * @param {string} text - Texto de entrada
 * @returns {Object} - Resultado da validação completa
 */
export function validateUserInput(text) {
  // Verifica rate limiting primeiro
  const rateLimitCheck = checkRateLimit();
  if (!rateLimitCheck.allowed) {
    return {
      isValid: false,
      errors: [rateLimitCheck.message],
      warnings: [],
      rateLimited: true
    };
  }
  
  // Valida o texto
  const textValidation = validateText(text);
  
  return {
    ...textValidation,
    rateLimited: false
  };
}

/**
 * Valida URL para verificação de links
 * @param {string} url - URL a ser validada
 * @returns {boolean} - Se a URL é válida
 */
export function validateUrl(url) {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * Sanitiza URL removendo parâmetros suspeitos
 * @param {string} url - URL a ser sanitizada
 * @returns {string} - URL sanitizada
 */
export function sanitizeUrl(url) {
  try {
    const urlObj = new URL(url);
    
    // Remove parâmetros suspeitos
    const suspiciousParams = ['javascript', 'data', 'vbscript'];
    for (const param of suspiciousParams) {
      urlObj.searchParams.delete(param);
    }
    
    return urlObj.toString();
  } catch {
    return '';
  }
}

export default {
  sanitizeInput,
  validateText,
  validateUserInput,
  validateUrl,
  sanitizeUrl,
  checkRateLimit,
  rateLimiter
};
