import React, { useState } from 'react';
import { Icon, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from '@material-ui/core';
import * as Actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';

function UsersMultiSelectMenu(props) {
	const dispatch = useDispatch();
	const selectedUserIds = useSelector(({ users: { users } }) => users.selectedUserIds);

	const [ anchorEl, setAnchorEl ] = useState(null);

	function openSelectedContactMenu(event) {
		setAnchorEl(event.currentTarget);
	}

	function closeSelectedUsersMenu() {
		setAnchorEl(null);
	}

	return (
		<React.Fragment>
			<IconButton
				className='p-0'
				aria-owns={anchorEl ? 'selectedUsersMenu' : null}
				aria-haspopup='true'
				onClick={openSelectedContactMenu}
			>
				<Icon>more_horiz</Icon>
			</IconButton>
			<Menu
				id='selectedUsersMenu'
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={closeSelectedUsersMenu}
			>
				<MenuList>
					<MenuItem
						onClick={() => {
							dispatch(Actions.removeUsers(selectedUserIds));
							closeSelectedUsersMenu();
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

export default UsersMultiSelectMenu;
