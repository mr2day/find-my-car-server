var Joi = require('joi');

var pluginName = 'admin';

// plugin
exports.register = function(plugin, options, next) {

    // require plugin's base model
    var Model = require('../../models/admin');

    // Routes:
    // Create
    plugin.route({
        path: '/'+pluginName,
        method: 'POST',
        config: {
            auth: false,
            handler: function (request, reply) {
                    
                    // validate uniqueness of email
                    Model.findOne({ email: request.payload.email }, function(err, someDto) {
                        if (err) {
                            reply(err);
                            return;
                        }
                        if (someDto) {
                            reply('A user is already registered with this email!');
                            return;
                        }
                    });
                    
                    var dto = new Model({
                    email: request.payload.email,
                    firstName: request.payload.firstName,
                    lastName: request.payload.lastName,
                    password: request.payload.password,
                    role: request.payload.role,
                });

                dto.save(function(err, newDto) {
                    if (err) { 
                        console.log(err);
                        reply(err);
                        return;
                    }

                    reply(newDto);
                });
            },
            validate: {
                payload: {
                    email: Joi.string().email().required(),
                    firstName: Joi.string().required(),
                    lastName: Joi.string().min(2).required(),
                    password: Joi.string().min(6).required(),
                    role: Joi.string().required().valid(['admin', 'god']),
                }
            }
        }
    });

    // Get all
    plugin.route({
        path: '/'+pluginName,
        method: 'GET',
        config: {
            auth: false,
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
                    if (request.payload.firstName !== undefined) dto.firstName = request.payload.firstName;
                    if (request.payload.lastName !== undefined) dto.lastName = request.payload.lastName;
                    if (request.payload.email !== undefined) dto.email = request.payload.email;
                    if (request.payload.password !== undefined) dto.password = request.payload.password;

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
                    email: Joi.string().email(),
                    firstName: Joi.string(),
                    lastName: Joi.string().min(2),
                    password: Joi.string().min(6)
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