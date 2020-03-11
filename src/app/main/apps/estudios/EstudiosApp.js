import React, { useEffect, useRef } from 'react';
import { Fab, Icon } from '@material-ui/core';
import { FusePageSimple, FuseAnimate, FuseLoading } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import EstudiosList from './EstudiosList';
import EstudiosHeader from './EstudiosHeader';
import EstudiosDialog from './EstudiosDialog';
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

const EstudiosApp = (props) => {
	const dispatch = useDispatch();
	const success = useSelector(({ estudios: { estudios } }) => estudios.success);

	const classes = useStyles(props);
	const pageLayout = useRef(null);

	useEffect(
		() => {
			dispatch(Actions.getEstudios());
		},
		[ dispatch ]
	);

	return (
		<React.Fragment>
			{success ? (
				<React.Fragment>
					<FusePageSimple
						classes={{
							contentWrapper : 'p-0 sm:p-24 pb-80 sm:pb-80 h-full',
							content        : 'flex flex-col h-full',
							leftSidebar    : 'w-256 border-0',
							header         : 'min-h-72 h-72 sm:h-136 sm:min-h-136'
						}}
						header={<EstudiosHeader pageLayout={pageLayout} />}
						content={<EstudiosList />}
						sidebarInner
						ref={pageLayout}
						innerScroll
					/>
					<FuseAnimate animation='transition.expandIn' delay={300}>
						<Fab
							color='primary'
							aria-label='add'
							className={classes.addButton}
							onClick={(ev) => dispatch(Actions.openNewEstudioDialog())}
						>
							<Icon>person_add</Icon>
						</Fab>
					</FuseAnimate>
					<EstudiosDialog />
				</React.Fragment>
			) : (
				<FuseLoading delay={true} />
			)}
		</React.Fragment>
	);
};

export default withReducer('estudios', reducer)(EstudiosApp);
