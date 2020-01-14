import React, { useState } from 'react';
import { Icon, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from '@material-ui/core';
import * as Actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';

function ContactsMultiSelectMenu(props) {
	const dispatch = useDispatch();
	const selectedClientIds = useSelector(({ clients: { clients } }) => clients.selectedClientIds);

	const [ anchorEl, setAnchorEl ] = useState(null);

	function openSelectedContactMenu(event) {
		setAnchorEl(event.currentTarget);
	}

	function closeSelectedContactsMenu() {
		setAnchorEl(null);
	}

	return (
		<React.Fragment>
			<IconButton
				className='p-0'
				aria-owns={anchorEl ? 'selectedContactsMenu' : null}
				aria-haspopup='true'
				onClick={openSelectedContactMenu}
			>
				<Icon>more_horiz</Icon>
			</IconButton>
			<Menu
				id='selectedContactsMenu'
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={closeSelectedContactsMenu}
			>
				<MenuList>
					<MenuItem
						onClick={() => {
							dispatch(Actions.removeClients(selectedClientIds));
							closeSelectedContactsMenu();
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

export default ContactsMultiSelectMenu;
