import React from 'react';
import { Redirect } from 'react-router-dom';

export const SignatoriesAppConfig = {
	settings : {
		layout : {
			config : {}
		}
	},
	routes   : [
		{
			path      : '/apps/firmantes/:id',
			component : React.lazy(() => import('./SignatoriesApp'))
		},
		{
			path      : '/apps/firmantes',
			component : () => <Redirect to='/apps/firmantes/all' />
		}
	]
};
