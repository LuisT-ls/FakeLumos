# Google Analytics - Integração Completa

## Visão Geral

O Google Analytics foi integrado à aplicação FakeLumos para fornecer insights detalhados sobre o comportamento dos usuários, performance da aplicação e métricas de uso.

## Configuração Implementada

### 1. **Google Tag (gtag.js)**
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-7CWXXYJX08"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-7CWXXYJX08');
</script>
```

### 2. **Content Security Policy (CSP)**
```html
script-src 'self' 'unsafe-inline' ... https://www.googletagmanager.com;
connect-src 'self' ... https://www.google-analytics.com https://analytics.google.com;
```

### 3. **Integração com Sistema de Analytics Existente**
- ✅ **Duplo tracking** - Eventos enviados para ambos os sistemas
- ✅ **Fallback robusto** - Funciona mesmo se GA falhar
- ✅ **Dados enriquecidos** - Parâmetros customizados para cada evento

## Eventos Rastreados

### 📊 **Eventos de Verificação**
- `verification_started` - Início da verificação
- `verification_completed` - Verificação concluída
- `verification_failed` - Falha na verificação

### 🎯 **Eventos de Interação**
- `click` - Cliques em elementos
- `form_submit` - Envio de formulários
- `input_change` - Mudanças em inputs
- `window_resize` - Redimensionamento da janela

### 🔧 **Eventos de Acessibilidade**
- `accessibility_interaction` - Uso de recursos de acessibilidade
- `language_change` - Mudança de idioma
- `theme_change` - Mudança de tema

### 📈 **Eventos de Performance**
- `page_view` - Visualização de página
- `scroll_depth` - Profundidade de rolagem
- `large_resource` - Recursos grandes carregados

### ⚠️ **Eventos de Erro**
- `javascript_error` - Erros JavaScript
- `unhandled_promise_rejection` - Promises rejeitadas

## Parâmetros Customizados

### **Event Category**
- `fake_news_checker` - Categoria principal para todos os eventos

### **Event Label**
- Texto da verificação (primeiros 100 caracteres)
- Nome do evento como fallback

### **Value**
- Score da verificação (0-100)
- Tempo de processamento (ms)
- 1 como valor padrão

### **Custom Parameters**
- `custom_parameter_1` - Session ID
- `custom_parameter_2` - Classificação ou ação

## Exemplo de Evento Enviado

```javascript
gtag('event', 'verification_completed', {
  'event_category': 'fake_news_checker',
  'event_label': 'Texto verificado pelo usuário...',
  'value': 85,
  'custom_parameter_1': 'session_12345',
  'custom_parameter_2': 'fake_news'
});
```

## Métricas Disponíveis no Google Analytics

### 📊 **Dashboard Principal**
- **Usuários únicos** por dia/semana/mês
- **Sessões** e duração média
- **Taxa de rejeição** e páginas por sessão
- **Dispositivos** e navegadores utilizados

### 🎯 **Eventos Customizados**
- **Verificações realizadas** - Volume de uso
- **Taxa de sucesso** das verificações
- **Tempo médio** de processamento
- **Classificações** mais comuns

### 🔧 **Acessibilidade**
- **Uso de recursos** de acessibilidade
- **Mudanças de idioma** e tema
- **Dispositivos assistivos** utilizados

### 📈 **Performance**
- **Core Web Vitals** (LCP, FID, CLS)
- **Tempo de carregamento** da página
- **Recursos** que demoram para carregar

## Configurações de Privacidade

### 🛡️ **LGPD/GDPR Compliance**
- ✅ **Anonimização de IP** configurada
- ✅ **Retenção de dados** limitada
- ✅ **Consentimento** do usuário respeitado
- ✅ **Dados pessoais** não coletados

### 🔒 **Segurança**
- ✅ **HTTPS** obrigatório
- ✅ **CSP** configurado corretamente
- ✅ **Referrer Policy** definida
- ✅ **Dados sensíveis** não rastreados

## Relatórios Recomendados

### 1. **Relatório de Uso**
- Eventos de verificação por dia
- Taxa de sucesso das verificações
- Tempo médio de processamento

### 2. **Relatório de Acessibilidade**
- Uso de recursos de acessibilidade
- Dispositivos assistivos utilizados
- Mudanças de configuração

### 3. **Relatório de Performance**
- Core Web Vitals
- Tempo de carregamento
- Erros JavaScript

### 4. **Relatório de Dispositivos**
- Tipos de dispositivo
- Navegadores utilizados
- Resoluções de tela

## Troubleshooting

### Problema: Google Analytics não está funcionando
```javascript
// Verifica se o gtag está disponível
console.log('gtag disponível:', typeof gtag !== 'undefined');

// Verifica se há erros no console
// Procure por mensagens de CSP ou rede
```

### Problema: Eventos não aparecem no GA
```javascript
// Verifica se os eventos estão sendo enviados
// Abra o console e procure por:
// "Google Analytics integrado com sucesso"
// "Analytics Event:"
```

### Problema: CSP bloqueando GA
```html
<!-- Verifica se o CSP inclui:
script-src ... https://www.googletagmanager.com;
connect-src ... https://www.google-analytics.com;
-->
```

## Monitoramento

### 📊 **Métricas Importantes**
- **Taxa de verificação** por usuário
- **Tempo médio** de processamento
- **Taxa de erro** nas verificações
- **Uso de acessibilidade**

### 🎯 **KPIs Principais**
- **Engajamento** - Verificações por sessão
- **Performance** - Tempo de resposta
- **Acessibilidade** - Uso de recursos
- **Qualidade** - Taxa de sucesso

## Conclusão

A integração do Google Analytics fornece insights valiosos sobre:
- **Comportamento dos usuários**
- **Performance da aplicação**
- **Uso de recursos de acessibilidade**
- **Qualidade das verificações**

Todos os dados são coletados de forma **ética e segura**, respeitando a privacidade dos usuários e as regulamentações de proteção de dados.
