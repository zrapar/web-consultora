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

const defaultFormState = {
	// title       : '',
	// allDay      : false,
	inicio      : new Date(),
	fin         : new Date(),
	estudio     : null,
	responsable : null,
	cliente     : null,
	estado      : 'created'
};

const statesOfTask = [
	{ name: 'Creado', value: 'created' },
	{ name: 'En Progreso', value: 'on-progress' },
	{ name: 'Finalizado', value: 'finish' },
	{ name: 'Cancelado', value: 'cancel' }
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
		return form.estudio && form.responsable && form.cliente && form.estado;
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		if (taskDialog.type === 'new') {
			dispatch(Actions.addTask(form));
		} else {
			dispatch(Actions.updateTask(form));
		}
		closeComposeDialog();
	};

	const handleRemove = () => {
		dispatch(Actions.removeTask(form.id));
		closeComposeDialog();
	};

	const handleChipChange = (value, name) => {
		setForm(_.set({ ...form }, name, value.value));
	};

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
					{/* <TextField
						id='title'
						label='Title'
						className='mt-8 mb-16'
						InputLabelProps={{
							shrink : true
						}}
						inputProps={{
							max : end
						}}
						name='title'
						value={form.title}
						onChange={handleChange}
						variant='outlined'
						autoFocus
						required
						fullWidth
					/> */}

					{/* <FormControlLabel
						className='mt-8 mb-16'
						label='All Day'
						control={<Switch checked={form.allDay} id='allDay' name='allDay' onChange={handleChange} />}
					/> */}

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
								if (item.value === form.estado) {
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

					<FuseChipSelect
						className='mt-8 mb-24 w-full'
						value={estudios
							.map((item) => {
								if (item.id === form.estudio) {
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
								if (item.id === form.responsable) {
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
