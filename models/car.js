var Mongoose = require('mongoose');

var Schema = new Mongoose.Schema({
    numberPlate: { 
        type: String,
        unique: true, 
        required: true 
    },
    brand: { 
        type: String, 
        required: false
    },
    userId: {
    	type: String, 
        required: true
    },
    garageId: {
        type: String,
        required: false
    }
});

module.exports = Mongoose.model('Car', Schema);