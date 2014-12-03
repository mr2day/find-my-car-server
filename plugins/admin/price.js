var Joi = require('joi');
Joi.objectId = require('joi-objectid');

var pluginName = 'price';

// plugin
exports.register = function(plugin, options, next) {

    // require plugin's base model
    var Model = require('../../models/price');

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
                        sector: request.payload.sector,
                        price: request.payload.price,
                        timeUnit: request.payload.timeUnit,
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
                    sector: Joi.string(),
                    price: Joi.string().required(),
                    timeUnit: Joi.string().required()
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
                    if (request.payload.garageId) dto.garageId = request.payload.garageId;
                    if (request.payload.sector) dto.sector = request.payload.sector;
                    if (request.payload.price) dto.price = request.payload.price;
                    if (request.payload.timeUnit) dto.timeUnit = request.payload.timeUnit;

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
                    garageId: Joi.string().min(12),
                    sector: Joi.string(),
                    price: Joi.string(),
                    timeUnit: Joi.string(),
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