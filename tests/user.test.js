// Import necessary libraries
const request = require('supertest'); // For making HTTP requests in tests
const app = require('../src/app'); // Import the Express app
const mongoose = require('mongoose'); // MongoDB object modeling tool
const User = require('../src/models/User'); // Import the User model

// Connect to the MongoDB database before running tests
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

// Clean up the database and close the connection after all tests have run
afterAll(async () => {
    await User.deleteMany({}); // Remove all users from the database
    await mongoose.connection.close(); // Close the MongoDB connection
});

// Group tests related to the User Service
describe('User Service', () => {
    
    // Test case for registering a new user
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/users/register') // Send POST request to register endpoint
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            });

        // Check if the response status code is 201 (Created)
        expect(response.statusCode).toBe(201);
        // Verify the success message in the response body
        expect(response.body.message).toBe('User registered successfully');

        // Verify that the user was actually created in the database
        const userCount = await User.countDocuments({ email: 'test@example.com' });
        expect(userCount).toBe(1); // There should be one user in the database
    });

    // Test case for logging in an existing user
    it('should login an existing user', async () => {
        // First, register the user
        await request(app)
            .post('/api/users/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            });

        // Now try to log in with the same credentials
        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: 'test@example.com',
                password: 'password123',
            });

        // Check if the response status code is 200 (OK)
        expect(response.statusCode).toBe(200);
        // The response should include a token
        expect(response.body.token).toBeDefined();
    });

    // Test case for attempting to log in with invalid credentials
    it('should not login with invalid credentials', async () => {
        // Attempt to log in with incorrect password
        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: 'test@example.com',
                password: 'wrongPassword',
            });

        // Check if the response status code is 401 (Unauthorized)
        expect(response.statusCode).toBe(401);
        // Verify the error message in the response body
        expect(response.body.message).toBe('Invalid credentials');
    });

    // Test case for attempting to register a user with an existing email
    it('should not register a user with an existing email', async () => {
        // First, register a user with a specific email
        await request(app)
            .post('/api/users/register')
            .send({
                username: 'testuser2',
                email: 'test@example.com',
                password: 'password123',
            });

        // Now attempt to register another user with the same email
        const response = await request(app)
            .post('/api/users/register')
            .send({
                username: 'testuser3',
                email: 'test@example.com',
                password: 'password456',
            });

        // Check if the response status code indicates an error (500 in this case)
        expect(response.statusCode).toBe(500); // Adjust based on your error handling
        // Verify that an error message is present in the response
        expect(response.body.message).toBeDefined(); // Adjust based on your error handling
    });
});