const ingredientService = jest.mock('./ingredients.service.js');

let mockData;

ingredientService.findById = jest.fn(id => Promise.resolve(mockData.find(i => i.id === id)));
ingredientService.findAll = jest.fn(() => Promise.resolve(mockData));
ingredientService.create = jest.fn(newIngredient => Promise.resolve(newIngredient));
ingredientService.__setMockData = data => mockData = data;

module.exports = ingredientService;