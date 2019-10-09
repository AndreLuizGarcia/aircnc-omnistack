const express = require('express')
const routes = require('./routes')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const socketio = require('socket.io')
const http = require('http')

const app = express()
const server = http.Server(app) //estou extraindo o server de dentro do app, que foi criado pelo express
const io = socketio(server) //agora, o server tambem vai conseguir ouvir o protocolo websocket 

mongoose.connect('url do bd', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const connectedUsers = {} // BD ex: Reddis, ele é feito pra aplicações desse tipo, apenas salvar dados, zero relacionamento. numa aplicação em produção é importante mandar essa informação para um banco de dados pois toda vez que reiniciarmos o servidor ela será perdida, da maneira que esta implementado aqui.

io.on('connection', socket => {

  const { user_id } = socket.handshake.query

  connectedUsers[user_id] = socket.id
})

app.use((req, res, next) => {
  req.io = io
  req.connectedUsers

  return next()
})

app.use(cors())
app.use(express.json())
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')))
app.use(routes)

server.listen(3000)
