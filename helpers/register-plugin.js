var config = require('../config');

module.exports = function(db, pack) {

	var pluginsMap = config.plugins;
	var registerErrors = [];

	// function for registering "standard" plugins in bulk
	var registerPlugin = function(registerErrors, db, pack, pluginSticker) {

		pack.register([
			{
				name: pluginSticker.name,
				plugin: require('../plugins/'+pluginSticker.label+'/'+pluginSticker.name),
				options: {
		            db: db // passes the db connection to the plugin
		        }
			}
		], { select: pluginSticker.label }, function(err) {
			if (err) {
				registerErrors.push(err);
			}
		});		
	};

	// register "standard" plugins
	for (var i = pluginsMap.length - 1; i >= 0; i--) {
	
		registerPlugin(registerErrors, db, pack, pluginsMap[i]);
	}

	// register "custom" plugins
	

	return registerErrors;	
};