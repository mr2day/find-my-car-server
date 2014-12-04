var Mongoose = require('mongoose');

var Schema = new Mongoose.Schema({
    garageId: { // TODO: create index on this
        type: String,
        required: true
    },
    occupied: {  // TODO: create index on this
        type: Boolean,
        required: true
    },
    label: { 
        type: String,
        required: true 
    },
    carPhotoPath: {
        type: String,
        required: false
    },
    numberPlate:  {  // TODO: create index on this
        type: String,
        required: false
    },
    guessedCars:  {
        type: Array,
        required: false
    },
});

module.exports = Mongoose.model('Spot', Schema);