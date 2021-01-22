const express = require('express')
const app = express()
const env = process.env.NODE_ENV || 'development'

app.use('/', express.static(__dirname + '/dist/'))
// app.use('/cdn', express.static("../CDN/JumentiX/a243/cdn"));

app.listen(5490, function () {
  console.log('Jumentix-Vue-UI listening on port 5490!')
})
