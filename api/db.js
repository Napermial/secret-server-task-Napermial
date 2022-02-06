const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}, (error) => {
  console.error('Couldn\'t connect to mongoDB', error)
})
const db = mongoose.connection
// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function callback () {
  // eslint-disable-next-line no-console
  console.log('MongoDB Connected...')
})

module.exports = db
