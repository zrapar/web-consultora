const { upload } = require('bugsnag-sourcemaps');
const glob = require('glob');
const fs = require('fs');
const appVersion = require('./package.json').version;
const web = require('./package.json').web;
const reportBuild = require('bugsnag-build-reporter');
require('dotenv').config();

/**
 * Find all of the map files in ./build
 */
function findSourceMaps(callback) {
	return glob('build/**/*/*.map', callback);
}

/**
 * Uploads the source map with accompanying sources
 * @param sourceMap - single .map file
 * @returns {Promise<string>} - upload to Bugsnag
 */
function uploadSourceMap(sourceMap) {
	// Remove .map from the file to get the js filename
	const minifiedFile = sourceMap.replace('.map', '');

	// Remove absolute path to the static assets folder
	const minifiedFileRelativePath = minifiedFile.split('build/')[1];

	return upload({
		apiKey        : process.env.REACT_APP_Bugsnag_Key,
		appVersion    : appVersion,
		overwrite     : true,
		minifiedUrl   : `http*:///${minifiedFileRelativePath}`,
		sourceMap,
		minifiedFile,
		projectRoot   : __dirname,
		uploadSources : true
	});
}

/**
 * Delete the .map files
 * We do this to protect our source
 * @param files - array of sourcemap files
 */
function deleteFiles(files) {
	files.forEach((file) => {
		const path = `${__dirname}/${file}`;
		fs.unlinkSync(path);
	});
}

/**
 * Notifies Bugsnag of the new release
 */
function notifyRelease() {
	reportBuild({
		apiKey     : process.env.REACT_APP_Bugsnag_Key,
		appVersion
	})
		.then(() => console.log('Bugsnag build reported'))
		.catch((err) => console.log('Reporting Bugsnag build failed', err.messsage));
}

/**
 * Find, upload and delete Source Maps
 */
function processSourceMaps() {
	console.log(process.env.REACT_APP_Staging);
	if (process.env.REACT_APP_Staging === 'production') {
		console.log('Starting upload');
		findSourceMaps((error, files) =>
			Promise.all(files.map(uploadSourceMap))
				.then(() => {
					deleteFiles(files);
					notifyRelease();
					console.log('Success Upload :3, thanks for watching');
				})
				.catch((e) => {
					console.log(e);
				})
		);
	} else {
		console.log('No production enviroment');
	}
}

processSourceMaps();
