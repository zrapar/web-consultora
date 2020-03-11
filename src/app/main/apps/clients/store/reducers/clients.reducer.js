import * as Actions from '../actions';
import _ from '@lodash';

const initialState = {
	entities          : null,
	searchText        : '',
	selectedClientIds : [],
	routeParams       : {},
	clientsDialog     : {
		type  : 'new',
		props : {
			open : false
		},
		data  : null
	},
	success           : false
};

const clientsReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_CLIENTS: {
			return {
				...state,
				entities    : _.keyBy(action.payload, 'id'),
				routeParams : action.routeParams,
				success     : true
			};
		}
		case Actions.SHOW_LOADING: {
			return {
				...state,
				success : false
			};
		}
		case Actions.SET_SEARCH_TEXT: {
			return {
				...state,
				searchText : action.searchText
			};
		}
		case Actions.TOGGLE_IN_SELECTED_CLIENTS: {
			const clientId = action.clientId;

			let selectedClientIds = [ ...state.selectedClientIds ];

			if (selectedClientIds.find((id) => id === clientId) !== undefined) {
				selectedClientIds = selectedClientIds.filter((id) => id !== clientId);
			} else {
				selectedClientIds = [ ...selectedClientIds, clientId ];
			}

			return {
				...state,
				selectedClientIds : selectedClientIds
			};
		}
		case Actions.SELECT_ALL_CLIENTS: {
			const arr = Object.keys(state.entities).map((k) => state.entities[k]);

			const selectedClientIds = arr.map((client) => client.id);

			return {
				...state,
				selectedClientIds : selectedClientIds
			};
		}
		case Actions.DESELECT_ALL_CLIENTS: {
			return {
				...state,
				selectedClientIds : []
			};
		}
		case Actions.OPEN_NEW_CLIENT_DIALOG: {
			return {
				...state,
				clientsDialog : {
					type  : 'new',
					props : {
						open : true
					},
					data  : null
				}
			};
		}
		case Actions.CLOSE_NEW_CLIENT_DIALOG: {
			return {
				...state,
				clientsDialog : {
					type  : 'new',
					props : {
						open : false
					},
					data  : null
				}
			};
		}
		case Actions.OPEN_EDIT_CLIENT_DIALOG: {
			return {
				...state,
				clientsDialog : {
					type  : 'edit',
					props : {
						open : true
					},
					data  : action.data
				}
			};
		}
		case Actions.CLOSE_EDIT_CLIENT_DIALOG: {
			return {
				...state,
				clientsDialog : {
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

export default clientsReducer;
