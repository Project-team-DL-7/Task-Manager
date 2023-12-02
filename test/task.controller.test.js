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

describe('Task Controller', () => {
    // Test for GET request to retrieve a task by ID
    it('should return a task by ID', done => {
        const taskId = 1; // Replace with a valid ID
        chai.request(server)
            .get(`/task/${taskId}`)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('id_task', taskId);
                done();
            });
    });

    // Test for POST request to create a new task
    it('should create a new task', done => {
        const newTask = {
            id_project: 1, // Replace with valid project ID
            task_name: 'New Task',
            description: 'New task description',
            deadline: 1672444800 // Replace with a valid deadline
        };
        chai.request(server)
            .post('/task')
            .send(newTask)
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                done();
            });
    });

    // Test for DELETE request to remove a task
    it('should delete a task', done => {
        const taskId = 1; // Replace with a valid ID
        chai.request(server)
            .delete(`/task/${taskId}`)
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
