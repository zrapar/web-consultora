import React, { useState } from 'react';
import {
	TableHead,
	TableSortLabel,
	TableCell,
	TableRow,
	Checkbox,
	Tooltip,
	IconButton,
	Icon,
	Menu,
	MenuList,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Dialog,
	DialogContent,
	DialogActions,
	Button,
	DialogTitle,
	DialogContentText
} from '@material-ui/core';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { removeClients } from './store/actions';
import { useDispatch } from 'react-redux';

const rows = [
	{
		id             : 'clientId',
		align          : 'left',
		disablePadding : false,
		label          : 'ID del Cliente',
		sort           : true
	},
	{
		id             : 'clientName',
		align          : 'left',
		disablePadding : false,
		label          : 'Nombre del cliente',
		sort           : true
	},
	{
		id             : 'cuit',
		align          : 'left',
		disablePadding : false,
		label          : 'CUIT',
		sort           : true
	}
];

const useStyles = makeStyles((theme) => ({
	actionsButtonWrapper : {
		background : theme.palette.background.paper
	}
}));

const ClientsTableHead = (props) => {
	const dispatch = useDispatch();
	const classes = useStyles(props);
	const [ selectedClientsMenu, setSelectedClientsMenu ] = useState(null);
	const [ warning, toggleWaring ] = useState(false);

	const createSortHandler = (property) => (event) => {
		props.onRequestSort(event, property);
	};

	const openSelectedClientsMenu = (event) => {
		setSelectedClientsMenu(event.currentTarget);
	};

	const closeSelectedClientsMenu = () => {
		toggleWaring(true);
		setSelectedClientsMenu(null);
	};

	const closeWarningDelete = (confirmDelete) => {
		if (props.selected.length > 0 && confirmDelete) {
			dispatch(removeClients(props.selected));
		}
		toggleWaring(false);
	};

	return (
		<React.Fragment>
			<TableHead>
				<TableRow className='h-64'>
					<TableCell padding='checkbox' className='relative pl-4 sm:pl-12'>
						<Checkbox
							indeterminate={props.numSelected > 0 && props.numSelected < props.rowCount}
							checked={props.numSelected === props.rowCount}
							onChange={props.onSelectAllClick}
						/>
						{props.numSelected > 0 && (
							<div
								className={clsx(
									'flex items-center justify-center absolute w-64 top-0 left-0 ml-68 h-64 z-10',
									classes.actionsButtonWrapper
								)}
							>
								<IconButton
									aria-owns={selectedClientsMenu ? 'selectedClientsMenu' : null}
									aria-haspopup='true'
									onClick={openSelectedClientsMenu}
								>
									<Icon>more_horiz</Icon>
								</IconButton>
								<Menu
									id='selectedClientsMenu'
									anchorEl={selectedClientsMenu}
									open={Boolean(selectedClientsMenu)}
									onClose={closeSelectedClientsMenu}
								>
									<MenuList>
										<MenuItem
											onClick={() => {
												closeSelectedClientsMenu();
											}}
										>
											<ListItemIcon className='min-w-40'>
												<Icon>delete</Icon>
											</ListItemIcon>
											<ListItemText primary='Eliminar' />
										</MenuItem>
									</MenuList>
								</Menu>
							</div>
						)}
					</TableCell>
					{rows.map((row) => {
						return (
							<TableCell
								key={row.id}
								align={row.align}
								padding={row.disablePadding ? 'none' : 'default'}
								sortDirection={props.order.id === row.id ? props.order.direction : false}
							>
								{row.sort && (
									<Tooltip
										title='Sort'
										placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
										enterDelay={300}
									>
										<TableSortLabel
											active={props.order.id === row.id}
											direction={props.order.direction}
											onClick={createSortHandler(row.id)}
										>
											{row.label}
										</TableSortLabel>
									</Tooltip>
								)}
							</TableCell>
						);
					}, this)}
				</TableRow>
			</TableHead>
			<Dialog
				onClose={() => closeWarningDelete(false)}
				aria-labelledby='delete-modal'
				open={warning}
				classes={{
					paper : 'm-24'
				}}
			>
				<DialogTitle id='alert-dialog-title'>
					¿Esta seguro que desea eliminar la información seleccionada?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id='alert-dialog-description'>
						Seleccione en la parte de abajo la opción que desea hacer con la información seleccionada
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => closeWarningDelete(false)} color='primary'>
						Cancelar
					</Button>
					<Button onClick={() => closeWarningDelete(true)} color='primary' autoFocus>
						Borrar
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
};

export default ClientsTableHead;
