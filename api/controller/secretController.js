const { Keccak } = require('sha3')
const Secret = require('../models/Secret')

function createSecret (req, res) {
  const secretBody = req.body
  if (secretBody === undefined || !('secret' in secretBody) || !('expireAfterViews' in secretBody) || !('expireAfter' in secretBody)) {
    return res.status(404).send('Incorrectly shaped secret')
  }

  const keccak = new Keccak(256)
  const now = new Date()
  let expiresAtTime = new Date()

  if (secretBody.expireAfter !== undefined) {
    expiresAtTime = new Date(now.getTime() + parseInt(secretBody.expireAfter) * 60000)
  }

  const secretNew = new Secret({
    hash: keccak.update(secretBody.secret, 'utf-8').digest('hex'),
    secretText: secretBody.secret,
    createdAt: now.toISOString(),
    expiresAt: expiresAtTime,
    remainingViews: secretBody.expireAfterViews
  })

  secretNew.save((err, _) => {
    if (err) {
      return res.status(500).json({
        message: 'Error creating new record',
        error: err
      })
    }
    return res.json({
      message: 'saved'
    })
  })
}

module.exports.update = (req, res) => {
  Secret.findOne({ hash: req.params.hash }, (err, secret) => {
    if (err) {
      return res.status(500).json({
        message: 'Server error when trying to update secret',
        error: err.toString()
      })
    }
    if (!secret) {
      return createSecret(req, res)
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

module.exports.getFromHash = (req, res) => {
  Secret.findOne(
    { hash: req.params.hash }, (err, secret) => {
      if (err) {
        return res.status(500).json({
          message: 'Error getting record',
          error: err
        })
      }
      if (!secret) {
        res.status(404).json({
          message: 'No such record'
        })
      }
      return secret
    }
  )
}
