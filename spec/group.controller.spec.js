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
const sampleGroupData = {
  groupName: 'testGroup',
  members: ['test@test.com']
};

let userId;
let groupId;
let newMemberEmail = 'addedNewMember@test.com';
let token = jwt.sign(sampleUserData, JWT_SECRET_KEY);

describe('TEST for group.constroller ', function () {
  this.timeout(100000);

  before(async () => {
    const newUserData = await userService.addUserData(sampleUserData);
    userId = newUserData._id;
  });

  after(async () => {
    await userService.deleteUserData(sampleUserData.email);
  });

  describe('POST /groups', function () {
    this.timeout(10000);

    it('should add new group data in DB', (done) => {
      request(app)
        .post('/groups')
        .set('cookie', `token=${token}`)
        .send({ userId: userId, name: sampleGroupData.groupName, members: sampleGroupData.members })
        .end((err, res) => {
          if (err) return done(err);

          groupId = res.body.groups._id;

          expect(res.status).to.equal(201);
          expect(res.body.groups.members.length).to.equal(1);
          expect(res.body.groups.members[0]).to.equal(sampleGroupData.members[0]);

          done();
        });
    });
  });

  describe('GET /groups/:id', function () {
    this.timeout(10000);

    it('should get member datas of specific group', (done) => {
      request(app)
        .get(`/groups/${groupId}`)
        .set('cookie', `token=${token}`)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).to.equal(200);
          expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');

          done();
        });
    });
  });

  describe('POST /groups/:groupId/members', function () {
    this.timeout(10000);

    it('should add members to group', (done) => {
      request(app)
        .post(`/groups/${groupId}/members`)
        .set('cookie', `token=${token}`)
        .send({ members: [newMemberEmail] })
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).to.equal(200);
          expect(res.body.groupId).to.equal(groupId);
          expect(res.body.members[0]).to.equal('addedNewMember@test.com');

          done();
        });
    });
  });

  describe('DELETE /:groupId/members/:memberId', function () {
    this.timeout(10000);

    it('should delete some members from specific group', (done) => {
      request(app)
        .delete(`/groups/${groupId}/members/member=${newMemberEmail}`)
        .set('cookie', `token=${token}`)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).to.equal(204);

          done();
        });
    });

    it('should no members in DB', (done) => {
      request(app)
        .get(`/groups/${groupId}`)
        .set('cookie', `token=${token}`)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.status).to.equal(200);
          expect(res.body.members).not.to.contain(newMemberEmail);

          done();
        });
    });
  });

  describe('DELETE /groups/:id', function () {
    this.timeout(10000);

    it('should delete group in DB', (done) => {
      request(app)
        .delete(`/groups/group=${groupId}`)
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
