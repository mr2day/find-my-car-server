var Joi = require('joi');
Joi.objectId = require('joi-objectid');

var pluginName = 'spot';

// plugin
exports.register = function(plugin, options, next) {

    // require plugin's base model
    var Model = require('../../models/spot');

    // Routes:
    // Create
    plugin.route({
        path: '/'+pluginName,
        method: 'POST',
        config: {
            auth: 'adminBasic',
            handler: function (request, reply) {
                    
                // validate existence of garage
                var GarageModel = require('../../models/garage');
                GarageModel.findOne({ _id: request.payload.garageId }, function(err, garageDto) {
                    if (err) {
                        console.log(err);
                        reply(err);
                        return;
                    }
                    
                    if (garageDto === null) {
                        reply('There is no garage registered with this id!');
                        return;
                    }

                    var dto = new Model({
                        garageId: request.payload.garageId,
                        occupied: request.payload.occupied,
                        label: request.payload.label,
                        carPhotoPath: request.payload.carPhotoPath,
                        numberPlate: request.payload.numberPlate,
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
                    garageId: Joi.objectId(),
                    occupied: Joi.boolean(),
                    label: Joi.string(),
                    carPhotoPath: Joi.string(),
                    numberPlate: Joi.string(),
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

    // Get all for garage
    plugin.route({
        path: '/'+pluginName+'/garageId/{garageId}',
        method: 'GET',
        config: {
            auth: 'adminBasic',
            handler: function (request, reply) {
            
                // validate existence of garage
                var GarageModel = require('../../models/garage');
                GarageModel.findOne({ _id: request.params.garageId }, function(err, garageDto) {
                    if (err) {
                        reply(err);
                        return;
                    }
                    if (!garageDto) {
                        reply('There is no garage registered with this id!');
                        return;
                    }

                    Model.find({ garageId: request.params.garageId }, function(err, dtos) {
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
                    garageId: Joi.string().min(12),
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
                        console.log(err);
                        reply(err);
                        return;
                    }

                    var GuessedCarModel = require('../../models/guessedCar');
                    GuessedCarModel.find({ spotId: dto._id }, function(err, guessedCars) {

                        if (err){
                            console.log(err);
                            reply(err);
                            return;
                        }

                        if (guessedCars && guessedCars.length > 0) {
                            for (var i = guessedCars.length - 1; i >= 0; i--) {
                                
                                dto.guessedCars.push(guessedCars[i]);
                            }
                        }

                        reply(dto);
                    });
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
                    if (request.payload.garageId) dto.garageId = request.payload.garageId;
                    if (request.payload.occupied) dto.occupied = request.payload.occupied;
                    if (request.payload.label) dto.label = request.payload.label;
                    if (request.payload.carPhotoPath) dto.carPhotoPath = request.payload.carPhotoPath;
                    if (request.payload.numberPlate) dto.numberPlate = request.payload.numberPlate;

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
                    garageId: Joi.objectId(),
                    occupied: Joi.boolean(),
                    label: Joi.string(),
                    carPhotoPath: Joi.string(),
                    numberPlate: Joi.string(),
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