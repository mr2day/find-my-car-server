var bcrypt = require('bcryptjs');
var Model = require('../models/user');

module.exports = function(decodedToken, next) {

	var userId = decodedToken.accountId;
	
	// find user
	Model.findById(userId, function(err, dto) {
		if (err) {
			console.log(err);
			return next(err);
		}
		if (!dto) {
			return next(null, false);
		}
	
		next(null, true, { id: dto.id, email: dto.email, firstName: dto.firstName, lastName: dto.lastName });
	});
};