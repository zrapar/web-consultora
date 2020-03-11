import React from 'react';

export const Error404PageConfig = {
	settings : {
		layout : {
			config : {}
		}
	},
	routes   : [
		{
			path      : '/error/not-found',
			component : React.lazy(() => import('./Error404Page'))
		}
	]
};
