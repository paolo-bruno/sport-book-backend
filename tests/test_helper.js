const Game = require('../models/game')
const User = require('../models/user')

const initialGames = [
  {
    sport: 'Football',
    date: new Date(),
    public: false,
  },
  {
    sport: 'Tennis',
    date: new Date(),
    public: true,
  },
]

const nonExistingId = async () => {
  const game = new Game({ content: 'willremovethissoon', date: new Date() })
  await game.save()
  await game.remove()

  return game._id.toString()
}

const gamesInDb = async () => {
  const games = await Game.find({})
  return games.map(game => game.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialGames,
  nonExistingId,
  gamesInDb,
  usersInDb,
}