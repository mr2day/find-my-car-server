var Mongoose = require('mongoose');

var Schema = new Mongoose.Schema({
    garageId: {
        type: String,
        required: true
    },
    sector: {
        type: String,
        required: false
    },
    price: {
        type: String,
        required: true
    },
    timeUnit: {
        type: String,
        required: true
    },
});

module.exports = Mongoose.model('Price', Schema);