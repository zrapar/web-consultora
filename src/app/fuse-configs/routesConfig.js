import React from 'react';
import { Redirect } from 'react-router-dom';
import { FuseUtils } from '@fuse/index';
import { appsConfigs } from 'app/main/apps/appsConfigs';
import { LoginConfig } from 'app/main/login/LoginConfig';
import { RegisterConfig } from 'app/main/register/RegisterConfig';
import { LogoutConfig } from 'app/main/logout/LogoutConfig';
import { Error404PageConfig } from 'app/main/errors/404/Error404PageConfig';
import { Error500PageConfig } from 'app/main/errors/500/Error500PageConfig';

const routeConfigs = [
	...appsConfigs,
	LogoutConfig,
	LoginConfig,
	RegisterConfig,
	Error404PageConfig,
	Error500PageConfig
];

const routes = [
	//if you want to make whole app auth protected by default change defaultAuth for example:
	// ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
	// The individual route configs which has auth option won't be overridden.
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, [ 'root', 'admin', 'employee', 'technician', 'customer' ]),
	{
		path      : '/',
		exact     : true,
		component : () => <Redirect to='/apps/dashboard' />
	},
	{
		component : () => <Redirect to='/error/not-found' />
	}
];

export default routes;
