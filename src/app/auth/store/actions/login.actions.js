import jwtService from 'app/services/jwtService';
import { setUserData } from './user.actions';

export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export const submitLogin = ({ username, password }) => async (dispatch) => {
	const data = await jwtService.signInWithEmailAndPassword(username, password);
	if (data.success) {
		dispatch(setUserData(data.username));

		return dispatch({
			type : LOGIN_SUCCESS
		});
	}
	return dispatch({
		type    : LOGIN_ERROR,
		payload : data.message
	});
};
