import axios from 'axios';
// import { FuseUtils } from '@fuse';
import { showMessage } from 'app/store/actions/fuse';
import _ from 'lodash';
import { dataClientShow } from 'utils';

export const GET_CLIENT = '@@Clients/ GET Client';
export const SAVE_CLIENT = '@@Clients/ Save Client';
export const GET_CLIENTS = '@@Clients/ GET CLIENTS';
export const SET_CLIENTS_SEARCH_TEXT = '@@Clients/ SET CLIENTS SEARCH TEXT';
export const REMOVE_CLIENTS = '@@Clients/ Delete client(s)';

export const getClients = () => async (dispatch) => {
	const response = await axios.get('/clients/');

	const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

	const parsedData = data.map((o) => {
		const { id, clientId, clientName, cuit, address, legalRepresentative, planta } = o;
		return {
			id,
			formalData : {
				clientId,
				clientName,
				cuit,
				address,
				legalRepresentative
			},
			planta
		};
	});

	return dispatch({
		type    : GET_CLIENTS,
		payload : parsedData
	});
};

export const setClientsSearchText = (event) => ({
	type       : SET_CLIENTS_SEARCH_TEXT,
	searchText : event.target.value
});

export const getClient = (client) => async (dispatch) => {
	console.log(client);
	const response = await axios.get(`/clients/${client}`);
	const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
	const { id, clientId, clientName, cuit, address, legalRepresentative, planta } = data;

	return dispatch({
		type    : GET_CLIENT,
		payload : {
			id,
			formalData : {
				clientId,
				clientName,
				cuit,
				address,
				legalRepresentative
			},
			planta
		}
	});
};

export const saveClient = (data, history) => async (dispatch) => {
	try {
		const response = await axios.post('/clients/', data);
		if (response.data) {
			dispatch(showMessage({ message: 'Cliente creado correctamente' }));
		}

		Promise.all([
			dispatch({
				type    : SAVE_CLIENT,
				payload : dataClientShow
			})
		]).then(() => {
			dispatch(getClients());
			history.push('/apps/clients');
		});
	} catch (err) {
		const errors = _.flatten(
			Object.values(err.response.data).map((i) => {
				return i;
			})
		);

		errors.forEach((i) => {
			dispatch(
				showMessage({
					message : i === 'Introduzca un número entero válido.' ? 'El DNI introducido no es correcto' : i
				})
			);
		});
	}
};

export const newClient = () => {
	return {
		type    : GET_CLIENT,
		payload : dataClientShow
	};
};

export const removeClients = (clientsIds) => (dispatch) => {
	let arrayPromise = [];
	clientsIds.forEach((element) => {
		const req = axios.delete(`/clients/${element}/`);
		arrayPromise.push(req);
	});

	arrayPromise.push(
		dispatch({
			type : REMOVE_CLIENTS
		})
	);

	Promise.all(arrayPromise).then(() => dispatch(getClients()));
};
