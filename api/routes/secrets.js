const { Router } = require('express')
const { Keccak } = require('sha3')

const router = Router()

// mock secrets
const secrets = [
  {
    hash: 'c7fd1d987ada439fc085cfa3c49416cf2b504ac50151e3c2335d60595cb90745',
    secretText: 'test string',
    createdAt: '2022-02-04T13:40:45.143Z',
    expiresAt: '2022-05-04T13:40:45.143Z',
    remainingViews: 0
  }
]

router.get('/api/secret/:hash', function (req, res) {
  for (const secret of secrets) {
    if (req.params.hash === secret.hash) {
      res.json(secret)
      break
    }
  }
  res.status(404)
})

router.post('/api/secret/', function (req, res) {
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

  const addSecret = {
    hash: keccak.update(secretBody.secret, 'utf-8').digest('hex'),
    secretText: secretBody.secret,
    createdAt: now.toISOString(),
    expiresAt: expiresAtTime,
    remainingViews: secretBody.expireAfterViews
  }

  secrets.push(addSecret)
  res.send(addSecret)
})

module.exports = router
