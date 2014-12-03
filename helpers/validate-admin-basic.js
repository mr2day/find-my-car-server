var bcrypt = require('bcryptjs');
var Model = require('../models/admin');

module.exports = function(username, password, next) {
	
	// find user
	Model.findOne({ email: username }, function(err, dto) {
		if (err) {
			console.log(err);
			return next(err);
		}
		if (!dto) {
			return next(null, false);
		}

		bcrypt.compare(password, dto.password, function(err, isValid) {
			if (err) console.log(err);
			next(err, isValid, { id: dto.id, email: dto.email, firstName: dto.firstName, lastName: dto.lastName });
		});
	});
};