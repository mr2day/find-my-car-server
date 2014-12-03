var pluginName = 'login';
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config');

// plugin
exports.register = function(plugin, options, next) {

	var Model = require('../../models/user');

	// login route
	plugin.route({
        path: '/'+pluginName,
        method: 'POST',
        config: {
            handler: function (request, reply) {
            	
            	Model.findOne({ email: request.payload.email }, function(err, dto) {
                    if (err) {
                        reply(err);
                        return;
                    }
                    if (!dto) {
						reply(null, false);
						return;
					}

					// verify password
					bcrypt.compare(request.payload.password, dto.password, function(err, isValid) {
						if (err) {
	                        reply(err);
	                        return;
	                    }
						
						var token = jwt.sign({ accountId: dto.id }, config.api.key);

						reply(null, token);
					});
                });
            }
        }
    });
};