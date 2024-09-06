import Observable from './utils/observable'
import IndexedDB from './utils/indexed-db'
import { PATHS_TO_LISTEN } from './utils/constants'

new (class ServiceWorker {
  constructor() {
    this.db = new IndexedDB('LanguageDB', 'Settings')
    this.lang = new Observable('en')
    this.isFirstTime = true

    self.addEventListener('install', this.install)
    self.addEventListener('activate', this.activate)
    self.addEventListener('fetch', this.handleFetch)
    self.addEventListener('message', this.handleMessage)

    this.lang.subscribe(value => {
      console.log('Language changed to', value)
    })
  }

  install = async () => {
    console.info('Service Worker installing.')
    try {
      this.lang.set((await this.db.get('selected-language')) || 'en')
    } catch (error) {
      console.error('Error loading language from IndexedDB:', error)
    }
  }

  activate = event => {
    event.waitUntil(clients.claim())
  }

  handleFetch = event => {
    if (!PATHS_TO_LISTEN.includes(new URL(event.request.url).pathname)) {
      return
    }

    event.respondWith(this.customHeaderRequestFetch(event))
  }

  handleMessage = async event => {
    const { selectedLanguage } = event.data
    this.lang.set(selectedLanguage)

    try {
      await this.db.store('selected-language', selectedLanguage)
    } catch (error) {
      console.error('Error storing language in IndexedDB:', error)
    }
  }

  customHeaderRequestFetch = event => {
    const selectedLanguage = this.lang.get()

    // Copy existing headers
    const headers = new Headers(event.request.headers)

    // Set a new header
    headers.set('selected-language', selectedLanguage)

    const newRequest = new Request(event.request, { headers })
    return fetch(newRequest)
  }
})()
