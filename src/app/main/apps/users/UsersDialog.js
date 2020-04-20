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
import { FuseChipSelect } from '@fuse';
import _ from '@lodash';

let defaultFormState = {
	username   : '',
	email      : '',
	userType   : {
		value : 4,
		label : 'Empleado'
	},
	first_name : '',
	last_name  : '',
	dni        : ''
};
const roles = [
	{ value: '1', label: 'Administrador' },
	{ value: '2', label: 'Tecnico' },
	{ value: '4', label: 'Empleado' }
	// { value: '', label: 'Cliente' },
];

const UsersDialog = (props) => {
	const dispatch = useDispatch();
	const usersDialog = useSelector(({ users: { users } }) => users.usersDialog);

	const { form, handleChange, setForm } = useForm(defaultFormState);

	const initDialog = useCallback(
		() => {
			if (usersDialog.type === 'edit' && usersDialog.data) {
				setForm({
					...usersDialog.data,
					userType :
						usersDialog.data.user_type === 0
							? { value: '1', label: 'Administrador' }
							: roles.filter((i) => i.value === usersDialog.data.user_type.toString())[0]
				});
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
			form.username.length > 0 &&
			form.email.length > 0 &&
			form.first_name.length > 0 &&
			form.last_name.length > 0 &&
			form.dni.toString().length > 0
		);
	}

	const handleSubmit = (event) => {
		event.preventDefault();

		if (usersDialog.type === 'new') {
			const body = {
				...form,
				user_type : usersDialog.data.user_type === 0 ? 0 : form.userType.value,
				password  : form.username
			};
			dispatch(Actions.addUser(body));
		} else {
			const body = {
				...form,
				user_type : usersDialog.data.user_type === 0 ? 0 : form.userType.value
			};
			dispatch(Actions.updateUser(body));
		}
		closeComposeDialog();
	};

	function handleRemove() {
		dispatch(Actions.removeUser(form.id));
		closeComposeDialog();
	}

	const handleChipChange = (value, name) => {
		setForm(_.set({ ...form }, name, value));
	};

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
						<FuseChipSelect
							className='mt-8 mb-16 mr-8 w-full'
							value={form.userType}
							onChange={(value) => handleChipChange(value, 'userType')}
							placeholder='Seleccione el tipo de usuario'
							textFieldProps={{
								label           : 'Tipo de usuario',
								InputLabelProps : {
									shrink : true
								},
								variant         : 'outlined'
							}}
							options={roles}
						/>
					</div>
					<div className='flex'>
						<TextField
							className='mt-8 mb-16 mr-8'
							label='Nombre'
							id='first_name'
							name='first_name'
							value={form.first_name}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>

						<TextField
							className='mt-8 mb-16 mr-8'
							label='Apellido'
							id='last_name'
							name='last_name'
							value={form.last_name}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>

					<div className='flex'>
						<TextField
							className='mt-8 mb-16 mr-8'
							label='Correo Electronico'
							id='email'
							name='email'
							value={form.email}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
						<TextField
							className='mt-8 mb-16 mr-8'
							label='Nombre de usuario'
							id='username'
							name='username'
							value={form.username}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					</div>

					<div className='flex'>
						<TextField
							className='mt-8 mb-16 mr-8'
							label='DNI'
							id='dni'
							name='dni'
							value={form.dni}
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
