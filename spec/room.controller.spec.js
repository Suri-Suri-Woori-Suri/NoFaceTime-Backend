const request = require('supertest');
const { expect } = require('chai');
const jwt = require('jsonwebtoken');

const app = require('../app');
const User = require('../models/User');
const UserService = require('../services/User');
const { JWT_SECRET_KEY } = require('../config');

const userService = new UserService(User);

const sampleUserData = {
  email: 'test@test.com',
  nickname: 'tester',
  groups: [],
  rooms: []
};

let userId;
let roomId;
let token = jwt.sign(sampleUserData, JWT_SECRET_KEY);

describe('TEST for room.constroller ', function () {
  this.timeout(10000);

  before(async () => {
    const newUserData = await userService.addUserData(sampleUserData);
    userId = newUserData._id;
  });

  after(async () => {
    await userService.deleteUserData(sampleUserData.email);
  });

  describe('POST /rooms', function () {
    this.timeout(5000);

    it('should add new room in DB', (done) => {
      request(app)
        .post('/rooms')
        .set('cookie', `token=${token}`)
        .send({ currentUser: { _id: userId }, roomName: 'TEST ROOM NAME' })
        .end((err, res) => {
          if (err) return done(err);

          roomId = res.body.rooms._id;

          expect(res.status).to.equal(201);
          expect(res.body.rooms.name).to.equal('TEST ROOM NAME');

          done();
        });
    });
  });

  describe('DELETE /rooms/:roomId', function () {
    this.timeout(5000);

    it('should delete room data from DB', (done) => {
      request(app)
        .delete(`/rooms/${roomId}`)
        .set('cookie', `token=${token}`)
        .send({ userId: userId })
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).to.equal(204);

          done();
        });
    });
  });
});
