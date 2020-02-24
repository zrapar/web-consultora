import React from 'react';
import { Redirect } from 'react-router-dom';

export const UsersAppConfig = {
	settings : {
		layout : {
			config : {}
		}
	},
	routes   : [
		{
			path      : '/apps/usuarios/:id',
			component : React.lazy(() => import('./UsersApp'))
		},
		{
			path      : '/apps/usuarios',
			component : () => <Redirect to='/apps/usuarios/all' />
		}
	]
};
