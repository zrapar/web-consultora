import * as Actions from '../actions';

const initialState = {
	clients    : [],
	searchText : '',
	client     : null
};

const clientsReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_CLIENTS: {
			return {
				...state,
				clients : action.payload
			};
		}
		case Actions.SET_CLIENTS_SEARCH_TEXT: {
			return {
				...state,
				searchText : action.searchText
			};
		}
		case Actions.GET_CLIENT: {
			return {
				...state,
				client : action.payload
			};
		}
		case Actions.SAVE_CLIENT: {
			return {
				...state,
				client : action.payload
			};
		}
		default: {
			return state;
		}
	}
};

export default clientsReducer;
