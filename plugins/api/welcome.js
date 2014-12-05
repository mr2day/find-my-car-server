var Joi = require('joi');

var pluginName = 'welcome';

// plugin
exports.register = function(plugin, options, next) {

    // Routes:
    // Welcome
    plugin.route({
        path: '/',
        method: 'GET',
        config: {
            auth: false,
            handler: function (request, reply) {
            
                reply('Welcome to the API server!');
            }
        }
    });

	next();
};

exports.register.attributes = {
    name: pluginName
};