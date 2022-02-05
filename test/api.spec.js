const request = require('supertest')
const express = require('express')
const router = require('../api/index')

const app = express()
app.use(router)

describe('Testing the API', function () {
  it('responds to the secret endpoint', async () => {
    const res = await request(app).get('/api/secret/c7fd1d987ada439fc085cfa3c49416cf2b504ac50151e3c2335d60595cb90745')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({
      hash: 'c7fd1d987ada439fc085cfa3c49416cf2b504ac50151e3c2335d60595cb90745',
      secretText: 'test string',
      createdAt: '2022-02-04T13:40:45.143Z',
      expiresAt: '2022-05-04T13:40:45.143Z',
      remainingViews: 0
    })
  })
})
