export const layoutByRole = {
	root       : {
		layout           : {
			style  : 'layout1',
			config : {
				mode    : 'fullwidth',
				scroll  : 'content',
				navbar  : {
					display : true,
					folded  : true
				},
				toolbar : {
					display : false
				}
			}
		},
		customScrollbars : true,
		theme            : {
			main    : 'default',
			navbar  : 'mainThemeDark',
			toolbar : 'mainThemeLight',
			footer  : 'mainThemeDark'
		}
	},
	admin      : {
		layout           : {
			style  : 'layout1',
			config : {
				mode    : 'fullwidth',
				scroll  : 'content',
				navbar  : {
					display : true,
					folded  : true
				},
				toolbar : {
					display : false
				}
			}
		},
		customScrollbars : true,
		theme            : {
			main    : 'default',
			navbar  : 'mainThemeDark',
			toolbar : 'mainThemeLight',
			footer  : 'mainThemeDark'
		}
	},
	technician : {
		layout           : {
			style  : 'layout3',
			config : {
				mode    : 'fullwidth',
				scroll  : 'body',
				navbar  : {
					display : true
				},
				toolbar : {
					display  : true,
					position : 'below'
				}
			}
		},
		customScrollbars : true,
		theme            : {
			main    : 'greeny',
			navbar  : 'mainThemeDark',
			toolbar : 'mainThemeDark',
			footer  : 'mainThemeDark'
		}
	},
	employee   : {
		layout           : {
			style  : 'layout2',
			config : {
				mode    : 'fullwidth',
				scroll  : 'content',
				toolbar : {
					display  : true,
					position : 'below'
				}
			}
		},
		customScrollbars : true,
		theme            : {
			main    : 'greeny',
			navbar  : 'mainThemeDark',
			toolbar : 'mainThemeDark',
			footer  : 'mainThemeDark'
		}
	},
	customer   : {
		layout           : {
			style  : 'layout3',
			config : {
				mode    : 'boxed',
				scroll  : 'content',
				navbar  : {
					display : true
				},
				toolbar : {
					display  : true,
					position : 'below'
				}
			}
		},
		customScrollbars : true,
		theme            : {
			main    : 'greeny',
			navbar  : 'mainThemeDark',
			toolbar : 'mainThemeDark',
			footer  : 'mainThemeDark'
		}
	}
};

export const getRoleNameByUserType = (userType) => {
	switch (userType) {
		case 0:
			return 'root';
		case 1:
			return 'admin';
		case 2:
			return 'technician';
		case 3:
			return 'customer';
		case 4:
		default:
			return 'employee';
	}
};

export const rolesTranslate = (userType) => {
	const roles = [
		{ value: 0, label: 'Administrador' },
		{ value: 1, label: 'Administrador' },
		{ value: 2, label: 'Tecnico' },
		{ value: 3, label: 'Cliente' },
		{ value: 4, label: 'Empleado' }
	];

	return roles.filter((i) => i.value === userType)[0].label;
};
