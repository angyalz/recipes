const userService = jest.mock('./users.service.js');

let mockData;

userService.findById = jest.fn(id => Promise.resolve(mockData.find(u => u.id === id)));
userService.findAll = jest.fn(() => Promise.resolve(mockData));
userService.create = jest.fn(newUser => Promise.resolve(newUser));
userService.__setMockData = data => mockData = data;

module.exports = Object.freeze(userService);