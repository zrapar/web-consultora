import React, { useEffect, useState } from 'react';
import { Checkbox, Icon, IconButton, Typography } from '@material-ui/core';
import { FuseUtils, FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import ReactTable from 'react-table';
import * as Actions from './store/actions';
import SignatoriesMultiSelectMenu from './SignatoriesMultiSelectMenu';

const SignatoriesList = (props) => {
	const dispatch = useDispatch();
	const contacts = useSelector(({ signatories: { signatories } }) => signatories.entities);
	const selectedSignatoryIds = useSelector(({ signatories: { signatories } }) => signatories.selectedSignatoryIds);
	const searchText = useSelector(({ signatories: { signatories } }) => signatories.searchText);

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
					No hay firmantes agregados
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
								dispatch(Actions.openEditSignatoryDialog(rowInfo.original));
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
										? dispatch(Actions.selectAllSignatories())
										: dispatch(Actions.deSelectAllSignatories());
								}}
								checked={
									selectedSignatoryIds.length === Object.keys(contacts).length &&
									selectedSignatoryIds.length > 0
								}
								indeterminate={
									selectedSignatoryIds.length !== Object.keys(contacts).length &&
									selectedSignatoryIds.length > 0
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
									checked={selectedSignatoryIds.includes(row.value.id)}
									onChange={() => dispatch(Actions.toggleInSelectedSignatories(row.value.id))}
								/>
							);
						},
						className : 'justify-center',
						sortable  : false,
						width     : 64
					},
					{
						Header     : 'Nombre',
						accessor   : 'full_name',
						filterable : true
					},
					{
						Header     : 'DNI',
						accessor   : 'dni',
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
						Header    : () => selectedSignatoryIds.length > 0 && <SignatoriesMultiSelectMenu />,
						width     : 128,
						sorteable : false,
						Cell      : (row) => (
							<div className='flex items-center'>
								<IconButton
									onClick={(ev) => {
										ev.stopPropagation();
										dispatch(Actions.removeSignatory(row.original.id));
									}}
								>
									<Icon>delete</Icon>
								</IconButton>
							</div>
						)
					}
				]}
				defaultPageSize={10}
				noDataText='No se consiguieron firmantes'
			/>
		</FuseAnimate>
	);
};

export default SignatoriesList;
