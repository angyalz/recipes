const { mockRequest, mockResponse } = require('jest-mock-req-res');
const createError = require('http-errors');

const unitController = require('./units.controller');
const unitService = require('./units.service');

jest.mock('./units.service.js')

describe("UnitController tests", () => {

    const mockData = [
        {
            "id": 1,
            "unitName": "db",
        }, {
            "id": 2,
            "unitName": "kg",
        }, {
            "id": 3,
            "unitName": "liter",
        }, {
            "id": 4,
            "unitName": "kk",
        }, {
            "id": 5,
            "unitName": "csipet",
        }
    ];

    let nextFunction;
    let response;

    beforeEach(() => {
        unitService.__setMockData(mockData);
        nextFunction = jest.fn();
        response = mockResponse();
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    test('getUnitsById - Valid ID', () => {

        const TARGET_INGREDIENT_ID = 1;
        const TARGET_INGREDIENT = mockData.find(u => u.id === TARGET_INGREDIENT_ID);

        const request = mockRequest({
            params: {
                id: TARGET_INGREDIENT_ID
            }
        });

        return unitController.getUnitById(request, response, nextFunction)
            .then(() => {
                expect(unitService.findById).toBeCalledWith(TARGET_INGREDIENT_ID);
                expect(response.json).toBeCalledWith(TARGET_INGREDIENT);
            });
    });

    test('getUnitById - invalid ID', () => {

        const TARGET_INGREDIENT_ID = 9;

        const request = mockRequest({
            params: {
                id: TARGET_INGREDIENT_ID
            }
        });

        return unitController.getUnitById(request, response, nextFunction)
            .then(() => {
                expect(unitService.findById).toBeCalledWith(TARGET_INGREDIENT_ID);
                expect(nextFunction).toBeCalledWith(new createError[500](`Could not send unit by id:${TARGET_INGREDIENT_ID}`));
                expect(response.json).not.toBeCalled();
            })
    });

    test('getAllUnits', () => {

        const request = mockRequest();

        return unitController.getAllUnits(request, response, nextFunction)
            .then(() => {
                expect(unitService.findAll).toBeCalled();
                expect(response.json).toBeCalledWith(mockData);
            })
    });

    test('createNewUnit', () => {

        const request = mockRequest({
            body: {
                unit_name: "db"
            }
        });

        const newUnit = {
            unitName: "db"
        }


        return unitController.createNewUnit(request, response, nextFunction)
            .then(() => {
                expect(unitService.create).toBeCalledWith(newUnit);
                expect(response.json).toBeCalledWith(newUnit);
            })
    })
})