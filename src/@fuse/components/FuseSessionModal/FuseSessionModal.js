import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from 'app/store/actions';
import * as userActions from 'app/auth/store/actions';
import { Dialog, DialogContent, DialogTitle, DialogContentText, DialogActions, Button } from '@material-ui/core';
import jwtService from 'app/services/jwtService';

const FuseSessionModal = (props) => {
	const dispatch = useDispatch();
	const state = useSelector(({ fuse }) => fuse.session.state);
	const closeModal = () => {
		dispatch(Actions.closeSessionDialog());
	};

	const choiceUser = (data) => {
		if (data) {
			jwtService.updateToken();
			dispatch(Actions.closeSessionDialog());
		} else {
			dispatch(userActions.logoutUser());
			dispatch(Actions.closeSessionDialog());
		}
	};
	return (
		<Dialog
			open={state}
			onClose={() => closeModal()}
			aria-labelledby='session-modal'
			disableBackdropClick
			disableEscapeKeyDown
			classes={{
				paper : 'm-24'
			}}
		>
			<DialogTitle id='alert-dialog-title'>¿Se sesion esta por finalizar?</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					Seleccione una de las siguientes opciones
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => choiceUser(false)} color='primary'>
					Cerrar sesión
				</Button>
				<Button onClick={() => choiceUser(true)} color='primary' autoFocus>
					Continuar
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default React.memo(FuseSessionModal);
