import * as Actions from '../actions';
import _ from '@lodash';

const initialState = {
	entities             : null,
	searchText           : '',
	selectedSignatoryIds : [],
	routeParams          : {},
	signatoriesDialog    : {
		type  : 'new',
		props : {
			open : false
		},
		data  : null
	},
	clients              : [],
	success              : {
		signatories : false,
		clients     : false
	}
};

const signatoriesReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_SIGNATORIES: {
			return {
				...state,
				entities    : _.keyBy(action.payload, 'id'),
				routeParams : action.routeParams,
				success     : {
					...state.success,
					signatories : true
				}
			};
		}
		case Actions.GET_CLIENTS: {
			return {
				...state,
				clients : action.payload,
				success : {
					...state.success,
					clients : true
				}
			};
		}
		case Actions.SHOW_LOADING: {
			return {
				...state,
				success : {
					signatories : false,
					clients     : false
				}
			};
		}
		case Actions.SET_SEARCH_TEXT: {
			return {
				...state,
				searchText : action.searchText
			};
		}
		case Actions.TOGGLE_IN_SELECTED_SIGNATORIES: {
			const signatoryId = action.signatoryId;

			let selectedSignatoryIds = [ ...state.selectedSignatoryIds ];

			if (selectedSignatoryIds.find((id) => id === signatoryId) !== undefined) {
				selectedSignatoryIds = selectedSignatoryIds.filter((id) => id !== signatoryId);
			} else {
				selectedSignatoryIds = [ ...selectedSignatoryIds, signatoryId ];
			}

			return {
				...state,
				selectedSignatoryIds : selectedSignatoryIds
			};
		}
		case Actions.SELECT_ALL_SIGNATORIES: {
			const arr = Object.keys(state.entities).map((k) => state.entities[k]);

			const selectedSignatoryIds = arr.map((signatory) => signatory.id);

			return {
				...state,
				selectedSignatoryIds : selectedSignatoryIds
			};
		}
		case Actions.DESELECT_ALL_SIGNATORIES: {
			return {
				...state,
				selectedSignatoryIds : []
			};
		}
		case Actions.OPEN_NEW_SIGNATORY_DIALOG: {
			return {
				...state,
				signatoriesDialog : {
					type  : 'new',
					props : {
						open : true
					},
					data  : null
				}
			};
		}
		case Actions.CLOSE_NEW_SIGNATORY_DIALOG: {
			return {
				...state,
				signatoriesDialog : {
					type  : 'new',
					props : {
						open : false
					},
					data  : null
				}
			};
		}
		case Actions.OPEN_EDIT_SIGNATORY_DIALOG: {
			return {
				...state,
				signatoriesDialog : {
					type  : 'edit',
					props : {
						open : true
					},
					data  : action.data
				}
			};
		}
		case Actions.CLOSE_EDIT_SIGNATORY_DIALOG: {
			return {
				...state,
				signatoriesDialog : {
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

export default signatoriesReducer;
