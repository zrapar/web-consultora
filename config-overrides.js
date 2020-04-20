module.exports = function override(config) {
	console.log(config);
	config.output.globalObject = 'this';
	config.module.rules[0].parser.requireEnsure = true;
	return config;
};
