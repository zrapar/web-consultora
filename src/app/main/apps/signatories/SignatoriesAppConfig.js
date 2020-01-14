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
      path: '/apps/signatories/:id',
			component : React.lazy(() => import('./SignatoriesApp'))
		},
		{
      path: '/apps/signatories',
      component: () => <Redirect to='/apps/signatories/all' />
		}
	]
};
