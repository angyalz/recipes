const unitService = jest.mock('./units.service.js');

let mockData;

unitService.findById = jest.fn(id => Promise.resolve(mockData.find(u => u.id === id)));
unitService.findAll = jest.fn(() => Promise.resolve(mockData));
unitService.create = jest.fn(newUnit => Promise.resolve(newUnit));
unitService.__setMockData = data => mockData = data;

module.exports = unitService;