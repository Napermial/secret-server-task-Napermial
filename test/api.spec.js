const mockingoose = require('mockingoose')
const request = require('supertest')
const express = require('express')
const router = require('../api/index')
const Secret = require('./../api/models/Secret')
const app = express()
app.use(router)

describe('Testing the API', function () {
  it('should return the doc with findOne', () => {
    const _doc = {
      _id: '6200dd95ce6820d923deb228',
      hash: 'b32241fbb98f1faccff8743bcebdb7a3d07379572790b59c3e121683589eb757',
      secretText: 'test string',
      createdAt: '2022-02-04T13:40:45.143Z',
      expiresAt: '2022-05-04T13:40:45.143Z',
      remainingViews: 0
    }

    mockingoose(Secret).toReturn(_doc, 'findOne')

    return Secret.findOne({ hash: 'b32241fbb98f1faccff8743bcebdb7a3d07379572790b59c3e121683589eb757' }).then((doc) => {
      expect(JSON.parse(JSON.stringify(doc))).toMatchObject(_doc)
    })
  })

  it('should return only accessible in time secret', async function () {
    const _secret = {
      _id: '6200dd95ce6820d923deb228',
      hash: 'b32241fbb98f1faccff8743bcebdb7a3d07379572790b59c3e121683589eb757',
      secretText: 'test string',
      createdAt: '2022-02-04T13:40:45.143Z',
      expiresAt: '2022-05-04T13:40:45.143Z',
      remainingViews: 1
    }

    mockingoose(Secret).toReturn(_secret, 'findOne')
    mockingoose(Secret).toReturn(_secret, 'findOneAndDelete')

    const response = await request(app).get('/secret/b32241fbb98f1faccff8743bcebdb7a3d07379572790b59c3e121683589eb757')
    expect(JSON.parse(response.text)).toEqual(_secret)
  })

  it('should process a new secret', async () => {
    const res = await request(app).post('/secret').send({
      secret: 'testing',
      expireAfterViews: 0,
      expireAfter: 0
    })
    expect(res.statusCode).toEqual(200)
  })

  it('responds with 404 if no document is present', async () => {
    const res = await request(app).get('/api/secret/c7fd1d987ada439fc085cfa3c49416cf2b504ac50151e3c2335d60595cb90745')
    expect(res.statusCode).toBe(404)
  })

  it('should delete the secret if only one view is specified', async function () {
    const _secret = {
      _id: '6200dd95ce6820d923deb228',
      hash: 'b32241fbb98f1faccff8743bcebdb7a3d07379572790b59c3e121683589eb757',
      secretText: 'test string',
      createdAt: '2022-02-04T13:40:45.143Z',
      expiresAt: '2022-05-04T13:40:45.143Z',
      remainingViews: 1
    }

    mockingoose(Secret).toReturn(_secret, 'findOne')
    mockingoose(Secret).toReturn(_secret, 'findOneAndDelete')
    const deleteMock = jest.spyOn(Secret, 'findOneAndDelete')
    await request(app).get('/secret/b32241fbb98f1faccff8743bcebdb7a3d07379572790b59c3e121683589eb757')
    expect(deleteMock).toBeCalled()
  })
})
