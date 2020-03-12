import React, { useCallback, useEffect } from 'react';
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
	// FormControlLabel,
	// Switch
} from '@material-ui/core';
// import FuseUtils from '@fuse/FuseUtils';
import { useForm } from '@fuse/hooks';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import 'moment/locale/es';
import * as Actions from './store/actions';
import { FuseChipSelect } from '@fuse';
import _ from '@lodash';

let defaultFormState = {
	// title       : '',
	// allDay      : false,
	id          : null,
	inicio      : new Date(),
	fin         : new Date(),
	estimada    : new Date(),
	estudio     : { id: null },
	responsable : { id: null },
	cliente     : { id: null },
	estado      : { id: 'created' }
};

defaultFormState['estimada'].setDate(defaultFormState['estimada'].getDate() + 1);
const statesOfTask = [
	{ name: 'Creado', value: 'created' },
	{ name: 'En Progreso', value: 'on-progress' },
	{ name: 'Finalizado', value: 'finish' },
	{ name: 'Cancelado', value: 'canceled' }
];

const TaskDialog = (props) => {
	const dispatch = useDispatch();
	const taskDialog = useSelector(({ tasks: { tasks } }) => tasks.taskDialog);
	const estudios = useSelector(({ tasks: { tasks } }) => tasks.estudios);
	const users = useSelector(({ tasks: { tasks } }) => tasks.users);
	const clients = useSelector(({ tasks: { tasks } }) => tasks.clients);

	const { form, handleChange, setForm } = useForm(defaultFormState);
	let start = moment(form.inicio).locale('es').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
	let end = moment(form.fin).locale('es').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
	let estimated = moment(form.estimada).locale('es').format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);

	const initDialog = useCallback(
		() => {
			/**
             * Dialog type: 'edit'
             */
			if (taskDialog.type === 'edit' && taskDialog.data) {
				setForm({ ...taskDialog.data });
			}

			/**
             * Dialog type: 'new'
             */
			if (taskDialog.type === 'new') {
				setForm({
					...defaultFormState,
					...taskDialog.data
				});
			}
		},
		[ taskDialog.data, taskDialog.type, setForm ]
	);

	useEffect(
		() => {
			/**
         * After Dialog Open
         */
			if (taskDialog.props.open) {
				initDialog();
			}
		},
		[ taskDialog.props.open, initDialog ]
	);

	const closeComposeDialog = () => {
		taskDialog.type === 'edit' ? dispatch(Actions.closeEditTaskDialog()) : dispatch(Actions.closeNewTaskDialog());
	};

	const canBeSubmitted = () => {
		let dates = start < estimated;
		if (taskDialog.type === 'edit' && taskDialog.data && taskDialog.data.fin) {
			dates = start < end;
		}
		return form.estudio.id && form.responsable.id && form.cliente.id && form.estado.id && dates;
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (taskDialog.type === 'new') {
			dispatch(
				Actions.addTask({
					...form,
					estudio     : form.estudio.id,
					responsable : form.responsable.id,
					cliente     : form.cliente.id,
					estado      : form.estado.id
				})
			);
		} else {
			dispatch(
				Actions.updateTask({
					...form,
					estudio     : form.estudio.id,
					responsable : form.responsable.id,
					cliente     : form.cliente.id,
					estado      : form.estado.id
				})
			);
		}
		closeComposeDialog();
	};

	const handleRemove = () => {
		dispatch(Actions.removeTask(form.id));
		closeComposeDialog();
	};

	const handleChipChange = (value, name) => {
		setForm(_.set({ ...form }, name, { id: value.value, name: value.label }));
	};
	console.log(form);
	return (
		<Dialog {...taskDialog.props} onClose={closeComposeDialog} fullWidth maxWidth='md' component='form'>
			<AppBar position='static'>
				<Toolbar className='flex w-full'>
					<Typography variant='subtitle1' color='inherit'>
						{taskDialog.type === 'new' ? 'Nueva Tarea' : 'Editar Tarea'}
					</Typography>
				</Toolbar>
			</AppBar>

			<form noValidate onSubmit={handleSubmit}>
				<DialogContent classes={{ root: 'p-16 pb-0 sm:p-24 sm:pb-0' }}>
					<Typography className='mb-16' variant='subtitle1' color='inherit'>
						{taskDialog.type !== 'new' && form.description}
					</Typography>

					<TextField
						id='id'
						className='mt-8 mb-16'
						name='id'
						value={form.id}
						onChange={handleChange}
						variant='outlined'
						type='hidden'
						fullWidth
					/>

					<TextField
						id='inicio'
						name='inicio'
						label='Fecha de inicio'
						type='datetime-local'
						className='mt-8 mb-16'
						InputLabelProps={{
							shrink : true
						}}
						inputProps={{
							max : end
						}}
						value={start}
						onChange={handleChange}
						variant='outlined'
						fullWidth
					/>

					{taskDialog.type === 'new' && (
						<TextField
							id='estimada'
							name='estimada'
							label='Fecha de estimada de finalizacion'
							type='datetime-local'
							className='mt-8 mb-16'
							InputLabelProps={{
								shrink : true
							}}
							inputProps={{
								min : start
							}}
							value={estimated}
							onChange={handleChange}
							variant='outlined'
							fullWidth
						/>
					)}

					{taskDialog.type !== 'new' && (
						<React.Fragment>
							<TextField
								id='estimada'
								name='estimada'
								label='Fecha de estimada de finalizacion'
								type='datetime-local'
								className='mt-8 mb-16'
								InputLabelProps={{
									shrink : true
								}}
								inputProps={{
									min : start
								}}
								value={estimated}
								onChange={handleChange}
								variant='outlined'
								fullWidth
							/>

							<TextField
								id='fin'
								name='fin'
								label='Fecha de finalización'
								type='datetime-local'
								className='mt-8 mb-16'
								InputLabelProps={{
									shrink : true
								}}
								inputProps={{
									min : start
								}}
								value={end}
								onChange={handleChange}
								variant='outlined'
								fullWidth
							/>
							<FuseChipSelect
								className='mt-8 mb-24 w-full'
								value={statesOfTask
									.map((item) => {
										if (item.value === form.estado.id) {
											return {
												value : item.value,
												label : item.name
											};
										}
										return false;
									})
									.filter((i) => i)}
								onChange={(value) => handleChipChange(value, 'estado')}
								placeholder='Estado de la tarea'
								textFieldProps={{
									label           : 'Estado de la tarea',
									InputLabelProps : {
										shrink : true
									},
									variant         : 'outlined'
								}}
								variant='fixed'
								options={statesOfTask.map((item) => ({
									value : item.value,
									label : item.name
								}))}
							/>
						</React.Fragment>
					)}

					<FuseChipSelect
						className='mt-8 mb-24 w-full'
						value={estudios
							.map((item) => {
								if (item.id === form.estudio.id) {
									return {
										value : item.id,
										label : item.name
									};
								}
								return false;
							})
							.filter((i) => i)}
						onChange={(value) => handleChipChange(value, 'estudio')}
						placeholder='Selecciona el estudio'
						textFieldProps={{
							label           : 'Estudios',
							InputLabelProps : {
								shrink : true
							},
							variant         : 'outlined'
						}}
						variant='fixed'
						options={estudios.map((item) => ({
							value : item.id,
							label : item.name
						}))}
					/>

					<FuseChipSelect
						className='mt-8 mb-24 w-full'
						value={users
							.map((item) => {
								if (item.id === form.responsable.id) {
									return {
										value : item.id,
										label : item.name
									};
								}
								return false;
							})
							.filter((i) => i)}
						onChange={(value) => handleChipChange(value, 'responsable')}
						placeholder='Selecciona el responsable'
						textFieldProps={{
							label           : 'Responsables',
							InputLabelProps : {
								shrink : true
							},
							variant         : 'outlined'
						}}
						variant='fixed'
						options={users.map((item) => ({
							value : item.id,
							label : item.name
						}))}
					/>

					<FuseChipSelect
						className='mt-8 mb-60 w-full'
						value={clients
							.map((item) => {
								if (item.id === form.cliente.id) {
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
				</DialogContent>

				{taskDialog.type === 'new' ? (
					<DialogActions className='justify-between pl-8 sm:pl-16'>
						<Button variant='contained' color='primary' type='submit' disabled={!canBeSubmitted()}>
							Agregar
						</Button>
					</DialogActions>
				) : (
					<DialogActions className='justify-between pl-8 sm:pl-16'>
						<Button variant='contained' color='primary' type='submit' disabled={!canBeSubmitted()}>
							Guardar
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

export default TaskDialog;
