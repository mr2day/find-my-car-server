var Mongoose = require('mongoose');

var Schema = new Mongoose.Schema({
    found: { 
        type: Boolean,
        required: false 
    },
    mapPath: { 
        type: String, 
        required: false
    },
    spotLabel: {
    	type: String, 
        required: false
    },
    carPhotos: {
        type: Array,
        required: false
    },
    notFoundMessage: {
    	type: String,
    	required: false
    }
});

module.exports = Mongoose.model('findCar', Schema);