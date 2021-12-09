const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const supertest = require('supertest');
const app = require('./server');
const path = require('path');
const Ingredient = require('./model/ingredient.model');
const Recipe = require('./model/recipe.model');
const Token = require('./model/token.model');
const Unit = require('./model/unit.model');
const User = require('./model/user.model');
const dbConfig = config.get('database');

const testUser = require('./supertest/mockData/testuser');
const ingredientData = require('./supertest/mockData/ingredients');
const recipeData = require('./supertest/mockData/recipes');
const unitData = require('./supertest/mockData/units');
const userData = require('./supertest/mockData/users');


describe('REST API /login integration tests', () => {

    beforeAll(async () => {

        await mongoose.connect(`${dbConfig.dbType}${dbConfig.username}${dbConfig.password}${dbConfig.host}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

    })

    beforeEach(async () => {

        await supertest(app)
            .post('/users')
            .send({
                username: testUser.username,
                password: testUser.password,
                email: testUser.email,
                role: testUser.role
            })
            .set('Accept', 'application/json')

    });

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase()
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    })


    test('login test', async () => {
        const response = await supertest(app)
            .post('/login')
            .send(testUser);
        expect(response.statusCode).toBe(200);
        const user = jwt.verify(response.body.accessToken, process.env.ACCESS_TOKEN_SECRET);
        expect(user.username).toBe(testUser.username);
        expect(user.role).toBe(testUser.role);
    });

})

describe('REST API /refresh integration tests', () => {

    let ACCESS_TOKEN;
    let REFRESH_TOKEN;

    beforeAll(async () => {

        await mongoose.connect(`${dbConfig.dbType}${dbConfig.username}${dbConfig.password}${dbConfig.host}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

    })

    beforeEach(async () => {

        await supertest(app)
            .post('/users')
            .send({
                username: testUser.username,
                password: testUser.password,
                email: testUser.email,
                role: testUser.role
            })
            .set('Accept', 'application/json')

        const response = await supertest(app)
            .post('/login')
            .send({
                username: testUser.username,
                password: testUser.password,
            })
            .expect(200)

        ACCESS_TOKEN = response.body.accessToken;
        REFRESH_TOKEN = response.body.refreshToken;
    });

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase()
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase()
        await mongoose.connection.close();
    });


    test('refresh test', async () => {
        const response = await supertest(app)
            .post('/refresh')
            .send({ token: REFRESH_TOKEN });
        expect(response.statusCode).toBe(200);
        const user = jwt.verify(response.body.accessToken, process.env.ACCESS_TOKEN_SECRET);
        expect(user.username).toBe(testUser.username);
        expect(user.role).toBe(testUser.role);
    });

});


