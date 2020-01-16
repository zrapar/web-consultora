import React, { useEffect, useState } from 'react';
import { Checkbox, Icon, IconButton, Typography } from '@material-ui/core';
import { FuseUtils, FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import ReactTable from 'react-table';
import * as Actions from './store/actions';
import EstudiosMultiSelectMenu from './EstudiosMultiSelectMenu';

const EstudiosList = (props) => {
	const dispatch = useDispatch();
	const estudios = useSelector(({ estudios: { estudios } }) => estudios.entities);
	const selectedEstudioIds = useSelector(({ estudios: { estudios } }) => estudios.selectedEstudioIds);
	const searchText = useSelector(({ estudios: { estudios } }) => estudios.searchText);

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

			if (estudios) {
				setFilteredData(getFilteredArray(estudios, searchText));
			}
		},
		[ estudios, searchText ]
	);

	if (!filteredData) {
		return null;
	}

	if (filteredData.length === 0) {
		return (
			<div className='flex flex-1 items-center justify-center h-full'>
				<Typography color='textSecondary' variant='h5'>
					No hay estudios agregados
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
								dispatch(Actions.openEditEstudioDialog(rowInfo.original));
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
										? dispatch(Actions.selectAllEstudios())
										: dispatch(Actions.deSelectAllEstudios());
								}}
								checked={
									selectedEstudioIds.length === Object.keys(estudios).length &&
									selectedEstudioIds.length > 0
								}
								indeterminate={
									selectedEstudioIds.length !== Object.keys(estudios).length &&
									selectedEstudioIds.length > 0
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
									checked={selectedEstudioIds.includes(row.value.id)}
									onChange={() => dispatch(Actions.toggleInSelectedEstudios(row.value.id))}
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
						Header    : () => selectedEstudioIds.length > 0 && <EstudiosMultiSelectMenu />,
						width     : 128,
						sorteable : false,
						Cell      : (row) => (
							<div className='flex items-center'>
								<IconButton
									onClick={(ev) => {
										ev.stopPropagation();
										dispatch(Actions.removeEstudio(row.original.id));
									}}
								>
									<Icon>delete</Icon>
								</IconButton>
							</div>
						)
					}
				]}
				defaultPageSize={10}
				noDataText='No se consiguieron estudios'
			/>
		</FuseAnimate>
	);
};

export default EstudiosList;
