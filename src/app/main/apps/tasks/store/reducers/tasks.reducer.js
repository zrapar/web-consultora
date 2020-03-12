import * as Actions from '../actions';

const initialState = {
	entities    : [],
	taskDialog  : {
		type  : 'new',
		props : {
			open : false
		},
		data  : null
	},
	users       : [],
	clients     : [],
	estudios    : [],
	showLoading : true,
	success     : {
		task     : false,
		users    : false,
		clients  : false,
		estudios : false
	}
};

const tasksReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_TASKS: {
			const entities = action.payload.map((event) => ({
				...event,
				start       : new Date(event.inicio),
				end         : event.fin ? new Date(event.fin) : new Date(event.estimada),
				title       : `Estudio de ${event.estudio.name} en ${event.cliente.empresa}`,
				description : `Estudio de ${event.estudio.name} en ${event.cliente.empresa} asignado a ${event
					.responsable.name}`
			}));

			return {
				...state,
				entities,
				success  : { ...state.success, task: true }
			};
		}
		case Actions.GET_USERS: {
			return {
				...state,
				users   : action.payload,
				success : { ...state.success, users: true }
			};
		}
		case Actions.GET_CLIENTS: {
			return {
				...state,
				clients : action.payload,
				success : { ...state.success, clients: true }
			};
		}
		case Actions.GET_ESTUDIOS: {
			return {
				...state,
				estudios : action.payload,
				success  : { ...state.success, estudios: true }
			};
		}
		case Actions.SHOW_LOADING: {
			return {
				...state,
				success : {
					...state.success,
					task : false
				}
			};
		}
		case Actions.OPEN_NEW_TASK_DIALOG: {
			return {
				...state,
				taskDialog : {
					type  : 'new',
					props : {
						open : true
					},
					data  : {
						...action.data
					}
				}
			};
		}
		case Actions.CLOSE_NEW_TASK_DIALOG: {
			return {
				...state,
				taskDialog : {
					type  : 'new',
					props : {
						open : false
					},
					data  : null
				}
			};
		}
		case Actions.OPEN_EDIT_TASK_DIALOG: {
			return {
				...state,
				taskDialog : {
					type  : 'edit',
					props : {
						open : true
					},
					data  : {
						...action.data,
						start : new Date(action.data.start),
						end   : new Date(action.data.end)
					}
				}
			};
		}
		case Actions.CLOSE_EDIT_TASK_DIALOG: {
			return {
				...state,
				taskDialog : {
					type  : 'edit',
					props : {
						open : false
					},
					data  : null
				}
			};
		}
		default: {
			return state;
		}
	}
};

export default tasksReducer;
