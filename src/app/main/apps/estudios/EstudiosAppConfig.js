import React from 'react';
import { Redirect } from 'react-router-dom';

export const EstudiosAppConfig = {
	settings : {
		layout : {
			config : {}
		}
	},
	routes   : [
		{
			path      : '/apps/estudios/:id',
			component : React.lazy(() => import('./EstudiosApp'))
		},
		{
			path      : '/apps/estudios',
			component : () => <Redirect to='/apps/estudios/all' />
		}
	]
};
