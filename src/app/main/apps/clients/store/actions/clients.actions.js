import axios from 'axios';
// import { FuseUtils } from '@fuse';
import { showMessage } from 'app/store/actions/fuse';

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
	const response = await axios.post('/clients/', data);

	dispatch(showMessage({ message: 'Client Saved' }));

	Promise.all([
		dispatch({
			type    : SAVE_CLIENT,
			payload : response.data
		})
	]).then(() => {
		dispatch(getClients());
		history.push('/apps/clients');
	});
};

export const newClient = () => {
	const data = {
		formalData : {
			clientId            : '',
			clientName          : '',
			cuit                : '',
			address             : {
				partido       : '',
				localidad     : '',
				calleRuta     : '',
				nKm           : '',
				piso          : '',
				depto         : '',
				codigo_postal : '',
				type          : {
					label : 'Seleccione el tipo de domicilio',
					value : null
				}
			},
			legalRepresentative : {
				name            : '',
				dni             : '',
				position        : '',
				cuil            : '',
				estatuto        : [],
				actaDesignacion : [],
				poderes         : [],
				extraPdfs       : []
			}
		},
		planta     : {
			id_establecimiento : '',
			address            : {
				partido       : '',
				localidad     : '',
				calleRuta     : '',
				nKm           : '',
				piso          : '',
				depto         : '',
				codigo_postal : ''
			},
			email              : '',
			phoneContacts      : '',
			innerContact       : {
				name     : '',
				lastName : '',
				phone    : '',
				email    : '',
				position : '',
				workArea : ''
			},
			govermentUsers     : {
				opds   : {
					user : '',
					pass : ''
				},
				ada    : {
					user : '',
					pass : ''
				},
				ina    : {
					user : '',
					pass : ''
				},
				acumar : {
					user : '',
					pass : ''
				}
			},
			mobiliary          : {
				partidaInmobiliaria : '',
				matricula           : '',
				circunscripcion     : '',
				seccion             : '',
				fraccion            : '',
				manzana             : '',
				parcela             : '',
				poligono            : '',
				propietario         : '',
				caracterUso         : '',
				documentacion       : '',
				observaciones       : '',
				plancheta           : ''
			}
		}
	};

	return {
		type    : GET_CLIENT,
		payload : data
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
