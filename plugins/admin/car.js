var Joi = require('joi');

var pluginName = 'car';

// plugin
exports.register = function(plugin, options, next) {

    // require plugin's base model
    var Model = require('../../models/car');

    // Routes:
    // Create
    plugin.route({
        path: '/'+pluginName,
        method: 'POST',
        config: {
            auth: 'adminBasic',
            handler: function (request, reply) {
                    
                    // validate uniqueness of numberPlate
                    Model.findOne({ numberPlate: request.payload.numberPlate, userId: request.payload.userId }, function(err, someDto) {
                        if (err) {
                            reply(err);
                            return;
                        }
                        if (someDto) {
                            reply('A car is already registered with this number plate!');
                            return;
                        }
                    });

                    var dto = new Model({
                    numberPlate: request.payload.numberPlate,
                    brand: request.payload.brand,
                    userId: request.payload.userId, // TODO: validate userId exists in the db
                });

                dto.save(function(err, newDto) {
                    if (err) {
                        reply(err);
                        return;
                    }

                    reply(newDto);
                });
            },
            validate: {
                payload: {
                    numberPlate: Joi.string().required(),
                    brand: Joi.string(),
                    userId: Joi.string().required(),
                }
            }
        }
    });

    // Get all cars for a certain user
    plugin.route({
        path: '/'+pluginName+'/{userId}',
        method: 'GET',
        config: {
            auth: 'adminBasic',
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
    
    // Get one
    plugin.route({
        path: '/'+pluginName+'/{userId}/{id}',
        method: 'GET',
        config: {
            auth: 'adminBasic',
            handler: function(request, reply) {
                Model.findOne({ userId: request.params.userId, _id: request.params.id }, function(err, dto) {
                    if (err){
                        reply(err);
                        return;
                    }

                    reply(dto);
                });
            },
            validate: {
                params: {
                    userId: Joi.string().required(),
                    id: Joi.string().min(12),
                }
            }
        }
    });

    // Update
    plugin.route({
        path: '/'+pluginName+'/{id}',
        method: 'PUT',
        config: {
            auth: 'adminBasic',
            handler: function(request, reply) {
                Model.findOne({ _id: request.params.id }, function(err, dto) {
                    if (err){
                        reply(err);
                        return;
                    }

                    // update
                    if (request.payload.numberPlate !== undefined) dto.numberPlate = request.payload.numberPlate;
                    if (request.payload.brand !== undefined) dto.brand = request.payload.brand;

                    dto.save(function(err, newDto) {
                        if (err) {
                            reply(err);
                            return;
                        }
                        reply(newDto);
                    });
                });
            },
            validate: {
                params: {
                    id: Joi.string().min(12),
                },
                payload: {
                    numberPlate: Joi.string(),
                    brand: Joi.string(),
                }
            }
        }
    });

    // Delete
    plugin.route({
        path: '/'+pluginName+'/{id}',
        method: 'DELETE',
        config: {
            auth: 'adminBasic',
            handler: function(request, reply) {
                Model.findByIdAndRemove(request.params.id, function(err, dto) {
                    if (err) {
                        reply(err);
                        return;
                    }

                    reply('success');
                });
            },
            validate: {
                params: {
                    id: Joi.string().min(12)
                }
            }
        }
    });

	next();
};

exports.register.attributes = {
    name: pluginName
};