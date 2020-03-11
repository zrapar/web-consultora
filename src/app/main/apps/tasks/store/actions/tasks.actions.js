import axios from 'axios';

export const GET_TASKS = '@@ Task // GET TASKS';
export const GET_USERS = '@@ Task // GET USERS';
export const GET_CLIENTS = '@@ Task // GET CLIENTS';
export const GET_ESTUDIOS = '@@ Task // GET ESTUDIOS';
export const SHOW_LOADING = '@@ Task // SHOW LOADING';
export const OPEN_NEW_TASK_DIALOG = '@@ Task // OPEN NEW TASK DIALOG';
export const CLOSE_NEW_TASK_DIALOG = '@@ Task // CLOSE NEW TASK DIALOG';
export const OPEN_EDIT_TASK_DIALOG = '@@ Task // OPEN EDIT TASK DIALOG';
export const CLOSE_EDIT_TASK_DIALOG = '@@ Task // CLOSE EDIT TASK DIALOG';
export const ADD_TASK = '@@ Task // ADD TASK';
export const UPDATE_TASK = '@@ Task // UPDATE TASK';
export const REMOVE_TASK = '@@ Task // REMOVE TASK';

export const getTasks = () => async (dispatch) => {
	dispatch({
		type : SHOW_LOADING
	});

	const response = await axios.get('/tareas/');

	dispatch({
		type    : GET_TASKS,
		payload : response.data
	});
};

export const getUsersInTasks = (routeParams) => async (dispatch) => {
	const response = await axios.get('/usuarios/', {
		params : routeParams
	});

	dispatch({
		type        : GET_USERS,
		payload     : response.data,
		routeParams
	});
};

export const getClientsInTasks = (routeParams) => async (dispatch) => {
	const response = await axios.get('/clientes/', {
		params : routeParams
	});

	dispatch({
		type        : GET_CLIENTS,
		payload     : response.data,
		routeParams
	});
};

export const getEstudiosInTasks = (routeParams) => async (dispatch) => {
	const response = await axios.get('/estudios/', {
		params : routeParams
	});

	dispatch({
		type        : GET_ESTUDIOS,
		payload     : response.data,
		routeParams
	});
};

export const openNewTaskDialog = (data) => ({
	type : OPEN_NEW_TASK_DIALOG,
	data
});

export const closeNewTaskDialog = () => ({
	type : CLOSE_NEW_TASK_DIALOG
});

export const openEditTaskDialog = (data) => ({
	type : OPEN_EDIT_TASK_DIALOG,
	data
});

export const closeEditTaskDialog = () => ({
	type : CLOSE_EDIT_TASK_DIALOG
});

export const addTask = (newTask) => async (dispatch) => {
	const response = await axios.post('/tareas/', newTask);

	if (response) {
		Promise.all([
			dispatch({
				type : ADD_TASK
			})
		]).then(() => dispatch(getTasks()));
	}
};

export const updateTask = (task) => async (dispatch) => {
	const response = await axios.post(`/tareas/${task.id}`, task);

	if (response) {
		Promise.all([
			dispatch({
				type : UPDATE_TASK
			})
		]).then(() => dispatch(getTasks()));
	}
};

export const removeTask = (taskId) => async (dispatch) => {
	const response = await axios.delete(`/tareas/${taskId}`);

	if (response) {
		Promise.all([
			dispatch({
				type : REMOVE_TASK
			})
		]).then(() => dispatch(getTasks()));
	}
};
