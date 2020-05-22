import * as Actions from 'app/store/actions/fuse';

const initialState = {
	state : false
};

const session = function(state = initialState, action) {
	switch (action.type) {
		case Actions.OPEN_SESSION_DIALOG: {
			return {
				...state,
				state : true
			};
		}
		case Actions.CLOSE_SESSION_DIALOG: {
			return {
				...state,
				state : false
			};
		}
		default: {
			return state;
		}
	}
};

export default session;
