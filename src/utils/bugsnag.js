import React from 'react';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
const appVersion = require('../../package.json').version;

Bugsnag.start({
	apiKey       : process.env.REACT_APP_Bugsnag_Key,
	plugins      : [ new BugsnagPluginReact(React) ],
	appType      : 'client',
	releaseStage : process.env.NODE_ENV,
	appVersion
});

export const BugsnagReporter = Bugsnag;

export const ErrorBoundary = BugsnagReporter.getPlugin('react');
