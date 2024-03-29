import * as Actions from '../actions';
import _ from '@lodash';

const initialState = {
	entities        : null,
	searchText      : '',
	selectedUserIds : [],
	routeParams     : {},
	usersDialog     : {
		type  : 'new',
		props : {
			open : false
		},
		data  : null
	},
	success         : false
};

const usersReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_USERS: {
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
		case Actions.TOGGLE_IN_SELECTED_USERS: {
			const userId = action.userId;

			let selectedUserIds = [ ...state.selectedUserIds ];

			if (selectedUserIds.find((id) => id === userId) !== undefined) {
				selectedUserIds = selectedUserIds.filter((id) => id !== userId);
			} else {
				selectedUserIds = [ ...selectedUserIds, userId ];
			}

			return {
				...state,
				selectedUserIds : selectedUserIds
			};
		}
		case Actions.SELECT_ALL_USERS: {
			const arr = Object.keys(state.entities).map((k) => state.entities[k]);

			const selectedUserIds = arr.map((user) => user.id);

			return {
				...state,
				selectedUserIds : selectedUserIds
			};
		}
		case Actions.DESELECT_ALL_USERS: {
			return {
				...state,
				selectedUserIds : []
			};
		}
		case Actions.OPEN_NEW_USER_DIALOG: {
			return {
				...state,
				usersDialog : {
					type  : 'new',
					props : {
						open : true
					},
					data  : null
				}
			};
		}
		case Actions.CLOSE_NEW_USER_DIALOG: {
			return {
				...state,
				usersDialog : {
					type  : 'new',
					props : {
						open : false
					},
					data  : null
				}
			};
		}
		case Actions.OPEN_EDIT_USER_DIALOG: {
			return {
				...state,
				usersDialog : {
					type  : 'edit',
					props : {
						open : true
					},
					data  : action.data
				}
			};
		}
		case Actions.CLOSE_EDIT_USER_DIALOG: {
			return {
				...state,
				usersDialog : {
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

export default usersReducer;
