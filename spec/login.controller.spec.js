const request = require('supertest');
const { expect } = require('chai');

const app = require('../app');
const User = require('../models/User');
const UserService = require('../services/User');

const userService = new UserService(User);
const sampleUserData = {
  email: 'test@test.com',
  nickname: 'tester',
  groups: [],
  rooms: []
};

describe('TEST for login.controller', function () {
  this.timeout(10000);

  before(async () => {
    await userService.addUserData(sampleUserData);
  });

  after(async () => {
    await userService.deleteUserData(sampleUserData.email);
  });

  describe('POST /login', function () {
    this.timeout(5000);

    it('should add new user data in DB', (done) => {
      request(app)
        .post('/login')
        .send(sampleUserData)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).to.equal(201);
          expect(res.body.loginUserData.email).to.equal(sampleUserData.email);
          expect(res.body.loginUserData.nickname).to.equal(sampleUserData.nickname);
          expect(res.body.loginUserData.groups.length).to.equal(0);
          expect(res.body.loginUserData.rooms.length).to.equal(0);

          done();
        });
    });

    it('should issue token', (done) => {
      request(app)
        .post('/login')
        .send(sampleUserData)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).to.equal(201);
          expect(res.headers['set-cookie']).to.match(/token/);

          done();
        });
    });
  });
});
