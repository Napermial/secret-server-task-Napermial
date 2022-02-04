const { Router } = require('express')
const { Keccak } = require('sha3')

const router = Router()

// mock secrets
const secrets = [
  {
    hash: '[The hash of the string]',
    secretText: '[The original text]',
    createdAt: '[The Timestamp when the secret was created]',
    expiresAt: '[The Timestamp of the secret if TTL is given]',
    remainingViews: 0
  }
]

router.get('/api/secret/:hash', function (req, res, next) {
  res.json(secrets)
})

router.post('/api/secret/', function (req, res) {
  const secretBody = req.body
  if (!('secret' in secretBody) || !('expireAfterViews' in secretBody) || !('expireAfter' in secretBody)) {
    return res.error()
  }
  const keccak = new Keccak(256)
  const now = new Date()
  let expiresAtTime = new Date()

  if (secretBody.expireAfter !== undefined) {
    expiresAtTime = new Date(now.getTime() + parseInt(secretBody.expireAfter) * 60000)
  }

  const addSecret = {
    hash: keccak.update(secretBody.secret, 'utf-8'),
    secretText: secretBody.secret,
    createdAt: now.toISOString(),
    expiresAt: expiresAtTime,
    remainingViews: secretBody.expireAfterViews
  }

  secrets.push(addSecret)
})

module.exports = router
