const { mockRequest, mockResponse } = require('jest-mock-req-res');
const createError = require('http-errors');

const userController = require('./users.controller');
const userService = require('./users.service');

jest.mock('./users.service.js')

describe("UserController tests", () => {

    const mockData = [
        {
            "id": 1,
            "userName": "Laci",
            "email": "laci@mail.com",
            "password": "lacipwd"
        }, {
            "id": 2,
            "userName": "Feri",
            "email": "feri@mail.com",
            "password": "feripwd"
        }, {
            "id": 3,
            "userName": "Pali",
            "email": "pali@mail.com",
            "password": "palipwd"
        }, {
            "id": 4,
            "userName": "Timi",
            "email": "timi@mail.com",
            "password": "timipwd"
        }, {
            "id": 5,
            "userName": "Zsuzsi",
            "email": "zsuzsi@mail.com",
            "password": "zsuzsipwd"
        }
    ];

    let nextFunction;
    let response;

    beforeEach(() => {
        userService.__setMockData(mockData);
        nextFunction = jest.fn();
        response = mockResponse();
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    test('getUsersById - Valid ID', () => {

        const TARGET_INGREDIENT_ID = 1;
        const TARGET_INGREDIENT = mockData.find(u => u.id === TARGET_INGREDIENT_ID);

        const request = mockRequest({
            params: {
                id: TARGET_INGREDIENT_ID
            }
        });

        return userController.getUserById(request, response, nextFunction)
            .then(() => {
                expect(userService.findById).toBeCalledWith(TARGET_INGREDIENT_ID);
                expect(response.json).toBeCalledWith(TARGET_INGREDIENT);
            });
    });

    test('getUserById - invalid ID', () => {

        const TARGET_INGREDIENT_ID = 11;

        const request = mockRequest({
            params: {
                id: TARGET_INGREDIENT_ID
            }
        });

        return userController.getUserById(request, response, nextFunction)
            .then(() => {
                expect(userService.findById).toBeCalledWith(TARGET_INGREDIENT_ID);
                expect(nextFunction).toBeCalledWith(new createError[500](`Could not send user by id:${TARGET_INGREDIENT_ID}`));
                expect(response.json).not.toBeCalled();
            })
    });

    test('getAllUsers', () => {

        const request = mockRequest();

        return userController.getAllUsers(request, response, nextFunction)
            .then(() => {
                expect(userService.findAll).toBeCalled();
                expect(response.json).toBeCalledWith(mockData);
            })
    });

    test('createNewUser', () => {

        const request = mockRequest({
            body: {
                username: "Laci",
                email: "laci@mail.com",
                password: "lacipwd",
            }
        });

        const newUser = {
            userName: "Laci",
            email: "laci@mail.com",
            password: "lacipwd",
        }


        return userController.createNewUser(request, response, nextFunction)
            .then(() => {
                expect(userService.create).toBeCalledWith(newUser);
                expect(response.json).toBeCalledWith(newUser);
            })
    })
})