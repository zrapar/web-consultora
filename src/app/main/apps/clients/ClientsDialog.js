import React, { useEffect, useCallback, useState } from 'react';
import {
	TextField,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	Icon,
	IconButton,
	Typography,
	Toolbar,
	AppBar,
	InputAdornment
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useForm } from '@fuse/hooks';
import * as Actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';

const defaultFormState = {
	empresa      : '',
	direccion    : '',
	cuit         : '',
	id_estab     : '',
	zip_code     : '',
	phone        : '',
	email        : '',
	user_opds    : '',
	user_acumar  : '',
	user_ina     : '',
	user         : '',
	clave_opds   : '',
	clave_acumar : '',
	clave_ina    : '',
	clave        : '',
  firmantes    : 'asdkfjhakdf'
};

function ClientsDialog(props) {
	const dispatch = useDispatch();
	const clientsDialog = useSelector(({ clients: { clients } }) => clients.clientsDialog);

	const { form, handleChange, setForm } = useForm(defaultFormState);

	const [ state, setState ] = useState({
		showOpds   : false,
		showAcumar : false,
		showIna    : false,
		showParodi : false
	});

	const { showOpds, showAcumar, showIna, showParodi } = state;

	const initDialog = useCallback(
		() => {
			/**
             * Dialog type: 'edit'
             */
			if (clientsDialog.type === 'edit' && clientsDialog.data) {
				setForm({ ...clientsDialog.data });
			}

			/**
             * Dialog type: 'new'
             */
			if (clientsDialog.type === 'new') {
				setForm({
					...defaultFormState,
					...clientsDialog.data
				});
			}
		},
		[ clientsDialog.data, clientsDialog.type, setForm ]
	);

	useEffect(
		() => {
			/**
         * After Dialog Open
         */
			if (clientsDialog.props.open) {
				initDialog();
			}
		},
		[ clientsDialog.props.open, initDialog ]
	);

	function closeComposeDialog() {
		clientsDialog.type === 'edit'
			? dispatch(Actions.closeEditClientDialog())
			: dispatch(Actions.closeNewClientDialog());
	}

	function canBeSubmitted() {
		return form.empresa.length > 0;
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (clientsDialog.type === 'new') {
			dispatch(Actions.addClient(form));
		} else {
			dispatch(Actions.updateClient(form));
		}
		closeComposeDialog();
	}

	function handleRemove() {
		dispatch(Actions.removeClient(form.id));
		closeComposeDialog();
	}

	const handleClickShowPassword = (name) => {
		setState({ ...state, [name]: !state[name] });
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	return (
		<Dialog
			classes={{
				paper : 'm-24'
			}}
			{...clientsDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth='md'
		>
			<AppBar position='static' elevation={1}>
				<Toolbar className='flex w-full'>
					<Typography variant='subtitle1' color='inherit'>
						{clientsDialog.type === 'new' ? 'Nuevo Cliente' : 'Editar Cliente'}
					</Typography>
				</Toolbar>
				<div className='flex flex-col items-center justify-center pb-24'>
					{clientsDialog.type === 'edit' && (
						<Typography variant='h6' color='inherit' className='pt-8'>
							{form.name}
						</Typography>
					)}
				</div>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className='flex flex-col overflow-hidden'>
				<DialogContent classes={{ root: 'p-24' }}>
					<div className='flex'>
						<div className='min-w-48 pt-20'>
							<Icon color='action'>domain</Icon>
						</div>

						<TextField
							className='mb-24'
							label='Empresa'
							autoFocus
							id='empresa'
							name='empresa'
							value={form.empresa}
							onChange={handleChange}
							variant='outlined'
							required
							fullWidth
						/>
					</div>

					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='Direccion'
							id='direccion'
							name='direccion'
							value={form.direccion}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>

					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='CUIT'
							id='cuit'
							name='cuit'
							value={form.cuit}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>

					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='id_estab ??'
							id='id_estab'
							name='id_estab'
							value={form.id_estab}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>

					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='Codigo Zip'
							id='zip_code'
							name='zip_code'
							value={form.zip_code}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>

					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='Telefono'
							id='phone'
							name='phone'
							value={form.phone}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>

					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='Correo Electronico'
							id='email'
							name='email'
							value={form.email}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>

					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='Usuario OPDS'
							id='user_opds'
							name='user_opds'
							value={form.user_opds}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>

					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='Usuario ACUMAR'
							id='user_acumar'
							name='user_acumar'
							value={form.user_acumar}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>

					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='USUARIO INA'
							id='user_ina'
							name='user_ina'
							value={form.user_ina}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>

					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='Usuario Consultora Parodi'
							id='user'
							name='user'
							value={form.user}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>

					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='Clave OPDS'
							id='clave_opds'
							name='clave_opds'
							value={form.clave_opds}
							onChange={handleChange}
							variant='outlined'
							fullWidth
							type={showOpds ? 'text' : 'password'}
							InputProps={{
								endAdornment : (
									<InputAdornment position='end'>
										<IconButton
											aria-label='toggle password visibility'
											onClick={() => handleClickShowPassword('showOpds')}
											onMouseDown={handleMouseDownPassword}
										>
											{showOpds ? <Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								)
							}}
						/>
					</div>

					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='Clave ACUMAR'
							id='clave_acumar'
							name='clave_acumar'
							value={form.clave_acumar}
							onChange={handleChange}
							variant='outlined'
							fullWidth
							type={showAcumar ? 'text' : 'password'}
							InputProps={{
								endAdornment : (
									<InputAdornment position='end'>
										<IconButton
											aria-label='toggle password visibility'
											onClick={() => handleClickShowPassword('showAcumar')}
											onMouseDown={handleMouseDownPassword}
										>
											{showAcumar ? <Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								)
							}}
						/>
					</div>

					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='Clave INA'
							id='clave_ina'
							name='clave_ina'
							value={form.clave_ina}
							onChange={handleChange}
							variant='outlined'
							fullWidth
							type={showIna ? 'text' : 'password'}
							InputProps={{
								endAdornment : (
									<InputAdornment position='end'>
										<IconButton
											aria-label='toggle password visibility'
											onClick={() => handleClickShowPassword('showIna')}
											onMouseDown={handleMouseDownPassword}
										>
											{showIna ? <Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								)
							}}
						/>
					</div>

					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='Clave Consultora Parodi'
							id='clave'
							name='clave'
							value={form.clave}
							onChange={handleChange}
							variant='outlined'
							fullWidth
							type={showParodi ? 'text' : 'password'}
							InputProps={{
								endAdornment : (
									<InputAdornment position='end'>
										<IconButton
											aria-label='toggle password visibility'
											onClick={() => handleClickShowPassword('showParodi')}
											onMouseDown={handleMouseDownPassword}
										>
											{showParodi ? <Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								)
							}}
						/>
					</div>
				</DialogContent>

				{clientsDialog.type === 'new' ? (
					<DialogActions className='justify-between pl-16'>
						<Button
							variant='contained'
							color='primary'
							onClick={handleSubmit}
							type='submit'
							disabled={!canBeSubmitted()}
						>
							Agregar
						</Button>
					</DialogActions>
				) : (
					<DialogActions className='justify-between pl-16'>
						<Button
							variant='contained'
							color='primary'
							type='submit'
							onClick={handleSubmit}
							disabled={!canBeSubmitted()}
						>
							Guardar Cambios
						</Button>
						<IconButton onClick={handleRemove}>
							<Icon>delete</Icon>
						</IconButton>
					</DialogActions>
				)}
			</form>
		</Dialog>
	);
}

export default ClientsDialog;
