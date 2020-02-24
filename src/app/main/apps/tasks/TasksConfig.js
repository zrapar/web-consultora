import React from 'react';

export const TasksConfig = {
	settings : {
		layout : {
			config : {}
		}
	},
	routes   : [
		{
			path      : '/apps/tareas',
			component : React.lazy(() => import('./Tasks'))
		}
	]
};
