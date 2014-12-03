var Joi = require('joi');

var pluginName = 'garage';

// plugin
exports.register = function(plugin, options, next) {

    // require plugin's base model
    var Model = require('../../models/garage');

    // Routes:
    // Create
    plugin.route({
        path: '/'+pluginName,
        method: 'POST',
        config: {
            auth: false,
            handler: function (request, reply) {
                    
                // validate uniqueness of name
                Model.findOne({ name: request.payload.name }, function(err, someDto) {
                    if (err) {
                        reply(err);
                        return;
                    }
                    if (someDto) {
                        reply('There is already a garage registered with this name!');
                        return;
                    }
                });
                
                var dto = new Model({
                    name: request.payload.name,
                    imagePath: request.payload.imagePath,
                    mapPath: request.payload.mapPath,
                    address: {
                        street: request.payload.street,
                        number: request.payload.number,
                        postalCode: request.payload.postalCode,
                        city: request.payload.city,
                    },
                    occupancyRate: request.payload.occupancyRate,
                    program: {
                        openingHour: request.payload.openingHour,
                        closingHour: request.payload.closingHour,
                    },
                    location: {
                        lat: request.payload.lat,
                        lng: request.payload.lng,
                    }
                });

                dto.save(function(err, newDto) {
                    if (err) { 
                        console.log(err);
                        reply(err);
                        return;
                    }

                    reply(newDto);
                });
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

                    //populate with prices
                    var priceModel = require('../../models/price');

                    priceModel.find({ garageId: dto._id }, function(err, prices) {
                        if (prices !== null && prices.length > 0) {
                            
                            var pricesArray = [];
                            for (var i = prices.length - 1; i >= 0; i--) {
                              
                                dto.prices.push(prices[i]);
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
                    if (request.payload.name) dto.name = request.payload.name;
                    if (request.payload.imagePath) dto.imagePath = request.payload.imagePath;
                    if (request.payload.mapPath) dto.mapPath = request.payload.mapPath;
                    if (request.payload.street) dto.address.street = request.payload.street;
                    if (request.payload.number) dto.address.number = request.payload.number;
                    if (request.payload.postalCode) dto.address.postalCode = request.payload.postalCode;
                    if (request.payload.city) dto.address.city = request.payload.city;
                    if (request.payload.occupancyRate) dto.occupancyRate = request.payload.occupancyRate;
                    if (request.payload.openingHour) dto.program.openingHour = request.payload.openingHour;
                    if (request.payload.closingHour) dto.program.closingHour = request.payload.closingHour;
                    if (request.payload.lat) dto.program.location.lat = request.payload.lat;
                    if (request.payload.lng) dto.program.location.lng = request.payload.lng;

                    dto.save(function(err, newDto) {
                        if (err) {
                            console.log(err);
                            reply(err);
                            return;
                        }
                        reply(newDto);
                    });
                });
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