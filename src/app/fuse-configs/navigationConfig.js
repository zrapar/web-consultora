// import { MaterialUIComponentsNavigation } from 'app/main/documentation/material-ui-components/MaterialUIComponentsNavigation';
// import { authRoles } from 'app/auth';

const navigationConfig = [
	{
		id       : 'applications',
		title    : 'Menu',
		type     : 'group',
		icon     : 'apps',
		children : [
			{
				id    : 'dashboard',
				title : 'Inicio',
				type  : 'item',
				icon  : 'dashboard',
				url   : '/apps/dashboard'
			},
			{
				id    : 'clients',
				title : 'Clientes',
				type  : 'item',
				icon  : 'dashboard',
				url   : '/apps/clients'
			}
		]
	}
];

export default navigationConfig;
