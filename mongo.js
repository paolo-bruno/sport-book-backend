const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.connect(url)

const gameSchema = new mongoose.Schema({
  sport: String,
  date: Date,
  public: true
})

const Game = mongoose.model('Game', gameSchema)

const game = new Game({
  sport: 'Football',
  date: new Date(),
  public: false
})

// eslint-disable-next-line no-constant-condition
if ( false ) {
  game.save().then(() => {
    console.log('game saved!')
    mongoose.connection.close()
  })
}

Game.find({}).then(result => {
  result.forEach(game => {
    console.log(game)
  })
  mongoose.connection.close()
})