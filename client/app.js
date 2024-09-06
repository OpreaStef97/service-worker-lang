import IndexedDB from './utils/indexed-db'

export default class App {
  constructor() {
    this.languageButton = document.getElementById('language-button')
    this.flag = document.querySelector('.flag')
    this.fetchButton = document.getElementById('fetch-button')
    this.resultContainer = document.getElementById('result')
    this.initialize()
  }

  initialize = async () => {
    this.db = new IndexedDB('LanguageDB', 'Settings')
    await this.loadInitialLanguage()
    this.initializeServiceWorker()
  }

  loadInitialLanguage = async () => {
    try {
      const initialLanguage = await this.db.get('selected-language')
      if (initialLanguage === 'de') {
        this.languageButton.textContent = 'Change to EN'
        this.flag.textContent = '🇩🇪'
      }
    } catch (error) {
      console.error('Error loading initial language:', error)
    }
  }

  initializeServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) {
      return console.error('Service Worker is not supported in this browser.')
    }
    try {
      const { scope } = await navigator.serviceWorker.register('worker.js')
      console.log('Service Worker registered with scope:', scope)

      const registration = await navigator.serviceWorker.ready

      this.languageButton.addEventListener(
        'click',
        this.handleLanguageChange.bind(this, registration),
      )
      this.fetchButton.addEventListener('click', this.handleFetch)
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }

  handleLanguageChange = async registration => {
    try {
      const prevLanguage = (await this.db.get('selected-language')) || 'en'
      const newLanguage = prevLanguage === 'en' ? 'de' : 'en'

      this.languageButton.textContent = `Change to ${prevLanguage.toUpperCase()}`
      this.flag.textContent = newLanguage === 'en' ? '🇬🇧' : '🇩🇪'

      await this.db.store('selected-language', newLanguage)

      registration.active.postMessage({
        type: 'language-change',
        selectedLanguage: newLanguage,
      })
    } catch (error) {
      console.error('Error changing language:', error)
    }
  }

  handleFetch = async () => {
    try {
      const response = await fetch('/check-lang')
      const data = await response.json()

      const message = document.createElement('p')
      message.classList.add('message')
      message.classList.add(
        `${data.message?.toLowerCase()?.includes('en') ? 'en' : 'de'}`,
      )
      message.textContent = data.message
      this.resultContainer.prepend(message)
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }
}
