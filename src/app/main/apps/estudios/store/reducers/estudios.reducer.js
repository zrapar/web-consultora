import * as Actions from '../actions';
import _ from '@lodash';

const initialState = {
	entities           : null,
	searchText         : '',
	selectedEstudioIds : [],
	routeParams        : {},
	estudiosDialog     : {
		type  : 'new',
		props : {
			open : false
		},
		data  : null
	}
};

const estudiosReducer = function(state = initialState, action) {
	switch (action.type) {
		case Actions.GET_ESTUDIOS: {
			return {
				...state,
				entities    : _.keyBy(action.payload, 'id'),
				routeParams : action.routeParams
			};
		}
		case Actions.SET_SEARCH_TEXT: {
			return {
				...state,
				searchText : action.searchText
			};
		}
		case Actions.TOGGLE_IN_SELECTED_ESTUDIOS: {
			const estudioId = action.estudioId;

			let selectedEstudioIds = [ ...state.selectedEstudioIds ];

			if (selectedEstudioIds.find((id) => id === estudioId) !== undefined) {
				selectedEstudioIds = selectedEstudioIds.filter((id) => id !== estudioId);
			} else {
				selectedEstudioIds = [ ...selectedEstudioIds, estudioId ];
			}

			return {
				...state,
				selectedEstudioIds : selectedEstudioIds
			};
		}
		case Actions.SELECT_ALL_ESTUDIOS: {
			const arr = Object.keys(state.entities).map((k) => state.entities[k]);

			const selectedEstudioIds = arr.map((estudio) => estudio.id);

			return {
				...state,
				selectedEstudioIds : selectedEstudioIds
			};
		}
		case Actions.DESELECT_ALL_ESTUDIOS: {
			return {
				...state,
				selectedEstudioIds : []
			};
		}
		case Actions.OPEN_NEW_ESTUDIO_DIALOG: {
			return {
				...state,
				estudiosDialog : {
					type  : 'new',
					props : {
						open : true
					},
					data  : null
				}
			};
		}
		case Actions.CLOSE_NEW_ESTUDIO_DIALOG: {
			return {
				...state,
				estudiosDialog : {
					type  : 'new',
					props : {
						open : false
					},
					data  : null
				}
			};
		}
		case Actions.OPEN_EDIT_ESTUDIO_DIALOG: {
			return {
				...state,
				estudiosDialog : {
					type  : 'edit',
					props : {
						open : true
					},
					data  : action.data
				}
			};
		}
		case Actions.CLOSE_EDIT_ESTUDIO_DIALOG: {
			return {
				...state,
				estudiosDialog : {
					type  : 'edit',
					props : {
						open : false
					},
					data  : null
				}
			};
		}
		default: {
			return state;
		}
	}
};

export default estudiosReducer;
