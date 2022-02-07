const { Router } = require('express')
const secretController = require('../controller/secretController')

const router = Router()

router.get('/secret/:hash', secretController.getFromHash)

router.post('/secret/', secretController.update)

module.exports = router
