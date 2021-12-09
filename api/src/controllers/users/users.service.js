const User = require('../../model/user.model');

exports.create = (user) => {
    const newUser = new User(user);
    return newUser.save();
}

exports.findAll = () => User.find().select({_id: 0, userName: 1, email: 1}) 

exports.findById = (id) => User.findById(id);
