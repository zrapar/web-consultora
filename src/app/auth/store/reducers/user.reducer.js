import * as Actions from '../actions';

const initialState = {
	role : [], //guest
	data : {
		displayName : 'John Doe',
		photoURL    : 'assets/images/avatars/Velazquez.jpg',
		email       : 'johndoe@withinpixels.com',
		shortcuts   : [ 'calendar', 'mail', 'contacts', 'todo' ]
	}
};

const user = function(state = initialState, action) {
	switch (action.type) {
		case Actions.SET_USER_DATA: {
			return {
				...initialState,
				role     : [ action.payload.role ],
				username : action.payload.username,
				data     : {
					...state.data,
					email       : action.payload.email,
					displayName :
						action.payload.first_name.length !== 0 && action.payload.last_name.length !== 0
							? `${action.payload.first_name} ${action.payload.last_name}`
							: state.data.displayName,
					shortcuts   : []
				}
			};
		}
		case Actions.REMOVE_USER_DATA: {
			return {
				...initialState
			};
		}
		case Actions.USER_LOGGED_OUT: {
			return initialState;
		}
		default: {
			return state;
		}
	}
};

export default user;
