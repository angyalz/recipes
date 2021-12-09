const Unit = require('../../model/unit.model');

exports.create = (unit) => {
    const newUnit = new Unit(unit);
    return newUnit.save();
}

exports.findAll = () => Unit.find().collation({ locale: 'hu' }).sort({ unitName: 1 });

exports.findById = (id) => Unit.findById(id);