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

describe('Project Controller', () => {
    // Test for GET request to retrieve a single project by ID
    it('should return a project by ID', done => {
        const projectId = 1;
        chai.request(server)
            .get(`/project/${projectId}`)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('id_project', projectId);
                done();
            });
    });

    // Test for POST request to create a new project
    it('should create a new project', done => {
        const newProject = {
            description: 'Sample Project Description' // Add a valid description
        };
        chai.request(server)
            .post('/project')
            .send(newProject)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                done();
            });
    });    

    // Test for DELETE request to remove a project
    it('should delete a project', done => {
        const projectId = 1;
        chai.request(server)
            .delete(`/project/${projectId}`)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                done();
            });
    });
});

// Error scenario tests for Project Controller
describe('Project Controller Error Scenarios', () => {
    it('should return 404 for a non-existent project', done => {
        const projectId = 999;
        chai.request(server)
            .get(`/project/${projectId}`)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('should return 400 for invalid project data on POST', done => {
        const invalidProjectData = {}; // Invalid or incomplete data
        chai.request(server)
            .post('/project')
            .send(invalidProjectData)
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    // PUT request with invalid data
    it('should return 400 for invalid project data on PUT', done => {
        const projectId = 1; // Existing project ID for testing
        const invalidProjectData = {}; // Invalid or incomplete data
        chai.request(server)
            .put(`/project/${projectId}`)
            .send(invalidProjectData)
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    // DELETE request for a non-existent project
    it('should return 404 for a non-existent project on DELETE', done => {
        const projectId = 999; // Non-existent project ID
        chai.request(server)
            .delete(`/project/${projectId}`)
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
