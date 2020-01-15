import React, { useEffect, useCallback } from 'react';
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
	AppBar
} from '@material-ui/core';
import { useForm } from '@fuse/hooks';
import * as Actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';

let defaultFormState = {
	name         : '',
	incunvencias : '',
	titulo1      : '',
	titulo2      : '',
	matricula1   : '',
	matricula2   : '',
	matricula3   : '',
	matricula4   : '',
	matricula5   : '',
	dni          : '',
	telefono     : '',
	direccion    : ''
};

const UsersDialog = (props) => {
	const dispatch = useDispatch();
	const usersDialog = useSelector(({ users: { users } }) => users.usersDialog);

	const { form, handleChange, setForm } = useForm(defaultFormState);

	const initDialog = useCallback(
		() => {
			if (usersDialog.type === 'edit' && usersDialog.data) {
				setForm({ ...usersDialog.data });
			}

			if (usersDialog.type === 'new') {
				setForm({
					...defaultFormState,
					...usersDialog.data
				});
			}
		},
		[ usersDialog.data, usersDialog.type, setForm ]
	);

	useEffect(
		() => {
			if (usersDialog.props.open) {
				initDialog();
			}
		},
		[ usersDialog.props.open, initDialog ]
	);

	function closeComposeDialog() {
		usersDialog.type === 'edit' ? dispatch(Actions.closeEditUserDialog()) : dispatch(Actions.closeNewUserDialog());
	}

	function canBeSubmitted() {
		return (
			form.name.length > 0 &&
			form.incunvencias.length > 0 &&
			form.titulo1.length > 0 &&
			form.titulo2.length > 0 &&
			form.matricula1.length > 0 &&
			form.matricula2.length > 0 &&
			form.matricula3.length > 0 &&
			form.matricula4.length > 0 &&
			form.matricula5.length > 0 &&
			form.dni.length > 0 &&
			form.telefono.length > 0 &&
			form.direccion.length > 0
		);
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (usersDialog.type === 'new') {
			dispatch(Actions.addUser(form));
		} else {
			dispatch(Actions.updateUser(form));
		}
		closeComposeDialog();
	}

	function handleRemove() {
		dispatch(Actions.removeUser(form.id));
		closeComposeDialog();
	}

	return (
		<Dialog
			classes={{
				paper : 'm-24'
			}}
			{...usersDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth='md'
		>
			<AppBar position='static' elevation={1}>
				<Toolbar className='flex w-full'>
					<Typography variant='subtitle1' color='inherit'>
						{usersDialog.type === 'new' ? 'Nuevo Usuario' : 'Editar Usuario'}
					</Typography>
				</Toolbar>
				<div className='flex flex-col items-center justify-center pb-24'>
					{usersDialog.type === 'edit' && (
						<Typography variant='h6' color='inherit' className='pt-8'>
							{form.name}
						</Typography>
					)}
				</div>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className='flex flex-col overflow-hidden'>
				<DialogContent classes={{ root: 'p-24' }}>
					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='Nombre'
							id='name'
							name='name'
							value={form.name}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>
					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='Incunvencias'
							id='incunvencias'
							name='incunvencias'
							value={form.incunvencias}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>
					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='Titulo'
							id='titulo1'
							name='titulo1'
							value={form.titulo1}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>
					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='Titulo'
							id='titulo2'
							name='titulo2'
							value={form.titulo2}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>
					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='Matricula'
							id='matricula1'
							name='matricula1'
							value={form.matricula1}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>
					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='Matricula'
							id='matricula2'
							name='matricula2'
							value={form.matricula2}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>
					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='Matricula'
							id='matricula3'
							name='matricula3'
							value={form.matricula3}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>
					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='Matricula'
							id='matricula4'
							name='matricula4'
							value={form.matricula4}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>
					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='Matricula'
							id='matricula5'
							name='matricula5'
							value={form.matricula5}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>
					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='DNI'
							id='dni'
							name='dni'
							value={form.dni}
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
							id='telefono'
							name='telefono'
							value={form.telefono}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>
					<div className='flex'>
						<div className='min-w-48 pt-20' />
						<TextField
							className='mb-24'
							label='Dirección'
							id='direccion'
							name='direccion'
							value={form.direccion}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>
				</DialogContent>

				{usersDialog.type === 'new' ? (
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
};

export default UsersDialog;
