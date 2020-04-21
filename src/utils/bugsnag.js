import React from 'react';
import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';

let bugsnagClient = bugsnag({ apiKey: process.env.REACT_APP_Bugsnag_Key, releaseStage: process.env.REACT_APP_Staging });
bugsnagClient.use(bugsnagReact, React);

export const bugsnagReporter = bugsnagClient;

export const ErrorBoundary = bugsnagClient.getPlugin('react');
