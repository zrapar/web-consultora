import React, { useState } from 'react';
import { Icon, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from '@material-ui/core';
import * as Actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';

function EstudiosMultiSelectMenu(props) {
	const dispatch = useDispatch();
	const selectedEstudioIds = useSelector(({ users: { users } }) => users.selectedEstudioIds);

	const [ anchorEl, setAnchorEl ] = useState(null);

	function openSelectedContactMenu(event) {
		setAnchorEl(event.currentTarget);
	}

	function closeSelectedEstudiosMenu() {
		setAnchorEl(null);
	}

	return (
		<React.Fragment>
			<IconButton
				className='p-0'
				aria-owns={anchorEl ? 'selectedEstudiosMenu' : null}
				aria-haspopup='true'
				onClick={openSelectedContactMenu}
			>
				<Icon>more_horiz</Icon>
			</IconButton>
			<Menu
				id='selectedEstudiosMenu'
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={closeSelectedEstudiosMenu}
			>
				<MenuList>
					<MenuItem
						onClick={() => {
							dispatch(Actions.removeEstudios(selectedEstudioIds));
							closeSelectedEstudiosMenu();
						}}
					>
						<ListItemIcon className='min-w-40'>
							<Icon>delete</Icon>
						</ListItemIcon>
						<ListItemText primary='Eliminar' />
					</MenuItem>
				</MenuList>
			</Menu>
		</React.Fragment>
	);
}

export default EstudiosMultiSelectMenu;
