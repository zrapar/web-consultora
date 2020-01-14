import React, { useState } from 'react';
import { Icon, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from '@material-ui/core';
import * as Actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';

function SignatoriesMultiSelectMenu(props) {
	const dispatch = useDispatch();
	const selectedSignatoryIds = useSelector(({ signatories: { signatories } }) => signatories.selectedSignatoryIds);

	const [ anchorEl, setAnchorEl ] = useState(null);

	function openSelectedContactMenu(event) {
		setAnchorEl(event.currentTarget);
	}

	function closeSelectedSignatoriesMenu() {
		setAnchorEl(null);
	}

	return (
		<React.Fragment>
			<IconButton
				className='p-0'
				aria-owns={anchorEl ? 'selectedSignatoriesMenu' : null}
				aria-haspopup='true'
				onClick={openSelectedContactMenu}
			>
				<Icon>more_horiz</Icon>
			</IconButton>
			<Menu
				id='selectedSignatoriesMenu'
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={closeSelectedSignatoriesMenu}
			>
				<MenuList>
					<MenuItem
						onClick={() => {
							dispatch(Actions.removeSignatories(selectedSignatoryIds));
							closeSelectedSignatoriesMenu();
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

export default SignatoriesMultiSelectMenu;
