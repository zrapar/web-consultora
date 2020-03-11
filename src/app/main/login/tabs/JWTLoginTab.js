import React, { useEffect, useRef, useState } from 'react';
import { Button, InputAdornment, Icon, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TextFieldFormsy } from '@fuse';
import Formsy from 'formsy-react';
import * as authActions from 'app/auth/store/actions';
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
	progress : {
		margin : theme.spacing(2),
		width  : '100px!important',
		height : '100px!important'
	},
	center   : {
		display        : 'flex',
		justifyContent : 'center'
	}
}));

const JWTLoginTab = (props) => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const login = useSelector(({ auth }) => auth.login);

	const [ isFormValid, setIsFormValid ] = useState(false);
	const [ showLoading, toggleLoading ] = useState(false);
	const formRef = useRef(null);

	useEffect(
		() => {
			if (login.error) {
				// formRef.current.updateInputsWithError({
				// 	...login.error
				// });
				enableButton();
				toggleLoading(false);
			}
		},
		[ login.error ]
	);

	const disableButton = () => {
		setIsFormValid(false);
	};

	const enableButton = () => {
		setIsFormValid(true);
	};

	const handleSubmit = (model) => {
		disableButton();
		toggleLoading(true);
		dispatch(authActions.submitLogin(model));
	};

	return (
		<div className='w-full'>
			<Formsy
				onValidSubmit={handleSubmit}
				onValid={enableButton}
				onInvalid={disableButton}
				ref={formRef}
				className='flex flex-col justify-center w-full'
			>
				<TextFieldFormsy
					className='mb-16'
					type='text'
					name='username'
					label='Nombre de usuario'
					validations={{
						minLength : 4
					}}
					validationErrors={{
						minLength : 'Min character length is 4'
					}}
					InputProps={{
						endAdornment : (
							<InputAdornment position='end'>
								<Icon className='text-20' color='action'>
									account_box
								</Icon>
							</InputAdornment>
						)
					}}
					variant='outlined'
					required
				/>

				<TextFieldFormsy
					className='mb-16'
					type='password'
					name='password'
					label='Contraseña'
					validations={{
						minLength : 4
					}}
					validationErrors={{
						minLength : 'Min character length is 4'
					}}
					InputProps={{
						endAdornment : (
							<InputAdornment position='end'>
								<Icon className='text-20' color='action'>
									vpn_key
								</Icon>
							</InputAdornment>
						)
					}}
					variant='outlined'
					required
				/>

				<Button
					type='submit'
					variant='contained'
					color='primary'
					className='w-full mx-auto mt-16 normal-case'
					aria-label='LOG IN'
					disabled={!isFormValid}
					value='legacy'
				>
					Iniciar sesión
				</Button>

				{showLoading && (
					<div className={`w-full ${classes.center}`}>
						<CircularProgress className={classes.progress} />
					</div>
				)}
			</Formsy>
		</div>
	);
};

export default JWTLoginTab;
