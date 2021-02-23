const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const server = app.listen(3000, () => console.log('Example app listening at http://localhost:${port}'))

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated')
  })
})