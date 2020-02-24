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
import { FuseChipSelect } from '@fuse';
import { useForm } from '@fuse/hooks';
import * as Actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';
import _ from '@lodash';

let defaultFormState = {
	name : '',
	tipo : null
};

const EstudiosDialog = (props) => {
	const dispatch = useDispatch();
	const estudiosDialog = useSelector(({ estudios: { estudios } }) => estudios.estudiosDialog);
	const tiposEstudios = [ { name: 'Fisico', value: 'F' }, { name: 'Quimico', value: 'Q' } ];

	const { form, handleChange, setForm } = useForm(defaultFormState);

	const initDialog = useCallback(
		() => {
			if (estudiosDialog.type === 'edit' && estudiosDialog.data) {
				setForm({ ...estudiosDialog.data });
			}

			if (estudiosDialog.type === 'new') {
				setForm({
					...defaultFormState,
					...estudiosDialog.data
				});
			}
		},
		[ estudiosDialog.data, estudiosDialog.type, setForm ]
	);

	useEffect(
		() => {
			if (estudiosDialog.props.open) {
				initDialog();
			}
		},
		[ estudiosDialog.props.open, initDialog ]
	);

	const closeComposeDialog = () => {
		estudiosDialog.type === 'edit'
			? dispatch(Actions.closeEditEstudioDialog())
			: dispatch(Actions.closeNewEstudioDialog());
	};

	const canBeSubmitted = () => {
		return form.name.length > 0 && form.tipo;
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		if (estudiosDialog.type === 'new') {
			dispatch(Actions.addEstudio(form));
		} else {
			dispatch(Actions.updateEstudio(form));
		}
		closeComposeDialog();
	};

	const handleRemove = () => {
		dispatch(Actions.removeEstudio(form.id));
		closeComposeDialog();
	};

	const handleChipChange = (value, name) => {
		setForm(_.set({ ...form }, name, value.value));
	};

	return (
		<Dialog
			classes={{
				paper : 'm-24'
			}}
			{...estudiosDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth='md'
		>
			<AppBar position='static' elevation={1}>
				<Toolbar className='flex w-full'>
					<Typography variant='subtitle1' color='inherit'>
						{estudiosDialog.type === 'new' ? 'Nuevo Estudio' : 'Editar Estudio'}
					</Typography>
				</Toolbar>
				<div className='flex flex-col items-center justify-center pb-24'>
					{estudiosDialog.type === 'edit' && (
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
						<div className='min-w-48 pt-20 mb-48' />
						<FuseChipSelect
							className='mt-8 mb-60 w-full'
							value={tiposEstudios
								.map((item) => {
									if (item.value === form.tipo) {
										return {
											value : item.value,
											label : item.name
										};
									}
									return false;
								})
								.filter((i) => i)}
							onChange={(value) => handleChipChange(value, 'tipo')}
							placeholder='Selecciona el tipo de estudio'
							textFieldProps={{
								label           : 'Tipo de Estudio',
								InputLabelProps : {
									shrink : true
								},
								variant         : 'outlined'
							}}
							variant='fixed'
							options={tiposEstudios.map((item) => ({
								value : item.value,
								label : item.name
							}))}
						/>
					</div>
				</DialogContent>

				{estudiosDialog.type === 'new' ? (
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

export default EstudiosDialog;
