// By default, this project supports all modern browsers.
// Support for Internet Explorer 11 requires polyfills.
// For to support Internet Explorer 11, install react-app-polyfill,
// https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'typeface-muli';
import './react-table-defaults';
import './react-chartjs-2-defaults';
import './styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import * as Sentry from '@sentry/browser';
import App from 'app/App';
const { version } = require('../package.json');

Sentry.init({ dsn: process.env.REACT_APP_Sentry_DSN, release: `consultora-parodi@${version}` });

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
