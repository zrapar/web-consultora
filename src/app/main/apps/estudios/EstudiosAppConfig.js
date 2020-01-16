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
			path      : '/apps/casestudy/:id',
			component : React.lazy(() => import('./EstudiosApp'))
		},
		{
			path      : '/apps/casestudy',
			component : () => <Redirect to='/apps/casestudy/all' />
		}
	]
};
