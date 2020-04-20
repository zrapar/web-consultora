import React, { useEffect, useState } from 'react';
import {
	// Icon,
	Table,
	TableBody,
	TableCell,
	TablePagination,
	TableRow,
	Checkbox
} from '@material-ui/core';
import { FuseScrollbars } from '@fuse';
import { withRouter } from 'react-router-dom';
// import clsx from 'clsx';
import _ from '@lodash';
import ClientsTableHead from './ClientsTableHead';
import * as Actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';

const ClientsTable = (props) => {
	const dispatch = useDispatch();
	const clients = useSelector(({ clients: { clients } }) => clients.clients);
	const searchText = useSelector(({ clients: { clients } }) => clients.searchText);

	const [ selected, setSelected ] = useState([]);
	const [ data, setData ] = useState(clients);
	const [ page, setPage ] = useState(0);
	const [ rowsPerPage, setRowsPerPage ] = useState(10);
	const [ order, setOrder ] = useState({
		direction : 'desc',
		id        : null
	});

	useEffect(
		() => {
			dispatch(Actions.getClients());
		},
		[ dispatch ]
	);

	useEffect(
		() => {
			setData(
				searchText.length === 0
					? clients
					: _.filter(
							clients,
							(item) =>
								item.formalData.clientId.toString().toLowerCase().includes(searchText.toLowerCase()) ||
								item.formalData.clientName.toLowerCase().includes(searchText.toLowerCase()) ||
								item.formalData.cuit.toLowerCase().includes(searchText.toLowerCase())
						)
			);
		},
		[ clients, searchText ]
	);

	function handleRequestSort(event, property) {
		const id = property;
		let direction = 'desc';

		if (order.id === property && order.direction === 'desc') {
			direction = 'asc';
		}

		setOrder({
			direction,
			id
		});
	}

	function handleSelectAllClick(event) {
		if (event.target.checked) {
			setSelected(data.map((n) => n.id));
			return;
		}
		setSelected([]);
	}

	const handleClick = (item) => {
		props.history.push('/apps/clients/' + item.id);
	};

	function handleCheck(event, id) {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}

		setSelected(newSelected);
	}

	function handleChangePage(event, page) {
		setPage(page);
	}

	function handleChangeRowsPerPage(event) {
		setRowsPerPage(event.target.value);
	}

	return (
		<div className='w-full flex flex-col'>
			<FuseScrollbars className='flex-grow overflow-x-auto'>
				<Table className='min-w-xl' aria-labelledby='tableTitle'>
					<ClientsTableHead
						numSelected={selected.length}
						order={order}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={data.length}
						selected={selected}
					/>

					<TableBody>
						{_.orderBy(
							data,
							[
								(o) => {
									switch (order.id) {
										case 'categories': {
											return o.categories[0];
										}
										default: {
											return o[order.id];
										}
									}
								}
							],
							[ order.direction ]
						)
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((n, index) => {
								const isSelected = selected.indexOf(n.id) !== -1;
								return (
									<TableRow
										className='h-64 cursor-pointer'
										hover
										role='checkbox'
										aria-checked={isSelected}
										tabIndex={-1}
										key={index}
										selected={isSelected}
										onClick={(event) => handleClick(n)}
									>
										<TableCell className='w-48 px-4 sm:px-12' padding='checkbox'>
											<Checkbox
												checked={isSelected}
												onClick={(event) => event.stopPropagation()}
												onChange={(event) => handleCheck(event, n.id)}
											/>
										</TableCell>

										<TableCell component='th' scope='row'>
											{n.formalData.clientId}
										</TableCell>

										<TableCell component='th' scope='row'>
											{n.formalData.clientName}
										</TableCell>

										<TableCell className='truncate' component='th' scope='row'>
											{n.formalData.cuit}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</FuseScrollbars>

			<TablePagination
				component='div'
				count={data.length}
				rowsPerPage={rowsPerPage}
				page={page}
				backIconButtonProps={{
					'aria-label' : 'Siguiente pagina'
				}}
				nextIconButtonProps={{
					'aria-label' : 'Pagina Anterior'
				}}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</div>
	);
};

export default withRouter(ClientsTable);
