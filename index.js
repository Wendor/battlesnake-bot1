const bodyParser = require('body-parser')
const express = require('express')

const PORT = process.env.PORT || 5000

const pathfind = require("./src/pathfind");

const app = express()
app.use(bodyParser.json())

app.get('/', handleIndex)
app.post('/start', handleStart)
app.post('/move', handleMove)
app.post('/end', handleEnd)

app.listen(PORT, () => console.log(`Example app listening at http://127.0.0.1:${PORT}`))

function handleIndex(request, response) {
  const battlesnakeInfo = {
    apiversion: '1',
    author: 'Пик Балмера',
    color: '#888888',
    head: 'default',
    tail: 'default'
  }
  response.status(200).json(battlesnakeInfo)
}

function handleStart(request, response) {
  const gameData = request.body

  console.log('START')
  response.status(200).send('ok')
}

function handleMove(request, response) {
  const gameData = request.body

  //console.log(gameData);

  let possibleMoves = pathfind.safeMoves(gameData);
  let moves = pathfind.foodDirection(gameData, possibleMoves);

  let move = moves[Math.floor(Math.random() * moves.length)].direction;

  console.log('MOVE: ' + move)
  response.status(200).send({
    move: move
  })
}

function handleEnd(request, response) {
  let gameData = request.body

  console.log('END')
  response.status(200).send('ok')
}
