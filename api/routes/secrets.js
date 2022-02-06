const { Router } = require('express')
const secretController = require('../controller/secretController')

const router = Router()

router.get('/api/secret/:hash', secretController.getFromHash)

router.post('/api/secret/', secretController.update)

module.exports = router
