const recipeService = jest.mock('./recipes.service.js');

let mockData;

recipeService.findById = jest.fn(id => Promise.resolve(mockData.find(r => r.id === id)));
recipeService.findAll = jest.fn(() => Promise.resolve(mockData));
recipeService.create = jest.fn(newRecipe => Promise.resolve(newRecipe));
recipeService.__setMockData = data => mockData = data;

module.exports = recipeService;