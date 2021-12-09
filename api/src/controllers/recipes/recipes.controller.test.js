const { mockRequest, mockResponse } = require('jest-mock-req-res');
const createError = require('http-errors');

const recipeController = require('./recipes.controller');
const recipeService = require('./recipes.service');
const ingredientService = require('../ingredients/ingredients.service');
const unitService = require('../units/units.service');

jest.mock('./recipes.service.js');
jest.mock('../ingredients/ingredients.service.js');
jest.mock('../units/units.service.js');
jest.mock('../users/users.service.js');

describe("RecipeController tests", () => {

    const mockData = [
        {
            "id": 1,
            "user_id": 11,
            "title": "sajtburger",
            "subtitle": "BBQ",
            "ingredients": [
                {
                    "quantity": 1,
                    "unit": "db",
                    "ingredient": "húspogácsa"
                },
                {
                    "quantity": 1,
                    "unit": "db",
                    "ingredient": "hamburgerzsemle"
                }
            ],
            "methods": [
                { "method": "süsd meg a húst" },
                { "method": "pirítsd meg a zsemlét" },
            ],
            "imageSource": "93421c6660eb6567d9dc68a70bc7d6d5"
        },
        {
            "id": 2,
            "user_id": 12,
            "title": "pizza",
            "subtitle": "sonkás",
            "ingredients": [
                {
                    "quantity": 1,
                    "unit": "db",
                    "ingredient": "pizzatészta"
                },
                {
                    "quantity": 20,
                    "unit": "dkg",
                    "ingredient": "sonka"
                }
            ],
            "methods": [
                { "method": "nyújtsd ki a tésztát" },
                { "method": "kend meg a szósszal" },
                { "method": "pakold rá a sokát" },
                { "method": "szórd meg sajttal" },
                { "method": "300°C-on süsd meg" }
            ],
            "imageSource": "93421c6660eb6567d9dc68a70bc7d6d6"
        },
        {
            "id": 3,
            "user_id": 13,
            "title": "testrecipe 3",
            "subtitle": "",
            "ingredients": [
                {
                    "quantity": 3,
                    "unit": "unit 3",
                    "ingredient": "ingredient 3"
                }
            ],
            "methods": [
                { "method": "testmethod 3" },
            ],
            "imageSource": "93421c6660eb6567d9dc68a70bc7d6d7"
        },
        {
            "id": 4,
            "user_id": 14,
            "title": "testrecipe 4",
            "subtitle": "",
            "ingredients": [
                {
                    "quantity": 4,
                    "unit": "unit 4",
                    "ingredient": "ingredient 4"
                }
            ],
            "methods": [
                { "method": "testmethod 4" },
            ],
            "imageSource": "93421c6660eb6567d9dc68a70bc7d6d8"
        },
        {
            "id": 5,
            "user_id": 15,
            "title": "testrecipe 5",
            "subtitle": "",
            "ingredients": [
                {
                    "quantity": 5,
                    "unit": "unit 5",
                    "ingredient": "ingredient 5"
                }
            ],
            "methods": [
                { "method": "testmethod 5" },
            ],
            "imageSource": "93421c6660eb6567d9dc68a70bc7d6d9"
        }
    ];

    const mockIngData = [
        {
            "_id": 111,
            "ingredientName": "cheese",
        }, {
            "_id": 112,
            "ingredientName": "salt",
        }, {
            "_id": 113,
            "ingredientName": "hamburgerzsemle",
        }, {
            "_id": 114,
            "ingredientName": "meat",
        }, {
            "_id": 115,
            "ingredientName": "húspogácsa",
        }
    ];

    const mockUnitData = [
        {
            "_id": 121,
            "unitName": "db",
        }, {
            "_id": 122,
            "unitName": "kg",
        }, {
            "_id": 123,
            "unitName": "liter",
        }, {
            "_id": 124,
            "unitName": "kk",
        }, {
            "_id": 125,
            "unitName": "csipet",
        }
    ];

    let nextFunction;
    let response;

    beforeEach(() => {
        recipeService.__setMockData(mockData);
        ingredientService.__setMockData(mockIngData);
        unitService.__setMockData(mockUnitData);
        nextFunction = jest.fn();
        response = mockResponse();
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    test('getRecipesById - Valid ID', () => {

        const TARGET_INGREDIENT_ID = 1;
        const TARGET_INGREDIENT = mockData.find(r => r.id === TARGET_INGREDIENT_ID);

        const request = mockRequest({
            params: {
                id: TARGET_INGREDIENT_ID
            }
        });

        return recipeController.getRecipeById(request, response, nextFunction)
            .then(() => {
                expect(recipeService.findById).toBeCalledWith(TARGET_INGREDIENT_ID);
                expect(response.json).toBeCalledWith(TARGET_INGREDIENT);
            });
    });

    test('getRecipeById - invalid ID', () => {

        const TARGET_INGREDIENT_ID = 8;

        const request = mockRequest({
            params: {
                id: TARGET_INGREDIENT_ID
            }
        });

        return recipeController.getRecipeById(request, response, nextFunction)
            .then(() => {
                expect(recipeService.findById).toBeCalledWith(TARGET_INGREDIENT_ID);
                expect(nextFunction).toBeCalledWith(new createError[500](`Could not send recipe by id:${TARGET_INGREDIENT_ID}`));
                expect(response.json).not.toBeCalled();
            })
    });

    test('getAllRecipess', () => {

        const request = mockRequest();

        return recipeController.getAllRecipes(request, response, nextFunction)
            .then(() => {
                expect(recipeService.findAll).toBeCalled();
                expect(response.json).toBeCalledWith(mockData);
            })
    });

    test('createNewRecipe', () => {

        const recipe = JSON.stringify({
            userId: 11,
            title: "sajtburger",
            subtitle: "BBQ",
            ingredients: [
                {
                    quantity: 1,
                    unit: "db",
                    ingredient: "húspogácsa"
                },
                {
                    quantity: 1,
                    unit: "db",
                    ingredient: "hamburgerzsemle"
                }
            ],
            methods: [
                { method: "süsd meg a húst" },
                { method: "pirítsd meg a zsemlét" },
            ],
            imageFile: "93421c6660eb6567d9dc68a70bc7d6d5"
        });

        const request = mockRequest({
            body: {recipe: recipe}, 
            file: { filename: "93421c6660eb6567d9dc68a70bc7d6d5" }
        });

        const newRecipe = {
            user_id: 11,
            title: "sajtburger",
            subtitle: "BBQ",
            ingredients: [
                {
                    quantity: 1,
                    unit: 121,
                    ingredient: 115
                },
                {
                    quantity: 1,
                    unit: 121,
                    ingredient: 113
                }
            ],
            methods: [
                { method: "süsd meg a húst" },
                { method: "pirítsd meg a zsemlét" },
            ],
            imageSource: "93421c6660eb6567d9dc68a70bc7d6d5"
        }


        return recipeController.createNewRecipe(request, response, nextFunction)
            .then(() => {
                expect(recipeService.create).toBeCalledWith(newRecipe);
                expect(response.json).toBeCalledWith(newRecipe);
            })
    })
})