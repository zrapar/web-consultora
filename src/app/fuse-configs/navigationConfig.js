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
				auth  : authRoles.root
			},
			{
				id    : 'usuarios',
				title : 'Usuarios',
				type  : 'item',
				icon  : 'account_box',
				url   : '/apps/users',
				auth  : authRoles.admin
			},
			{
				id    : 'logout',
				title : 'Cerrar Sesion',
				type  : 'item',
				auth  : authRoles.customer,
				url   : '/logout',
				icon  : 'exit_to_app'
			}
			// {
			// 	id    : 'firmantes',
			// 	title : 'Firmantes',
			// 	type  : 'item',
			// 	icon  : 'account_box',
			// 	url   : '/apps/firmantes',
			// 	auth  : authRoles.admin
			// },

			// {
			// 	id    : 'estudios',
			// 	title : 'Estudios',
			// 	type  : 'item',
			// 	icon  : 'account_box',
			// 	url   : '/apps/estudios',
			// 	auth  : authRoles.admin
			// },
			// {
			// 	id    : 'tasks',
			// 	title : 'Tareas',
			// 	type  : 'item',
			// 	icon  : 'today',
			// 	url   : '/apps/tareas',
			// 	auth  : authRoles.admin
			// }
		]
	}
];

export default navigationConfig;
