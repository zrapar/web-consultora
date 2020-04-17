import axios from 'axios';
// import { FuseUtils } from '@fuse';
import { showMessage } from 'app/store/actions/fuse';

export const GET_CLIENT = '@@Clients/ GET Client';
export const SAVE_CLIENT = '@@Clients/ Save Client';
export const GET_CLIENTS = '@@Clients/ GET CLIENTS';
export const SET_CLIENTS_SEARCH_TEXT = '@@Clients/ SET CLIENTS SEARCH TEXT';

export const getClients = () => async (dispatch) => {
	const response = await axios.get('/clientes/');
	const data = JSON.parse(response.data);

	return dispatch({
		type    : GET_CLIENTS,
		payload : data
	});
};

export const setClientsSearchText = (event) => ({
	type       : SET_CLIENTS_SEARCH_TEXT,
	searchText : event.target.value
});

export const getClient = (params) => async (dispatch) => {
	const response = await axios.get('/api/e-commerce-app/product', { params });
	return dispatch({
		type    : GET_CLIENT,
		payload : response.data
	});
};

export const saveClient = (data) => async (dispatch) => {
	const response = await axios.post('/api/e-commerce-app/product/save', data);

	dispatch(showMessage({ message: 'Client Saved' }));

	return dispatch({
		type    : SAVE_CLIENT,
		payload : response.data
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
				orderNum            : '',
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
				observaciones       : ''
			}
		}
	};

	return {
		type    : GET_CLIENT,
		payload : data
	};
};
