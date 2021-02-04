const express = require('express')
const app = express()

app.use('/', express.static(__dirname + '/dist/'))

app.listen(5490, function () {
  console.log('listening on port 5490!')
})
