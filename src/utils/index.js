export const layoutByRole = {
	staff : {
		layout           : {
			style  : 'layout2',
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
	},
	admin : {
		layout           : {
			style  : 'layout1',
			config : {}
		},
		customScrollbars : true,
		theme            : {
			main    : 'default',
			navbar  : 'mainThemeDark',
			toolbar : 'mainThemeLight',
			footer  : 'mainThemeDark'
		}
	}
};
