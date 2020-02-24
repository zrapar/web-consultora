import * as Actions from '../actions';

const initialState = {
	entities   : [],
	taskDialog : {
		type  : 'new',
		props : {
			open : false
		},
		data  : null
	},
	users      : [],
	clients    : [],
	estudios   : []
};

const tasksReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_TASKS: {
			const entities = action.payload.map((event) => ({
				...event,
				start : new Date(event.inicio),
				end   : new Date(event.fin),
				title : event.estado
			}));

			return {
				...state,
				entities
			};
		}
		case Actions.GET_USERS: {
			return {
				...state,
				users : action.payload
			};
		}
		case Actions.GET_CLIENTS: {
			return {
				...state,
				clients : action.payload
			};
		}
		case Actions.GET_ESTUDIOS: {
			return {
				...state,
				estudios : action.payload
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
