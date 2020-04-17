// import { MaterialUIComponentsNavigation } from 'app/main/documentation/material-ui-components/MaterialUIComponentsNavigation';
import { authRoles } from 'app/auth';

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
				url   : '/apps/clients',
				auth  : authRoles.staff
			},
			{
				id    : 'firmantes',
				title : 'Firmantes',
				type  : 'item',
				icon  : 'account_box',
				url   : '/apps/firmantes',
				auth  : authRoles.staff
			},
			{
				id    : 'usuarios',
				title : 'Usuarios',
				type  : 'item',
				icon  : 'account_box',
				url   : '/apps/usuarios',
				auth  : authRoles.staff
			},
			{
				id    : 'estudios',
				title : 'Estudios',
				type  : 'item',
				icon  : 'account_box',
				url   : '/apps/estudios',
				auth  : authRoles.staff
			},
			{
				id    : 'tasks',
				title : 'Tareas',
				type  : 'item',
				icon  : 'today',
				url   : '/apps/tareas',
				auth  : authRoles.staff
			}
		]
	}
];

export default navigationConfig;