describe('REST API /logout integration tests', () => {

    let ACCESS_TOKEN;
    let REFRESH_TOKEN;

    beforeAll(async () => {

        await mongoose.connect(`${dbConfig.dbType}${dbConfig.username}${dbConfig.password}${dbConfig.host}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

    })

    beforeEach(async () => {

        await supertest(app)
            .post('/users')
            .send({
                username: testUser.username,
                password: testUser.password,
                email: testUser.email,
                role: testUser.role
            })
            .set('Accept', 'application/json')

        const response = await supertest(app)
            .post('/login')
            .send({
                username: testUser.username,
                password: testUser.password,
            })
            .expect(200)

        ACCESS_TOKEN = response.body.accessToken;
        REFRESH_TOKEN = response.body.refreshToken;

    });



    afterEach(async () => {
        await mongoose.connection.db.dropDatabase()
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    })


    test('logout test', async () => {
        const response = await supertest(app)
            .post('/logout')
            .send({ token: REFRESH_TOKEN });
        expect(200);
    });

});


describe('REST API /users integration tests', () => {

    let ACCESS_TOKEN;
    let REFRESH_TOKEN;

    beforeAll(async () => {

        await mongoose.connect(`${dbConfig.dbType}${dbConfig.username}${dbConfig.password}${dbConfig.host}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

    })

    beforeEach(async () => {

        await supertest(app)
            .post('/users')
            .send({
                username: testUser.username,
                password: testUser.password,
                email: testUser.email,
                role: testUser.role
            })
            .set('Accept', 'application/json')

        const response = await supertest(app)
            .post('/login')
            .send({
                username: testUser.username,
                password: testUser.password,
            })
            .expect(200)

        ACCESS_TOKEN = response.body.accessToken;
        REFRESH_TOKEN = response.body.refreshToken;

    });

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase()
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    })

    test('GET /users', async () => {

        await User.insertMany(userData);
        const response = await supertest(app)
            .get('/users')
            .set('Authorization', 'Bearer ' + ACCESS_TOKEN)
            .expect(200);
        response.body.splice(0, 1);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(userData.length);
        response.body.forEach((users, index) => {
            expect(users.userName).toBe(userData[index].userName);
            expect(users.email).toBe(userData[index].email);
        });
    });

    test('GET /users/:id', async () => {
        let idData;
        const users = await User.insertMany(userData);
        idData = users[0]._id;
        const response = await supertest(app)
            .get('/users/' + users[0]._id)
            .set('Authorization', 'Bearer ' + ACCESS_TOKEN)
            .expect(200);
        expect(typeof (response.body) === 'object').toBeTruthy();
        expect(response.body.userName).toBe(userData[0].userName);
        expect(response.body.email).toBe(userData[0].email);
        expect(response.body.password).toBe(userData[0].password);
        expect(response.body.role).toBe(userData[0].role);
        expect(response.body._id).toBe(idData.toString());
    })

    test('POST /users', async () => {
        const response = await supertest(app)
            .post('/users')
            .send(testUser)
            .expect(201);
        expect(response.body.userName).toBe(testUser.username);
        expect(response.body.password).toBe(testUser.password);
        expect(response.body.email).toBe(testUser.email);
        expect(response.body.role).toBe(testUser.role);
    });

});


describe('REST API /units integration tests', () => {

    beforeAll(async () => {

        await mongoose.connect(`${dbConfig.dbType}${dbConfig.username}${dbConfig.password}${dbConfig.host}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

    })

    beforeEach(async () => {

        await supertest(app)
            .post('/users')
            .send({
                username: testUser.username,
                password: testUser.password,
                email: testUser.email,
                role: testUser.role
            })
            .set('Accept', 'application/json')

        const response = await supertest(app)
            .post('/login')
            .send({
                username: testUser.username,
                password: testUser.password,
            })
            .expect(200)

    });

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase()
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    })


    test('GET /units', async () => {

        await Unit.insertMany(unitData);
        const response = await supertest(app)
            .get('/units')
            .expect(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(unitData.length);
        response.body.forEach((units, index) => {
            expect(units.unitName).toBe(unitData[index].unitName);
        });
    });

});


describe('REST API /ingredients integration tests', () => {

    beforeAll(async () => {

        await mongoose.connect(`${dbConfig.dbType}${dbConfig.username}${dbConfig.password}${dbConfig.host}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

    })

    beforeEach(async () => {

        await supertest(app)
            .post('/users')
            .send({
                username: testUser.username,
                password: testUser.password,
                email: testUser.email,
                role: testUser.role
            })
            .set('Accept', 'application/json')

        const response = await supertest(app)
            .post('/login')
            .send({
                username: testUser.username,
                password: testUser.password,
            })
            .expect(200)

    });

    afterEach(async () => {
        await mongoose.connection.db.dropDatabase()
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    })


    test('GET /ingredients', async () => {

        await Ingredient.insertMany(ingredientData);
        const response = await supertest(app)
            .get('/ingredients')
            .expect(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(ingredientData.length);
        response.body.forEach((ingredients, index) => {
            expect(ingredients.ingredientName).toBe(ingredientData[index].ingredientName);
        });
    });
});

