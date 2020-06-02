const bodyParser = require('body-parser')
const express = require('express')

const PORT = process.env.PORT || 5000

const app = express()
app.use(bodyParser.json())

app.get('/', handleIndex)
app.post('/start', handleStart)
app.post('/move', require("./src/move"))
app.post('/end', handleEnd)

app.listen(PORT, "0.0.0.0", () => console.log(`Example app listening at http://127.0.0.1:${PORT}`))

const battlesnakeInfo = {
  name: 'Devastator',
  apiversion: '1',
  author: 'Пик Балмера',
  color: '#a9e7ff',
  head_type: 'bendr',
  tail_type: 'small-rattle'
};

function handleIndex(request, response) {
  response.status(200).json(battlesnakeInfo)
}

function handleStart(request, response) {
  console.log('START')
  response.status(200).json(battlesnakeInfo);
}

function handleEnd(request, response) {
  let gameData = request.body

  console.log('END')
  response.status(200).send('ok')
}
