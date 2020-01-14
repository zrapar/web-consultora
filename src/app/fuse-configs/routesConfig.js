import React from 'react';
import { Redirect } from 'react-router-dom';
import { FuseUtils } from '@fuse/index';
import { appsConfigs } from 'app/main/apps/appsConfigs';
import { LoginConfig } from 'app/main/login/LoginConfig';
import { RegisterConfig } from 'app/main/register/RegisterConfig';
import { LogoutConfig } from 'app/main/logout/LogoutConfig';

const routeConfigs = [ ...appsConfigs, LogoutConfig, LoginConfig, RegisterConfig, LogoutConfig ];

const routes = [
	//if you want to make whole app auth protected by default change defaultAuth for example:
	// ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
	// The individual route configs which has auth option won't be overridden.
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, [ 'admin', 'staff', 'user' ]),
	{
		path      : '/',
		exact     : true,
		component : () => <Redirect to='/apps/dashboard' />
	},
	{
		component : () => <Redirect to='/pages/errors/error-404' />
	}
];

export default routes;
