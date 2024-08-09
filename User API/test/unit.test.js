import * as chai from 'chai';
import supertest from 'supertest';
import { constants } from '../src/utils/utils.js';
import jwt from 'jsonwebtoken';

const expect = chai.expect;
const requester = supertest(`http://localhost:${constants.PORT}`);

describe('SignUp Test', function() {
    describe('Signup test', () => {
        it('Endpoint: /signup. Should create a user in the DB', async () => {
            const userMock = {
                firstName: 'Test',
                lastName: 'Test',
                email: 'test@gmail.com',
                password: 'testpass',
                confirmPass: 'testpass'
            };
            const { statusCode, ok, body } = await requester.post('/signup').send(userMock);
            expect(statusCode).to.be.oneOf([200, 201]);
            expect(ok).to.be.true;

            expect(body).to.have.property('message');
        });
    });

    describe('Signup test with an email in use', () => {
        it('Endpoint: /signup. Should return a message: "Email already in use"', async () => {
            const userMock = {
                firstName: 'Test',
                lastName: 'Test',
                email: 'test@gmail.com',
                password: 'testpass',
                confirmPass: 'testpass'
            };
            
            await requester.post('/signup').send(userMock);
    
            const { statusCode, res } = await requester.post('/signup').send(userMock);
    
            console.log(statusCode);
            
            expect(statusCode).to.equal(409);
        });
    });
    
    
});

describe('Login Test', function() {
    this.timeout(5000); 

    describe('Test Login', () => {
        it('Endpoint: /login. The user should receive a token that authorizes him to enter.', async () => {
            const userMock = {
                email: 'test@gmail.com',
                password: 'testpass'
            }
            const { statusCode, ok, body } = await requester.post('/login').send(userMock);
            expect(statusCode).to.be.oneOf([200, 201]);
            expect(ok).to.be.true;
        });
    });

    describe('Test Login', () => {
        it('Endpoint: /login. Invalid credentials.', async () => {
            const userMock = {
                email: 'test@gmail.com',
                password: 'wrongpass'
            }
            const { statusCode, ok, body } = await requester.post('/login').send(userMock);
            expect(statusCode).to.equal(401);
            expect(ok).to.be.false;
        });
    });
});

describe('Get Profile Test', function() {
    it('Endpoint: /getUser', async () => {
        const token = jwt.sign({ email: 'test@gmail.com' }, constants.SECRET_KEY, { expiresIn: '1h' });

        const { statusCode, ok, body } = await requester
            .get('/getUser/test@gmail.com')
            .set('auth-token', token);

        expect(statusCode).to.equal(200);
        expect(ok).to.be.true;
        expect(body).to.have.property('email', 'test@gmail.com');
    });
});
