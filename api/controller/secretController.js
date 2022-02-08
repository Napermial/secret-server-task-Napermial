const { Keccak } = require('sha3')
const Secret = require('../models/Secret')

function createSecret (req, res) {
  const secretBody = req.body
  if (secretBody === undefined || !('secret' in secretBody) || !('expireAfterViews' in secretBody) || !('expireAfter' in secretBody)) {
    return res.status(400).send('Incorrectly shaped secret')
  }

  const keccak = new Keccak(256)
  const now = new Date()
  const hashed = keccak.update(secretBody.secret, 'utf-8').digest('hex')
  let secretNew = new Secret({
    hash: hashed,
    secretText: secretBody.secret,
    createdAt: now.toISOString(),
    remainingViews: secretBody.expireAfterViews
  })

  if (secretBody.expireAfter !== undefined || secretBody.expireAfter !== 0) {
    const expiresAtTime = new Date(now.getTime() + parseInt(secretBody.expireAfter) * 60000)
    secretNew = new Secret({
      hash: hashed,
      secretText: secretBody.secret,
      expiresAt: expiresAtTime,
      createdAt: now.toISOString(),
      remainingViews: secretBody.expireAfterViews
    })
  }

  secretNew.save((err, _) => {
    if (err) {
      return res.status(500).json({
        message: 'Error creating new record',
        error: err
      })
    }
    return res.json({
      hash: hashed,
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

module.exports.getFromHash = (req, res) => {
  function deletedSecretResponse () {
    return res.status(404).send()
  }

  Secret.findOne(
    { hash: req.params.hash }, (err, secret) => {
      if (err) {
        res.status(500).json({
          message: 'Error getting record',
          error: err
        })
        return
      }

      if (!secret) {
        return deletedSecretResponse()
      }

      if (secret.remainingViews === 1 || secret.expiresAt < Date.now()) {
        Secret.findOneAndDelete({ hash: req.params.hash }, (err, secret) => {
          if (err) {
            res.status(500).json({
              message: 'Error deleting record',
              error: err
            })
            return
          }
          if (Date.parse(secret.expiresAt) < Date.now()) {
            deletedSecretResponse()
            return
          }

          res.json(secret)
        })
        return
      }

      if (secret.remainingViews > 1) {
        secret.remainingViews -= 1
        secret.save()
      }

      res.json(secret)
    }
  )
}
