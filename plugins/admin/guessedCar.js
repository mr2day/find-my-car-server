var Joi = require('joi');
Joi.objectId = require('joi-objectid');

var pluginName = 'guessedCar';

// plugin
exports.register = function(plugin, options, next) {

    // require plugin's base model
    var Model = require('../../models/guessedCar');

    // Routes:
    // Create
    plugin.route({
        path: '/'+pluginName,
        method: 'POST',
        config: {
            auth: 'adminBasic',
            handler: function (request, reply) {
                    
                // validate existence of spot
                var SpotModel = require('../../models/spot');
                SpotModel.findOne({ _id: request.payload.spotId }, function(err, spotDto) {
                    if (err) {
                        console.log(err);
                        reply(err);
                        return;
                    }
                    
                    if (spotDto === null) {
                        reply('There is no spot registered with this id!');
                        return;
                    }

                    var dto = new Model({
                        spotId: request.payload.spotId,
                        numberPlate: request.payload.numberPlate,
                        photoPath: request.payload.photoPath,
                        dateUpdated: new Date(),
                    });

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
                payload: {
                    spotId: Joi.objectId(),
                    numberPlate: Joi.string(),
                    photoPath: Joi.string(),
                }
            }
        }
    });

    // Get all
    plugin.route({
        path: '/'+pluginName,
        method: 'GET',
        config: {
            auth: 'adminBasic',
            handler: function (request, reply) {
            
                Model.find(function(err, dtos) {
                    if (err) {
                        reply(err);
                        return;
                    }

                    reply(dtos);
                });
            }
        }
    });

    // Get all for spot
    plugin.route({
        path: '/'+pluginName+'/spotId/{spotId}',
        method: 'GET',
        config: {
            auth: 'adminBasic',
            handler: function (request, reply) {
            
                // validate existence of spot
                var SpotModel = require('../../models/spot');
                SpotModel.findOne({ _id: request.params.spotId }, function(err, spotDto) {
                    if (err) {
                        reply(err);
                        return;
                    }
                    if (!spotDto) {
                        reply('There is no spot registered with this id!');
                        return;
                    }

                    Model.find({ spotId: request.params.spotId }, function(err, dtos) {
                        if (err) {
                            reply(err);
                            return;
                        }

                        reply(dtos);
                    });
                });
            },
            validate: {
                params: {
                    spotId: Joi.string().min(12),
                }
            }
        }
    });
    
    // Get one
    plugin.route({
        path: '/'+pluginName+'/{id}',
        method: 'GET',
        config: {
            auth: 'adminBasic',
            handler: function(request, reply) {
                Model.findOne({ _id: request.params.id }, function(err, dto) {
                    if (err){
                        reply(err);
                        return;
                    }

                    reply(dto);
                });
            },
            validate: {
                params: {
                    id: Joi.string().min(12)
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
                    if (request.payload.spotId) dto.spotId = request.payload.spotId;
                    if (request.payload.numberPlate) dto.numberPlate = request.payload.numberPlate;
                    if (request.payload.photoPath) dto.photoPath = request.payload.photoPath;

                    dto.dateUpdated = new Date();

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
                    spotId: Joi.objectId(),
                    numberPlate: Joi.string(),
                    photoPath: Joi.string(),
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