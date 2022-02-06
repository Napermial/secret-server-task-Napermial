const Secret = require('../models/Secret')

module.exports.create = (req, res) => {
  const secret = new Secret({
    hash: req.body.hash,
    secretText: req.body.secretText,
    createdAt: req.body.createdAt,
    expiresAt: req.body.expiresAt,
    remainingViews: req.body.remainingViews
  })

  secret.save((err, _) => {
    if (err) {
      return res.status(500).json({
        message: 'Error saving record',
        error: err
      })
    }
    return res.json({
      message: 'saved',
      _id: secret._id
    })
  })
}

module.exports.update = (req, res) => {
  Secret.findOne({ hash: req.params.hash }, (err, secret) => {
    if (err) {
      return res.status(500).json({
        message: 'Error saving record',
        error: err
      })
    }
    if (!secret) {
      res.status(404).json({
        message: 'No such record'
      })
    }

    secret.expiresAt = req.body.expiresAt ? req.body.expiresAt : secret.expiresAt
    secret.remainingViews = req.body.remainingViews ? req.body.remainingViews : secret.remainingViews
    secret.save(
      (err, secret) => {
        if (err) {
          return res.status(500).json({
            message: 'Error getting record.'
          })
        }
        if (!secret) {
          return res.status(404).json({
            message: 'No such record'
          })
        }
        return res.json(secret)
      }
    )
  })
}

module.exports.delete = (req, res) => {
  Secret.findOneAndRemove(
    { hash: req.params.hash }, (err, secret) => {
      if (err) {
        return res.status(500).json({
          message: 'Error deleting record',
          error: err
        })
      }
      if (!secret) {
        res.status(404).json({
          message: 'No such record'
        })
      }
    }
  )
}
