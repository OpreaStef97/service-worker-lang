export default class IndexedDB {
  constructor(dbName, storeName) {
    this.dbName = dbName
    this.storeName = storeName
  }

  open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)

      request.onupgradeneeded = event => {
        const db = event.target.result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' })
        }
      }

      request.onsuccess = event => {
        resolve(event.target.result)
      }

      request.onerror = event => {
        reject(event.target.error)
      }
    })
  }

  store(key, value) {
    return new Promise((resolve, reject) => {
      this.open()
        .then(db => {
          const transaction = db.transaction([this.storeName], 'readwrite')
          const store = transaction.objectStore(this.storeName)
          store.put({ id: key, value: value })

          transaction.oncomplete = () => resolve()
          transaction.onerror = event => reject(event.target.error)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this.open()
        .then(db => {
          const transaction = db.transaction([this.storeName], 'readonly')
          const store = transaction.objectStore(this.storeName)
          const request = store.get(key)

          request.onsuccess = event => {
            resolve(event.target.result ? event.target.result.value : null)
          }

          request.onerror = event => reject(event.target.error)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
