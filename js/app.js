// js/app.js - Arquivo principal da aplicação
import { UIController } from './modules/ui/UIController.js'
import { VerificationController } from './modules/verification/VerificationController.js'
import { HistoryController } from './modules/history/HistoryController.js'
import { ThemeController } from './modules/theme/ThemeController.js'
import { ShareController } from './modules/share/ShareController.js'
import { AccessibilityController } from './modules/accessibility/AccessibilityController.js'
import { NotificationController } from './modules/notifications/NotificationController.js'
import { ExpandableController } from './modules/ui/ExpandableController.js'
import { ServiceWorkerController } from './modules/sw/ServiceWorkerController.js'

class App {
  constructor() {
    this.controllers = {}
    this.isInitialized = false
  }

  async init() {
    if (this.isInitialized) return

    try {
      console.log('🚀 Iniciando aplicação...')

      // Inicializar controladores de UI primeiro
      this.controllers.ui = new UIController()
      this.controllers.notification = new NotificationController()
      this.controllers.theme = new ThemeController()
      this.controllers.expandable = new ExpandableController()

      // Inicializar controladores de funcionalidades
      this.controllers.verification = new VerificationController()
      this.controllers.history = new HistoryController()
      this.controllers.share = new ShareController()
      this.controllers.accessibility = new AccessibilityController()
      this.controllers.serviceWorker = new ServiceWorkerController()

      // Inicializar todos os controladores
      await this.initializeControllers()

      // Configurar event listeners globais
      this.setupGlobalListeners()

      // Carregar histórico inicial
      this.controllers.history.loadHistory()

      this.isInitialized = true
      console.log('✅ Aplicação inicializada com sucesso!')

      // Mostrar notificação de boas-vindas
      this.controllers.notification.show(
        'Bem-vindo ao Verificador de Fake News!',
        'success',
        3000
      )
    } catch (error) {
      console.error('❌ Erro ao inicializar aplicação:', error)
      this.controllers.notification?.show(
        'Erro ao carregar a aplicação. Recarregue a página.',
        'error'
      )
    }
  }

  async initializeControllers() {
    const initPromises = Object.entries(this.controllers).map(
      async ([name, controller]) => {
        try {
          if (controller.init) {
            await controller.init()
            console.log(`✅ ${name} inicializado`)
          }
        } catch (error) {
          console.error(`❌ Erro ao inicializar ${name}:`, error)
        }
      }
    )

    await Promise.all(initPromises)
  }

  setupGlobalListeners() {
    // Listener para verificação
    document.getElementById('verifyButton')?.addEventListener('click', () => {
      this.handleVerification()
    })

    // Listener para Enter no textarea
    document.getElementById('userInput')?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.ctrlKey) {
        this.handleVerification()
      }
    })

    // Listener para limpar histórico
    document
      .getElementById('clearHistoryBtn')
      ?.addEventListener('click', () => {
        this.controllers.history.showClearConfirmation()
      })

    // Listener para confirmação de limpeza
    document
      .getElementById('confirmClearHistory')
      ?.addEventListener('click', () => {
        this.controllers.history.clearHistory()
      })

    // Listeners para compartilhamento
    document.querySelectorAll('[data-share]').forEach(button => {
      button.addEventListener('click', e => {
        const platform = e.target.closest('[data-share]').dataset.share
        this.controllers.share.share(platform)
      })
    })

    // Listener para erros globais
    window.addEventListener('error', e => {
      console.error('Erro global:', e.error)
      this.controllers.notification?.show(
        'Ocorreu um erro inesperado. Tente novamente.',
        'error'
      )
    })

    // Listener para mudanças de conectividade
    window.addEventListener('online', () => {
      this.controllers.notification?.show(
        'Conexão restaurada!',
        'success',
        2000
      )
    })

    window.addEventListener('offline', () => {
      this.controllers.notification?.show(
        'Sem conexão com a internet',
        'warning',
        3000
      )
    })
  }

  async handleVerification() {
    const input = document.getElementById('userInput')
    const text = input?.value?.trim()

    if (!text) {
      this.controllers.notification.show(
        'Por favor, digite um texto para verificar.',
        'warning'
      )
      input?.focus()
      return
    }

    if (text.length < 10) {
      this.controllers.notification.show(
        'O texto deve ter pelo menos 10 caracteres.',
        'warning'
      )
      return
    }

    try {
      // Verificar o texto
      const result = await this.controllers.verification.verify(text)

      if (result) {
        // Salvar no histórico
        this.controllers.history.addVerification(text, result)

        // Mostrar resultado
        this.controllers.ui.showResult(result)

        // Limpar campo de entrada
        input.value = ''

        // Scroll para o resultado
        document.getElementById('result-section')?.scrollIntoView({
          behavior: 'smooth'
        })
      }
    } catch (error) {
      console.error('Erro na verificação:', error)
      this.controllers.notification.show(
        'Erro ao verificar o texto. Tente novamente.',
        'error'
      )
    }
  }

  // Método para expor controladores globalmente (útil para debug)
  getController(name) {
    return this.controllers[name]
  }

  // Método para cleanup (útil para testes)
  destroy() {
    Object.values(this.controllers).forEach(controller => {
      if (controller.destroy) {
        controller.destroy()
      }
    })
    this.isInitialized = false
  }
}

// Inicializar aplicação quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', async () => {
  try {
    window.app = new App()
    await window.app.init()
  } catch (error) {
    console.error('Erro fatal ao inicializar aplicação:', error)
  }
})

// Exportar para uso em outros módulos se necessário
export default App
