# 🔍 Verificador de Fake News

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5.3.0-purple.svg)](https://getbootstrap.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-blue.svg)](https://web.dev/progressive-web-apps/)

Uma aplicação web moderna que utiliza Inteligência Artificial, a API do Google Gemini **e resultados de busca em tempo real do Google** para detectar e analisar possíveis fake news e fatos atuais.

## 🎯 Principais Destaques

- ⚡ Análise em tempo real com IA avançada
- 🌐 Verificação de fatos pós-2022 com busca automática no Google
- 📱 Progressive Web App (PWA) instalável
- 🎨 Interface moderna e responsiva
- 🌓 Suporte a tema claro/escuro
- ♿ Recursos avançados de acessibilidade
- ☁️ Integração serverless com Vercel

## 🚀 Começando

### Pré-requisitos

- Node.js (opcional para desenvolvimento)
- Um servidor web local (como Live Server do VS Code)
- Chave de API do Google Gemini

### Instalação Local

1. Clone o repositório:

```bash
git clone https://github.com/LuisT-ls/FakeLumos.git
cd FakeLumos
```

2. Configure sua chave API:

   - Crie um arquivo `.env` na raiz com:
     ```
     GEMINI_API_KEY=sua_chave_aqui
     ```

3. Execute o projeto:
   - Abra `index.html` diretamente no navegador
   - Ou use um servidor local como Live Server

## 🛠️ Tecnologias Utilizadas

### Frontend

- HTML5 & CSS3 (CSS Modular)
- JavaScript Vanilla (ES Modules)
- Bootstrap 5
- Service Workers (PWA)

### Backend & Integrações

- Google Gemini API
- Vercel Serverless Functions
- Local Storage para persistência local

## 📂 Estrutura do Projeto Atualizada

```
.
├── api/                   # Funções serverless (Vercel)
│   └── getApiKey.js       # Endpoint para API Key
├── assets/                # Recursos estáticos
│   ├── css/               # Estilos CSS modularizados
│   │   ├── base/          # Reset, variáveis, tipografia
│   │   ├── components/    # Componentes UI
│   │   ├── layout/        # Layout principal
│   │   └── utils/         # Utilitários CSS
│   └── img/               # Imagens e ícones
│       ├── favicon/       # Favicons e ícones PWA
│       └── *.svg          # Imagens SVG
├── docs/                  # Documentação
│   ├── LICENSE            # Licença MIT
│   └── README.md          # Este arquivo
├── js/                    # Lógica da aplicação
│   ├── modules/           # Módulos JavaScript
│   │   ├── accessibility.js # Controles de acessibilidade
│   │   ├── api.js         # Integração com APIs
│   │   ├── dom.js         # Manipulação do DOM
│   │   ├── events.js      # Gerenciamento de eventos
│   │   ├── gemini.js      # Integração com Gemini AI
│   │   └── ui.js          # Componentes de interface
│   └── app.js             # Ponto de entrada principal
├── pages/                 # Páginas adicionais
│   ├── css/               # Estilos específicos de páginas
│   ├── sobre.html         # Página "Sobre"
│   ├── privacy.html       # Política de privacidade
│   └── terms-of-service.html # Termos de serviço
├── .gitignore             # Arquivos ignorados pelo Git
├── 404.html               # Página de erro 404
├── favicon.ico            # Favicon padrão
├── index.html             # Página principal
├── manifest.json          # Configuração PWA
├── package.json           # Configuração do projeto
├── robots.txt             # Instruções para crawlers
├── sitemap.xml            # Mapa do site
└── sw.js                  # Service Worker (PWA)
```

## 💡 Funcionalidades Principais

### Análise de Conteúdo

- Verificação de credibilidade em tempo real
- **Complementação e checagem de fatos com resultados de busca do Google**
- Pontuação de confiabilidade
- Identificação de elementos suspeitos
- Histórico de verificações locais

### Experiência do Usuário

- Interface totalmente responsiva
- Modo claro/escuro
- Controles de acessibilidade:
  - Ajuste de contraste
  - Tamanho da fonte
  - Fonte para dislexia
  - Redução de movimento

### PWA (Progressive Web App)

- Funcionamento offline
- Instalação em dispositivos
- Atualizações automáticas
- Tela de carregamento personalizada

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

### Diretrizes de Código

- Sempre documente novas funções
- Mantenha a estrutura modular
- Teste em múltiplos navegadores
- Respeite as convenções existentes

## 📄 Licença

Este projeto está licenciado sob a [MIT License](docs/LICENSE).

## 👤 Autor

**Luís Antonio Souza Teixeira**

- LinkedIn: [@luis-tei](https://www.linkedin.com/in/luis-tei/)
- GitHub: [@LuisT-ls](https://github.com/LuisT-ls)
- Email: luishg213@outlook.com

---

> **Nota importante**: Esta ferramenta é um auxílio à verificação de informações e não substitui a análise crítica e consulta a fontes confiáveis. Agora, além da análise por IA, utiliza também resultados de busca do Google para checagem de fatos atuais e pós-2022.
