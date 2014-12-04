var Mongoose = require('mongoose');

var Schema = new Mongoose.Schema({
    spotId: { // TODO: create index on this
        type: String,
        required: true
    },
    numberPlate: {  // TODO: create index on this
        type: String,
        required: true
    },
    photoPath: {
        type: String,
        required: true
    },
    dateUpdated: {
        type: Date,
        required: false
    },
});

module.exports = Mongoose.model('GuessedCar', Schema);