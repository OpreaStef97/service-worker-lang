# Service Worker Language Persistance POC

This app represents an workaround using custom headers to synchronise transient data with the server.

It shows how the client informs the server the current language via a Custom Header `selected-language`, attached to the request by a service-worker. 
The language is persisted in the browser with IndexedDB API.

### Install the packages

`npm i`

### Build the client and start the server app

`npm run build-and-start`
