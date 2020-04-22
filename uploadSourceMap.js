const fs = require('fs');
const path = require('path');
const { upload } = require('sentry-files');
const { version } = require('./package.json');

const getFiles = () => {
	const BUILD_DIR = 'build';
	const assetsFile = path.resolve(BUILD_DIR, 'asset-manifest.json');
	const filePaths = require(assetsFile);
	const jsFilesRegex = /(\.js(.map)?)$/;
	return Object.keys(filePaths).filter((f) => jsFilesRegex.test(f)).map((f) => ({
		name : `~/${filePaths[f]}`,
		path : path.resolve('build', filePaths[f])
	}));
};

const deleteFiles = (files) => {
	files.forEach(({ path }) => {
		fs.unlinkSync(path);
	});
	console.log('Delete all source maps');
};

if (process.env.REACT_APP_Staging === 'production') {
	upload({
		version      : version,
		organization : process.env.REACT_APP_Sentry_Organization,
		project      : process.env.REACT_APP_Sentry_Project,
		token        : process.env.REACT_APP_Sentry_Token,
		files        : getFiles()
	})
		.then((data) => console.log('----- SUCCESS ----\n', data))
		.catch((error) => console.log('---- ERROR ----\n', error));
}

deleteFiles(getFiles());
