import React, { useEffect, useState } from 'react';
import { Checkbox, Icon, IconButton, Typography } from '@material-ui/core';
import { FuseUtils, FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import ReactTable from 'react-table';
import * as Actions from './store/actions';
import UsersMultiSelectMenu from './UsersMultiSelectMenu';

const UsersList = (props) => {
	const dispatch = useDispatch();
	const users = useSelector(({ users: { users } }) => users.entities);
	const selectedUserIds = useSelector(({ users: { users } }) => users.selectedUserIds);
	const searchText = useSelector(({ users: { users } }) => users.searchText);

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

			if (users) {
				setFilteredData(getFilteredArray(users, searchText));
			}
		},
		[ users, searchText ]
	);

	if (!filteredData) {
		return null;
	}

	if (filteredData.length === 0) {
		return (
			<div className='flex flex-1 items-center justify-center h-full'>
				<Typography color='textSecondary' variant='h5'>
					No hay usuarios agregados
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
								dispatch(Actions.openEditUserDialog(rowInfo.original));
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
										? dispatch(Actions.selectAllUsers())
										: dispatch(Actions.deSelectAllUsers());
								}}
								checked={
									selectedUserIds.length === Object.keys(users).length && selectedUserIds.length > 0
								}
								indeterminate={
									selectedUserIds.length !== Object.keys(users).length && selectedUserIds.length > 0
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
									checked={selectedUserIds.includes(row.value.id)}
									onChange={() => dispatch(Actions.toggleInSelectedUsers(row.value.id))}
								/>
							);
						},
						className : 'justify-center',
						sortable  : false,
						width     : 64
					},
					{
						Header     : 'Nombre',
						accessor   : 'name',
						filterable : true
					},
					{
						Header     : 'Incunvencia',
						accessor   : 'incunvencias',
						filterable : true
					},
					{
						Header     : 'DNI',
						accessor   : 'dni',
						filterable : true
					},
					{
						Header     : 'Telefono',
						accessor   : 'telefono',
						filterable : true
					},
					{
						Header    : () => selectedUserIds.length > 0 && <UsersMultiSelectMenu />,
						width     : 128,
						sorteable : false,
						Cell      : (row) => (
							<div className='flex items-center'>
								<IconButton
									onClick={(ev) => {
										ev.stopPropagation();
										dispatch(Actions.removeUser(row.original.id));
									}}
								>
									<Icon>delete</Icon>
								</IconButton>
							</div>
						)
					}
				]}
				defaultPageSize={10}
				noDataText='No se consiguieron usuarios'
			/>
		</FuseAnimate>
	);
};

export default UsersList;
