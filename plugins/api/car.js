var Joi = require('joi');

var pluginName = 'car';

// plugin
exports.register = function(plugin, options, next) {

    // require plugin's base model
    var Model = require('../../models/car');

    // Routes:
    // Get all cars for a certain user & mark the one that is parked in an INDECT garage
    plugin.route({
        path: '/'+pluginName+'/{userId}',
        method: 'GET',
        config: {
            auth: 'apiToken',
            handler: function (request, reply) {
            
                Model.find({ userId: request.params.userId }, function(err, dtos) {
                    if (err) {
                        reply(err);
                        return;
                    }

                    reply(dtos);
                });
            },
            validate: {
                params: {
                    userId: Joi.string().required(),
                }
            }
        }
    });
    

	next();
};

exports.register.attributes = {
    name: pluginName
};