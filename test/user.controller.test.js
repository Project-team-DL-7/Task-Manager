const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);

// Import the app
const app = require('../index');

// Start the server for testing purposes
let server;
before(done => {
    server = app.listen(0, () => {
        done();
    });
});

describe('User Controller', () => {
    // Test for GET request to retrieve a user by ID
    it('should return a user by ID', done => {
        const userId = 1; // Replace with a valid ID
        chai.request(server)
            .get(`/user/${userId}`)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('id_user', userId);
                done();
            });
    });

    // Test for POST request to create a new user
    it('should create a new user', done => {
        const newUser = {
            email: 'newuser@email.com',
            username: 'newuser',
            password: 'password123',
            registrationDate: Date.now()
        };
        chai.request(server)
            .post('/user')
            .send(newUser)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    // Test for PUT request to update a user
    it('should update a user', done => {
        const userId = 1; // Replace with a valid ID
        const updatedData = {
            id_user: userId,
            email: 'updateduser@email.com',
            username: 'updateduser',
            password: 'newpassword123',
            registrationDate: Date.now()
        };
        chai.request(server)
            .put('/user')
            .send(updatedData)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                done();
            });
    });

    // Test for DELETE request to remove a user
    it('should delete a user', done => {
        const userId = 1; // Replace with a valid ID
        chai.request(server)
            .delete(`/user/${userId}`)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                done();
            });
    });
});

// Error scenario tests for User Controller
describe('User Controller Error Scenarios', () => {
    it('should return 404 for a non-existent user', done => {
        const userId = 999; // Non-existent user ID
        chai.request(server)
            .get(`/user/${userId}`)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('should return 400 for invalid user data on POST', done => {
        const invalidUserData = {}; // Invalid or incomplete data
        chai.request(server)
            .post('/user')
            .send(invalidUserData)
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    // PUT request with invalid data
    it('should return 400 for invalid user data on PUT', done => {
        const userId = 1; // Existing user ID for testing
        const invalidUserData = {}; // Invalid or incomplete data
        chai.request(server)
            .put(`/user/${userId}`)
            .send(invalidUserData)
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    // DELETE request for a non-existent user
    it('should return 404 for a non-existent user on DELETE', done => {
        const userId = 999; // Non-existent user ID
        chai.request(server)
            .delete(`/user/${userId}`)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });
});

// Close the server after tests run
after(done => {
    server.close(() => {
        done();
    });
});
