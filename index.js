var Hapi = require('hapi');
var pack = new Hapi.Pack();
var db = require('./db');
var config = require('./config');
var validateAdminBasic = require('./helpers/validate-admin-basic');
var validateApiToken = require('./helpers/validate-api-token');

// define servers
var apiServer = pack.server(config.api.port, config.api.host, { labels: 'api' });
var adminServer = pack.server(config.admin.port, config.admin.host, { labels: 'admin' });


// register auth modules
adminServer.pack.register(require('hapi-auth-basic'), function (err) {

    adminServer.auth.strategy('adminBasic', 'basic', { validateFunc: validateAdminBasic });
});

apiServer.pack.register(require('hapi-auth-jwt'), function (err) {

    apiServer.auth.strategy('apiToken', 'jwt', { key: config.api.key, validateFunc: validateApiToken });
});


// register plugins
var registerErrors = require('./helpers/register-plugin')(db, pack);

if (registerErrors.length === 0) {
	pack.start(function() {
		console.log('Hapi pack started.');
	});
}
else {
	for (var i = registerErrors.length - 1; i >= 0; i--) {
		throw registerErrors[i];
	}
}
	

