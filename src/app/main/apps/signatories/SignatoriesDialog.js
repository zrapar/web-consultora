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
	full_name : '',
	dni       : '',
	phone     : '',
	email     : '',
	cliente   : null
};

const SignatoriesDialog = (props) => {
	const dispatch = useDispatch();
	const signatoriesDialog = useSelector(({ signatories: { signatories } }) => signatories.signatoriesDialog);
	const clients = useSelector(({ signatories: { signatories } }) => signatories.clients);

	const { form, handleChange, setForm } = useForm(defaultFormState);

	const initDialog = useCallback(
		() => {
			if (signatoriesDialog.type === 'edit' && signatoriesDialog.data) {
				setForm({ ...signatoriesDialog.data });
			}

			if (signatoriesDialog.type === 'new') {
				setForm({
					...defaultFormState,
					...signatoriesDialog.data
				});
			}
		},
		[ signatoriesDialog.data, signatoriesDialog.type, setForm ]
	);

	useEffect(
		() => {
			if (signatoriesDialog.props.open) {
				initDialog();
			}
		},
		[ signatoriesDialog.props.open, initDialog ]
	);

	function closeComposeDialog() {
		signatoriesDialog.type === 'edit'
			? dispatch(Actions.closeEditSignatoryDialog())
			: dispatch(Actions.closeNewSignatoryDialog());
	}

	function canBeSubmitted() {
		return (
			form.full_name.length > 0 &&
			form.dni.length > 0 &&
			form.phone.length > 0 &&
			form.email.length > 0 &&
			form.cliente
		);
	}

	function handleSubmit(event) {
		event.preventDefault();

		if (signatoriesDialog.type === 'new') {
			dispatch(Actions.addSignatory(form));
		} else {
			dispatch(Actions.updateSignatory(form));
		}
		closeComposeDialog();
	}

	function handleRemove() {
		dispatch(Actions.removeSignatory(form.id));
		closeComposeDialog();
	}

	function handleChipChange(value, name) {
		setForm(_.set({ ...form }, name, value.value));
	}

	return (
		<Dialog
			classes={{
				paper : 'm-24'
			}}
			{...signatoriesDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth='md'
		>
			<AppBar position='static' elevation={1}>
				<Toolbar className='flex w-full'>
					<Typography variant='subtitle1' color='inherit'>
						{signatoriesDialog.type === 'new' ? 'Nuevo Firmante' : 'Editar Firmante'}
					</Typography>
				</Toolbar>
				<div className='flex flex-col items-center justify-center pb-24'>
					{signatoriesDialog.type === 'edit' && (
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
							label='Nombre del Firmante'
							autoFocus
							id='full_name'
							name='full_name'
							value={form.full_name}
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
						<FuseChipSelect
							className='mt-8 mb-24 w-full'
							value={clients
								.map((item) => {
									if (item.id === form.cliente) {
										return {
											value : item.id,
											label : item.empresa
										};
									}
									return false;
								})
								.filter((i) => i)}
							onChange={(value) => handleChipChange(value, 'cliente')}
							placeholder='Selecciona el cliente'
							textFieldProps={{
								label           : 'Clientes',
								InputLabelProps : {
									shrink : true
								},
								variant         : 'outlined'
							}}
							variant='fixed'
							options={clients.map((item) => ({
								value : item.id,
								label : item.empresa
							}))}
						/>
					</div>
				</DialogContent>

				{signatoriesDialog.type === 'new' ? (
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

export default SignatoriesDialog;
