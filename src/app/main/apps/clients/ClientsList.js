import React, { useEffect, useState } from 'react';
import { Checkbox, Icon, IconButton, Typography } from '@material-ui/core';
import { FuseUtils, FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import ReactTable from 'react-table';
import * as Actions from './store/actions';
import ClientsMultiSelectMenu from './ClientsMultiSelectMenu';

function ContactsList(props) {
	const dispatch = useDispatch();
	const contacts = useSelector(({ clients: { clients } }) => clients.entities);
	const selectedClientIds = useSelector(({ clients: { clients } }) => clients.selectedClientIds);
	const searchText = useSelector(({ clients: { clients } }) => clients.searchText);

	const [ filteredData, setFilteredData ] = useState(null);

	useEffect(
		() => {
			function getFilteredArray(entities, searchText) {
				const arr = Object.keys(entities).map((id) => entities[id]);
				if (searchText.length === 0) {
					return arr;
				}
				return FuseUtils.filterArrayByString(arr, searchText);
			}

			if (contacts) {
				setFilteredData(getFilteredArray(contacts, searchText));
			}
		},
		[ contacts, searchText ]
	);

	if (!filteredData) {
		return null;
	}

	if (filteredData.length === 0) {
		return (
			<div className='flex flex-1 items-center justify-center h-full'>
				<Typography color='textSecondary' variant='h5'>
					No hay clientes agregados
				</Typography>
			</div>
		);
	}

	return (
		<FuseAnimate animation='transition.slideUpIn' delay={300}>
			<ReactTable
				className='-striped -highlight h-full sm:rounded-16 overflow-hidden'
				getTrProps={(state, rowInfo, column) => {
					return {
						className : 'cursor-pointer',
						onClick   : (e, handleOriginal) => {
							if (rowInfo) {
								dispatch(Actions.openEditClientDialog(rowInfo.original));
							}
						}
					};
				}}
				data={filteredData}
				columns={[
					{
						Header    : () => (
							<Checkbox
								onClick={(event) => {
									event.stopPropagation();
								}}
								onChange={(event) => {
									event.target.checked
										? dispatch(Actions.selectAllClients())
										: dispatch(Actions.deSelectAllClients());
								}}
								checked={
									selectedClientIds.length === Object.keys(contacts).length &&
									selectedClientIds.length > 0
								}
								indeterminate={
									selectedClientIds.length !== Object.keys(contacts).length &&
									selectedClientIds.length > 0
								}
							/>
						),
						accessor  : '',
						Cell      : (row) => {
							return (
								<Checkbox
									onClick={(event) => {
										event.stopPropagation();
									}}
									checked={selectedClientIds.includes(row.value.id)}
									onChange={() => dispatch(Actions.toggleInSelectedClients(row.value.id))}
								/>
							);
						},
						className : 'justify-center',
						sortable  : false,
						width     : 64
					},
					{
						Header     : 'Nombre',
						accessor   : 'empresa',
						filterable : true
					},
					{
						Header     : 'Dirección',
						accessor   : 'direccion',
						filterable : true
					},
					{
						Header     : 'Correo Electronico',
						accessor   : 'email',
						filterable : true
					},
					{
						Header     : 'Telefono',
						accessor   : 'phone',
						filterable : true
					},
					{
						Header    : () => selectedClientIds.length > 0 && <ClientsMultiSelectMenu />,
						width     : 128,
						sorteable : false,
						Cell      : (row) => (
							<div className='flex items-center'>
								<IconButton
									onClick={(ev) => {
										ev.stopPropagation();
										dispatch(Actions.removeClient(row.original.id));
									}}
								>
									<Icon>delete</Icon>
								</IconButton>
							</div>
						)
					}
				]}
				defaultPageSize={10}
				noDataText='No se consiguieron clientes'
			/>
		</FuseAnimate>
	);
}

export default ContactsList;
