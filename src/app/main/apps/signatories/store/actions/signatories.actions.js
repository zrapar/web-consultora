import axios from 'axios';
// signatories
export const GET_SIGNATORIES = '@@Signatories/Get Signatories';
export const GET_CLIENTS = '@@Signatories/Get Clients';
export const SHOW_LOADING = '@@Signatories/Show loading';
export const SET_SEARCH_TEXT = '@@Signatories/Set Search Text';
export const TOGGLE_IN_SELECTED_SIGNATORIES = '@@Signatories/Toggle in selected signatories';
export const SELECT_ALL_SIGNATORIES = '@@Signatories/Select all signatories';
export const DESELECT_ALL_SIGNATORIES = '@@Signatories/Deselect all signatories';
export const OPEN_NEW_SIGNATORY_DIALOG = '@@Signatories/Open new signatory dialog';
export const CLOSE_NEW_SIGNATORY_DIALOG = '@@Signatories/Close new signatory dialog';
export const OPEN_EDIT_SIGNATORY_DIALOG = '@@Signatories/Open edit signatory dialog';
export const CLOSE_EDIT_SIGNATORY_DIALOG = '@@Signatories/Close edit signatory dialog';
export const ADD_SIGNATORY = '@@Signatories/Add signatory';
export const UPDATE_SIGNATORY = '@@Signatories/Update signatory';
export const REMOVE_SIGNATORY = '@@Signatories/Remove signatory';
export const REMOVE_SIGNATORIES = '@@Signatories/Remove signatories';

export const getSignatories = (routeParams) => async (dispatch) => {
	dispatch({ type: SHOW_LOADING });
	const response = await axios.get('/firmantes/', {
		params : routeParams
	});

	dispatch({
		type        : GET_SIGNATORIES,
		payload     : response.data,
		routeParams
	});
};

export const getClientsInSignatory = (routeParams) => async (dispatch) => {
	const response = await axios.get('/clientes/', {
		params : routeParams
	});

	dispatch({
		type        : GET_CLIENTS,
		payload     : response.data,
		routeParams
	});
};

export const setSearchText = (event) => ({
	type       : SET_SEARCH_TEXT,
	searchText : event.target.value
});

export const toggleInSelectedSignatories = (clientId) => ({
	type     : TOGGLE_IN_SELECTED_SIGNATORIES,
	clientId
});

export const selectAllSignatories = () => ({
	type : SELECT_ALL_SIGNATORIES
});

export const deSelectAllSignatories = () => ({
	type : DESELECT_ALL_SIGNATORIES
});

export const openNewSignatoryDialog = () => ({
	type : OPEN_NEW_SIGNATORY_DIALOG
});

export const closeNewSignatoryDialog = () => ({
	type : CLOSE_NEW_SIGNATORY_DIALOG
});

export const openEditSignatoryDialog = (data) => ({
	type : OPEN_EDIT_SIGNATORY_DIALOG,
	data
});

export const closeEditSignatoryDialog = () => ({
	type : CLOSE_EDIT_SIGNATORY_DIALOG
});

export const addSignatory = (newSignatory) => async (dispatch) => {
	const response = await axios.post('/firmantes/', newSignatory);

	if (response) {
		Promise.all([
			dispatch({
				type : ADD_SIGNATORY
			})
		]).then(() => dispatch(getSignatories()));
	}
};

export const updateSignatory = (signatory) => async (dispatch) => {
	const response = await axios.put(`/firmantes/${signatory.id}/`, signatory);

	if (response) {
		Promise.all([
			dispatch({
				type : UPDATE_SIGNATORY
			})
		]).then(() => dispatch(getSignatories()));
	}
};

export const removeSignatory = (signatoryId) => async (dispatch) => {
	const response = await axios.delete(`/firmantes/${signatoryId}/`);
	if (response) {
		Promise.all([
			dispatch({
				type : REMOVE_SIGNATORY
			})
		]).then(() => dispatch(getSignatories()));
	}
};

export const removeSignatories = (signatoriesIds) => (dispatch) => {
	let arrayPromise = [];
	signatoriesIds.forEach((element) => {
		const req = axios.delete(`/firmantes/${element}/`);
		arrayPromise.push(req);
	});

	arrayPromise.push(
		dispatch({
			type : REMOVE_SIGNATORIES
		})
	);

	Promise.all(arrayPromise).then(() => dispatch(getSignatories()));
};
