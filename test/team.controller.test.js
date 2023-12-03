const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);

// Import the app
const { app } = require('../index');

// Start the server for testing purposes
let server;
before(done => {
    server = app.listen(0, () => {
        done();
    });
});

describe('Team Controller', () => {
    // Test for GET request to retrieve a team by ID
    it('should return a team by ID', done => {
        const teamId = 1; // Replace with a valid ID
        chai.request(server)
            .get(`/team/${teamId}`)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('id_team', teamId);
                done();
            });
    });

    // Test for POST request to create a new team
    it('should create a new team', done => {
        const newTeam = {
            team_name: 'New Team',
            description: 'New team description'
        };
        chai.request(server)
            .post('/team')
            .send(newTeam)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    // Test for PUT request to update a team
    it('should update a team', done => {
        const teamId = 1; // Replace with a valid ID
        const updatedData = {
            id_team: teamId,
            team_name: 'Updated Team',
            description: 'Updated team description'
        };
        chai.request(server)
            .put('/team')
            .send(updatedData)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                done();
            });
    });

    // Test for DELETE request to remove a team
    it('should delete a team', done => {
        const teamId = 1; // Replace with a valid ID
        chai.request(server)
            .delete(`/team/${teamId}`)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                done();
            });
    });
});

// Error scenario tests for Task Controller
describe('Task Controller Error Scenarios', () => {
    it('should return 404 for a non-existent task', done => {
        const taskId = 999; // Non-existent task ID
        chai.request(server)
            .get(`/task/${taskId}`)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('should return 400 for invalid task data on POST', done => {
        const invalidTaskData = {}; // Invalid or incomplete data
        chai.request(server)
            .post('/task')
            .send(invalidTaskData)
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    // PUT request with invalid data
    it('should return 400 for invalid task data on PUT', done => {
        const taskId = 1; // Existing task ID for testing
        const invalidTaskData = {}; // Invalid or incomplete data
        chai.request(server)
            .put(`/task/${taskId}`)
            .send(invalidTaskData)
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    // DELETE request for a non-existent task
    it('should return 404 for a non-existent task on DELETE', done => {
        const taskId = 999; // Non-existent task ID
        chai.request(server)
            .delete(`/task/${taskId}`)
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
