const express = require('express')
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (error) => {
  if (error !== null) {
    // eslint-disable-next-line no-console
    console.error('Couldn\'t connect to mongoDB', error)
  }
})
const db = mongoose.connection
// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function callback () {
  // eslint-disable-next-line no-console
  console.log('MongoDB Connected...')
})

// Create express instance
const app = express()

// Require API routes
const users = require('./routes/secrets')

// Import API Routes
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(users)

// Export express app
module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on port ${port}`)
  })
}
