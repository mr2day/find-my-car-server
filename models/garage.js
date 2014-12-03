var Mongoose = require('mongoose');

var Schema = new Mongoose.Schema({
    name: { 
        type: String,
        unique: true,
        required: true 
    },
    imagePath: { 
        type: String,
        required: false 
    },
    mapPath: { 
        type: String,
        required: true 
    },
    address: {
        street: { 
            type: String,
            required: true 
        },
        number: { 
            type: String,
            required: true 
        },
        postalCode: { 
            type: String,
            required: true 
        },
        city: { 
            type: String,
            required: true 
        },
    },
    occupancyRate: { 
        type: String,
        required: false 
    },
    prices: { 
        type: Array,
        required: false 
    },
    program: {
        openingHour: { 
            type: String,
            required: false 
        },
        closingHour: { 
            type: String,
            required: false 
        },
    },
    open: { 
        type: Boolean,
        required: false 
    },
    location: {
        lat: {
            type: String,
            required: true
        },
        lng: {
            type: String,
            required: true
        },
    }
});

module.exports = Mongoose.model('Garage', Schema);