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

describe('Project Controller', () => {
    // Test for GET request to retrieve a single project by ID
    it('should create, get, and delete a project', (done) => {
        const newProject = { description: 'Sample Project Description' };
        chai.request(server)
            .post('/project')
            .send(newProject)
            .end((postErr, postRes) => {
                const projectId = postRes.body.id_project;
                chai.request(server)
                    .get(`/project/${projectId}`)
                    .end((getErr, getRes) => {
                        expect(getRes).to.have.status(200);
                        chai.request(server)
                            .delete(`/project/${projectId}`)
                            .end((deleteErr, deleteRes) => {
                                expect(deleteRes).to.have.status(200);
                                done();
                            });
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
            const invalidProjectData = {};
            chai.request(server)
                .post('/project')
                .send(invalidProjectData)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    done();
                });
        });


        // PUT request with invalid data
        it('should return 400 for invalid project data on PUT', async () => {
            // Create a new project
            const newProject = { description: 'Temporary Project' };
            const postRes = await chai.request(server).post('/project').send(newProject);

            // Ensure project creation was successful
            expect(postRes).to.have.status(201);
            const projectId = postRes.body.id_project;
            expect(projectId).to.be.a('number');

            // Try to update it with invalid data (e.g., missing 'description')
            const invalidProjectData = { description: null };
            const res = await chai.request(server).put(`/project/${projectId}`).send(invalidProjectData);
            expect(res).to.have.status(400);
        });
    });

    // DELETE request for a non-existent project
    it('should return 404 for a non-existent project on DELETE', done => {
        const projectId = 999;
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
