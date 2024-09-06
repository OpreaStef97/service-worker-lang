import express from 'express'
import path from 'path'

const app = express()

app.use('/', (req, res, next) => {
  if (req.url === '/') console.info('Request URL:', req.url, req.headers)

  // serve static files
  return next()
})
// serve public with static files
app.use(express.static(path.join(process.cwd(), 'dist')))

app.get('/check-lang', (req, res) => {
  res.json({
    message: `New Lang On Server: ${req.headers[
      'selected-language'
    ]?.toUpperCase()}`,
  })
})

const port = 3000

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`)
})
