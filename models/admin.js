var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var generateClientId = require('../helpers/generate-client-id');

var Schema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

// execute before each objectModel.save() call
Schema.pre('save', function(next) {
    var self = this;

    // break out if the password hasn't changed
    if (!self.isModified('password')) 
        return next();

    // password changed, so we need to hash it
    bcrypt.genSalt(5, function(err, salt) {
        if (err)
            return next(err);

        bcrypt.hash(self.password, salt, function(err, hash) {
            if (err)
                return next(err);

            // Store hash in the password DB.
            self.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('Admin', Schema);