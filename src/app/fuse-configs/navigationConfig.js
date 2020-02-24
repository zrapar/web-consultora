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
				id    : 'clientes',
				title : 'Clientes',
				type  : 'item',
				icon  : 'account_box',
				url   : '/apps/clientes'
			},
			{
				id    : 'firmantes',
				title : 'Firmantes',
				type  : 'item',
				icon  : 'account_box',
				url   : '/apps/firmantes'
			},
			{
				id    : 'usuarios',
				title : 'Usuarios',
				type  : 'item',
				icon  : 'account_box',
				url   : '/apps/usuarios'
			},
			{
				id    : 'estudios',
				title : 'Estudios',
				type  : 'item',
				icon  : 'account_box',
				url   : '/apps/estudios'
			},
			{
				id    : 'tasks',
				title : 'Tareas',
				type  : 'item',
				icon  : 'today',
				url   : '/apps/tareas'
			}
		]
	}
];

export default navigationConfig;
