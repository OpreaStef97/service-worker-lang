export default class Observable {
  constructor(value) {
    this.value = value
    this.listeners = []
  }

  get() {
    return this.value
  }

  set(value) {
    this.value = value
    this.listeners.forEach(listener => listener(value))
  }

  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }
}
