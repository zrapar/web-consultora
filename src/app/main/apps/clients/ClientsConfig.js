import React from 'react';
// import { Redirect } from 'react-router-dom';

export const ClientsConfig = {
	settings : {
		layout : {}
	},
	routes   : [
		{
			path      : '/apps/clients/:clientId',
			component : React.lazy(() => import('./Client'))
		},
		{
			path      : '/apps/clients',
			component : React.lazy(() => import('./Clients'))
		}
	]
};
