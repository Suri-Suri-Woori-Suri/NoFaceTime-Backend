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
let newUserId;

describe('TEST for user.controller', function () {
  this.timeout(10000);

  beforeEach(async () => {
    const newUserData = await userService.addUserData(sampleUserData);
    newUserId = newUserData._id;
  });

  afterEach(async () => {
    await userService.deleteUserData(sampleUserData.email);
  });

  describe('GET /users/:userId', function () {
    this.timeout(5000);

    it('should get user data from DB', (done) => {
      request(app)
        .get(`/users/${newUserId}`)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).to.equal(200);
          expect(res.body.email).to.equal(sampleUserData.email);
          expect(res.body.nickname).to.equal(sampleUserData.nickname);

          done();
        });
    });
  });
});
