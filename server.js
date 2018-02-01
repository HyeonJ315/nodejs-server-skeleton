const http    = require('http')
const express = require('express')
const bParser = require('body-parser')
const path    = require('path')
const Promise = require('bluebird')

const app    = express()
const server = http.createServer(app)

app.use(bParser.json())
app.use(bParser.urlencoded({ extended: false }))

app.get('*', (req, res, next) => 
{
  console.log('got resquest')
  res.send('hello')
})

server.listen(3000, () => 
{
  console.log('server is running')
})
