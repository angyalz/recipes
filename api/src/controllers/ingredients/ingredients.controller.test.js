const { mockRequest, mockResponse } = require('jest-mock-req-res');
const createError = require('http-errors');

const ingredientController = require('./ingredients.controller');
const ingredientService = require('./ingredients.service');

jest.mock('./ingredients.service.js')

describe("IngredientController tests", () => {

    const mockData = [
        {
            "id": 1,
            "ingredientName": "cheese",
        }, {
            "id": 2,
            "ingredientName": "salt",
        }, {
            "id": 3,
            "ingredientName": "pepper",
        }, {
            "id": 4,
            "ingredientName": "meat",
        }, {
            "id": 5,
            "ingredientName": "paprika",
        }
    ];

    let nextFunction;
    let response;

    beforeEach(() => {
        ingredientService.__setMockData(mockData);
        nextFunction = jest.fn();
        response = mockResponse();
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    test('getIngredientsById - Valid ID', () => {

        const TARGET_INGREDIENT_ID = 1;
        const TARGET_INGREDIENT = mockData.find(i => i.id === TARGET_INGREDIENT_ID);

        const request = mockRequest({
            params: {
                id: TARGET_INGREDIENT_ID
            }
        });

        return ingredientController.getIngredientById(request, response, nextFunction)
            .then(() => {
                expect(ingredientService.findById).toBeCalledWith(TARGET_INGREDIENT_ID);
                expect(response.json).toBeCalledWith(TARGET_INGREDIENT);
            });
    });

    test('getIngredientById - invalid ID', () => {

        const TARGET_INGREDIENT_ID = 7;

        const request = mockRequest({
            params: {
                id: TARGET_INGREDIENT_ID
            }
        });

        return ingredientController.getIngredientById(request, response, nextFunction)
            .then(() => {
                expect(ingredientService.findById).toBeCalledWith(TARGET_INGREDIENT_ID);
                expect(nextFunction).toBeCalledWith(new createError[500](`Could not send ingredient by id:${TARGET_INGREDIENT_ID}`));
                expect(response.json).not.toBeCalled();
            })
    });

    test('getAllIngredients', () => {

        const request = mockRequest();

        return ingredientController.getAllIngredients(request, response, nextFunction)
            .then(() => {
                expect(ingredientService.findAll).toBeCalled();
                expect(response.json).toBeCalledWith(mockData);
            })
    });

    test('createNewIngredient', () => {

        const request = mockRequest({
            body: {
                ingredient_name: "cheese"
            }
        });

        const newIngredient = {
            ingredientName: "cheese"
        }

        return ingredientController.createNewIngredient(request, response, nextFunction)
            .then(() => {
                expect(ingredientService.create).toBeCalledWith(newIngredient);
                expect(response.json).toBeCalledWith(newIngredient);
            })
    })
})