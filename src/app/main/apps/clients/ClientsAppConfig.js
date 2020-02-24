import React from 'react';
import { Redirect } from 'react-router-dom';

export const ClientsAppConfig = {
	settings : {
		layout : {
			config : {}
		}
	},
	routes   : [
		{
			path      : '/apps/clientes/:id',
			component : React.lazy(() => import('./ClientsApp'))
		},
		{
			path      : '/apps/clientes',
			component : () => <Redirect to='/apps/clientes/all' />
		}
	]
};
