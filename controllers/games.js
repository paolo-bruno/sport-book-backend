const gamesRouter = require('express').Router()
const Game = require('../models/game')

gamesRouter.get('/', async (request, response) => {
  Game.find({}).then(games => {
    response.json(games)
  })
})

gamesRouter.get('/:id', async (request, response) => {
  const game = await Game.findById(request.params.id)
  if (game) {
    response.json(game)
  } else {
    response.status(404).end()
  }

})

gamesRouter.post('/', async (request, response) => {
  const body = request.body

  const game = new Game({
    sport: body.sport,
    date: new Date(),
    public: body.public || false,
  })

  const savedGame = await game.save()
  response.status(201).json(savedGame)
})

gamesRouter.delete('/:id', async (request, response) => {
  await Game.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

gamesRouter.put('/:id', async (request, response) => {
  const body = request.body

  const game = {
    sport: body.sport,
    public: body.public,
  }

  const updatedGame = await Game.findByIdAndUpdate(request.params.id, game, { new: true })
  response.json(updatedGame)
})

module.exports = gamesRouter