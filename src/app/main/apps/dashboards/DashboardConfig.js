import React from 'react';

export const DashboardConfig = {
	settings : {
		layout : {
			config : {}
		}
	},
	routes   : [
		{
			path      : '/apps/dashboard',
			component : React.lazy(() => import('./Dashboard'))
		}
	]
};
