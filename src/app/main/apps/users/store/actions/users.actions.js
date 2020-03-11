import axios from 'axios';
// users
export const GET_USERS = '@@Users/Get Users';
export const SHOW_LOADING = '@@Users/Show Loading';
export const SET_SEARCH_TEXT = '@@Users/Set Search Text';
export const TOGGLE_IN_SELECTED_USERS = '@@Users/Toggle in selected users';
export const SELECT_ALL_USERS = '@@Users/Select all users';
export const DESELECT_ALL_USERS = '@@Users/Deselect all users';
export const OPEN_NEW_USER_DIALOG = '@@Users/Open new user dialog';
export const CLOSE_NEW_USER_DIALOG = '@@Users/Close new user dialog';
export const OPEN_EDIT_USER_DIALOG = '@@Users/Open edit user dialog';
export const CLOSE_EDIT_USER_DIALOG = '@@Users/Close edit user dialog';
export const ADD_USER = '@@Users/Add user';
export const UPDATE_USER = '@@Users/Update user';
export const REMOVE_USER = '@@Users/Remove user';
export const REMOVE_USERS = '@@Users/Remove users';

export const getUsers = (routeParams) => async (dispatch) => {
	dispatch({ type: SHOW_LOADING });
	const response = await axios.get('/usuarios/', {
		params : routeParams
	});

	dispatch({
		type        : GET_USERS,
		payload     : response.data,
		routeParams
	});
};

export const setSearchText = (event) => ({
	type       : SET_SEARCH_TEXT,
	searchText : event.target.value
});

export const toggleInSelectedUsers = (clientId) => ({
	type     : TOGGLE_IN_SELECTED_USERS,
	clientId
});

export const selectAllUsers = () => ({
	type : SELECT_ALL_USERS
});

export const deSelectAllUsers = () => ({
	type : DESELECT_ALL_USERS
});

export const openNewUserDialog = () => ({
	type : OPEN_NEW_USER_DIALOG
});

export const closeNewUserDialog = () => ({
	type : CLOSE_NEW_USER_DIALOG
});

export const openEditUserDialog = (data) => ({
	type : OPEN_EDIT_USER_DIALOG,
	data
});

export const closeEditUserDialog = () => ({
	type : CLOSE_EDIT_USER_DIALOG
});

export const addUser = (newUser) => async (dispatch) => {
	const response = await axios.post('/usuarios/', newUser);

	if (response) {
		Promise.all([
			dispatch({
				type : ADD_USER
			})
		]).then(() => dispatch(getUsers()));
	}
};

export const updateUser = (user) => async (dispatch) => {
	const response = await axios.put(`/usuarios/${user.id}/`, user);

	if (response) {
		Promise.all([
			dispatch({
				type : UPDATE_USER
			})
		]).then(() => dispatch(getUsers()));
	}
};

export const removeUser = (userId) => async (dispatch) => {
	const response = await axios.delete(`/usuarios/${userId}/`);
	if (response) {
		Promise.all([
			dispatch({
				type : REMOVE_USER
			})
		]).then(() => dispatch(getUsers()));
	}
};

export const removeUsers = (usersIds) => (dispatch) => {
	let arrayPromise = [];
	usersIds.forEach((element) => {
		const req = axios.delete(`/usuarios/${element}/`);
		arrayPromise.push(req);
	});

	arrayPromise.push(
		dispatch({
			type : REMOVE_USERS
		})
	);

	Promise.all(arrayPromise).then(() => dispatch(getUsers()));
};
