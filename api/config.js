const jwt = require('jsonwebtoken')

const config = {
  authSecret: process.env.AUTH_SECRET
}

module.exports = config

// check if user logged in
module.exports.isAuthenticated = function (req, res, next) {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ message: 'unauthorized' })
  }
  jwt.verify(token.replace(/^Bearer\s/, ''), config.authSecret, (err) => {
    if (err) {
      return res.status(401).json({ message: 'unauthorized' })
    } else {
      return next()
    }
  })
}
