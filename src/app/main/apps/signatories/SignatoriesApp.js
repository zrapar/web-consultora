import React, { useEffect, useRef } from 'react';
import { Fab, Icon } from '@material-ui/core';
import { FusePageSimple, FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import SignatoriesList from './SignatoriesList';
import SignatoriesHeader from './SignatoriesHeader';
import SignatoriesDialog from './SignatoriesDialog';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
	addButton : {
		position : 'absolute',
		right    : 12,
		bottom   : 12,
		zIndex   : 99
	}
});

const SignatoriesApp = (props) => {
	const dispatch = useDispatch();

	const classes = useStyles(props);
	const pageLayout = useRef(null);
	const state = !!useSelector(({ clients }) => clients);

	useEffect(
		() => {
			dispatch(Actions.getSignatories());
			if (!state) {
				dispatch(Actions.getClientsInSignatory());
			}
		},
		[ dispatch, state ]
	);

	return (
		<React.Fragment>
			<FusePageSimple
				classes={{
					contentWrapper : 'p-0 sm:p-24 pb-80 sm:pb-80 h-full',
					content        : 'flex flex-col h-full',
					leftSidebar    : 'w-256 border-0',
					header         : 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={<SignatoriesHeader pageLayout={pageLayout} />}
				content={<SignatoriesList />}
				sidebarInner
				ref={pageLayout}
				innerScroll
			/>
			<FuseAnimate animation='transition.expandIn' delay={300}>
				<Fab
					color='primary'
					aria-label='add'
					className={classes.addButton}
					onClick={(ev) => dispatch(Actions.openNewSignatoryDialog())}
				>
					<Icon>person_add</Icon>
				</Fab>
			</FuseAnimate>
			<SignatoriesDialog clients={state} />
		</React.Fragment>
	);
};

export default withReducer('signatories', reducer)(SignatoriesApp);
