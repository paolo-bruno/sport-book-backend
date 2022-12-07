const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
  sport: {
    type: String,
    required: true,
    minlength: 2
  },
  date: Date,
  public: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

gameSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Game', gameSchema)
