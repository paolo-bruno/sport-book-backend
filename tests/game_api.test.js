const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const Game = require('../models/game')

beforeEach(async () => {
  await Game.deleteMany({})

  for (let game of helper.initialGames) {
    let gameObject = new Game(game)
    await gameObject.save()
  }
})

test('games are returned as json', async () => {
  await api
    .get('/api/games')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all games are returned', async () => {
  const response = await api.get('/api/games')

  expect(response.body).toHaveLength(helper.initialGames.length)
})

test('a specific game is whitin the returned games', async () => {
  const response = await api.get('/api/games')

  const sports = response.body.map(r => r.sport)
  expect(sports).toContain('Football')
})

test('a valid game can be added', async () => {
  const newGame = {
    sport: 'Basket',
    public: true,
  }

  await api
    .post('/api/games')
    .send(newGame)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/games')

  const sports = response.body.map(r => r.sport)

  expect(response.body).toHaveLength(helper.initialGames.length + 1)
  expect(sports).toContain(
    'Basket'
  )
})

test('game without content is not added', async () => {
  const newGame = {
    public: true
  }

  await api
    .post('/api/games')
    .send(newGame)
    .expect(400)

  const response = await api.get('/api/games')

  expect(response.body).toHaveLength(helper.initialGames.length)
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 54370640753)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  }, 10000)

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

afterAll(() => {
  mongoose.connection.close()
})