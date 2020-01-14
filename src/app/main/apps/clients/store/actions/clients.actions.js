import axios from 'axios';

export const GET_CLIENTS = '@@Clients/Get Clients';
export const SET_SEARCH_TEXT = '@@Clients/Set Search Text';
export const TOGGLE_IN_SELECTED_CLIENTS = '@@Clients/Toggle in selected clients';
export const SELECT_ALL_CLIENTS = '@@Clients/Select all clients';
export const DESELECT_ALL_CLIENTS = '@@Clients/Deselect all clients';
export const OPEN_NEW_CLIENT_DIALOG = '@@Clients/Open new client dialog';
export const CLOSE_NEW_CLIENT_DIALOG = '@@Clients/Close new client dialog';
export const OPEN_EDIT_CLIENT_DIALOG = '@@Clients/Open edit client dialog';
export const CLOSE_EDIT_CLIENT_DIALOG = '@@Clients/Close edit client dialog';
export const ADD_CLIENT = '@@Clients/Add client';
export const UPDATE_CLIENT = '@@Clients/Update client';
export const REMOVE_CLIENT = '@@Clients/Remove client';
export const REMOVE_CLIENTS = '@@Clients/Remove client';

export const getClients = (routeParams) => async (dispatch) => {
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

export const toggleInSelectedClients = (clientId) => ({
	type     : TOGGLE_IN_SELECTED_CLIENTS,
	clientId
});

export const selectAllClients = () => ({
	type : SELECT_ALL_CLIENTS
});

export const deSelectAllClients = () => ({
	type : DESELECT_ALL_CLIENTS
});

export const openNewClientDialog = () => ({
	type : OPEN_NEW_CLIENT_DIALOG
});

export const closeNewClientDialog = () => ({
	type : CLOSE_NEW_CLIENT_DIALOG
});

export const openEditClientDialog = (data) => ({
	type : OPEN_EDIT_CLIENT_DIALOG,
	data
});

export const closeEditClientDialog = () => ({
	type : CLOSE_EDIT_CLIENT_DIALOG
});

export const addClient = (newClient) => async (dispatch) => {
	const response = await axios.post('/clientes/', newClient);

	if (response) {
		Promise.all([
			dispatch({
				type : ADD_CLIENT
			})
		]).then(() => dispatch(getClients()));
	}
};

export const updateClient = (client) => async (dispatch) => {
	const response = await axios.put(`/clientes/${client.id}/`, client);

	if (response) {
		Promise.all([
			dispatch({
				type : UPDATE_CLIENT
			})
		]).then(() => dispatch(getClients()));
	}
};

export const removeClient = (clientId) => async (dispatch) => {
	const response = await axios.delete(`/clientes/${clientId}/`);
	if (response) {
		Promise.all([
			dispatch({
				type : REMOVE_CLIENT
			})
		]).then(() => dispatch(getClients()));
	}
};

export const removeClients = (clientIds) => (dispatch) => {
	let arrayPromise = [];
	clientIds.forEach((element) => {
		const req = axios.delete(`/clientes/${element}/`);
		arrayPromise.push(req);
	});

	arrayPromise.push(
		dispatch({
			type : REMOVE_CLIENTS
		})
	);

	Promise.all(arrayPromise).then(() => dispatch(getClients()));
};
