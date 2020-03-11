import axios from 'axios';
// estudios
export const GET_ESTUDIOS = '@@Estudios/Get Estudios';
export const SET_SEARCH_TEXT = '@@Estudios/Set Search Text';
export const SHOW_LOADING = '@@Estudios/Show Loading';
export const TOGGLE_IN_SELECTED_ESTUDIOS = '@@Estudios/Toggle in selected estudios';
export const SELECT_ALL_ESTUDIOS = '@@Estudios/Select all estudios';
export const DESELECT_ALL_ESTUDIOS = '@@Estudios/Deselect all estudios';
export const OPEN_NEW_ESTUDIO_DIALOG = '@@Estudios/Open new estudio dialog';
export const CLOSE_NEW_ESTUDIO_DIALOG = '@@Estudios/Close new estudio dialog';
export const OPEN_EDIT_ESTUDIO_DIALOG = '@@Estudios/Open edit estudio dialog';
export const CLOSE_EDIT_ESTUDIO_DIALOG = '@@Estudios/Close edit estudio dialog';
export const ADD_ESTUDIO = '@@Estudios/Add estudio';
export const UPDATE_ESTUDIO = '@@Estudios/Update estudio';
export const REMOVE_ESTUDIO = '@@Estudios/Remove estudio';
export const REMOVE_ESTUDIOS = '@@Estudios/Remove estudios';

export const getEstudios = (routeParams) => async (dispatch) => {
	dispatch({ type: SHOW_LOADING });
	const response = await axios.get('/estudios/', {
		params : routeParams
	});

	dispatch({
		type        : GET_ESTUDIOS,
		payload     : response.data,
		routeParams
	});
};

export const setSearchText = (event) => ({
	type       : SET_SEARCH_TEXT,
	searchText : event.target.value
});

export const toggleInSelectedEstudios = (clientId) => ({
	type     : TOGGLE_IN_SELECTED_ESTUDIOS,
	clientId
});

export const selectAllEstudios = () => ({
	type : SELECT_ALL_ESTUDIOS
});

export const deSelectAllEstudios = () => ({
	type : DESELECT_ALL_ESTUDIOS
});

export const openNewEstudioDialog = () => ({
	type : OPEN_NEW_ESTUDIO_DIALOG
});

export const closeNewEstudioDialog = () => ({
	type : CLOSE_NEW_ESTUDIO_DIALOG
});

export const openEditEstudioDialog = (data) => ({
	type : OPEN_EDIT_ESTUDIO_DIALOG,
	data
});

export const closeEditEstudioDialog = () => ({
	type : CLOSE_EDIT_ESTUDIO_DIALOG
});

export const addEstudio = (newEstudio) => async (dispatch) => {
	const response = await axios.post('/estudios/', newEstudio);

	if (response) {
		Promise.all([
			dispatch({
				type : ADD_ESTUDIO
			})
		]).then(() => dispatch(getEstudios()));
	}
};

export const updateEstudio = (estudio) => async (dispatch) => {
	const response = await axios.put(`/estudios/${estudio.id}/`, estudio);

	if (response) {
		Promise.all([
			dispatch({
				type : UPDATE_ESTUDIO
			})
		]).then(() => dispatch(getEstudios()));
	}
};

export const removeEstudio = (estudioId) => async (dispatch) => {
	const response = await axios.delete(`/estudios/${estudioId}/`);
	if (response) {
		Promise.all([
			dispatch({
				type : REMOVE_ESTUDIO
			})
		]).then(() => dispatch(getEstudios()));
	}
};

export const removeEstudios = (estudiosIds) => (dispatch) => {
	let arrayPromise = [];
	estudiosIds.forEach((element) => {
		const req = axios.delete(`/estudios/${element}/`);
		arrayPromise.push(req);
	});

	arrayPromise.push(
		dispatch({
			type : REMOVE_ESTUDIOS
		})
	);

	Promise.all(arrayPromise).then(() => dispatch(getEstudios()));
};
