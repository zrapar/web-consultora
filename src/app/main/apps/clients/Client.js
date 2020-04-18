import React, { useEffect, useState, useCallback } from 'react';
import {
	Button,
	Tab,
	Tabs,
	TextField,
	InputAdornment,
	Icon,
	Typography,
	Checkbox,
	FormGroup,
	FormControlLabel,
	Grid,
	Paper,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	CircularProgress
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate, FusePageCarded, FuseChipSelect } from '@fuse';
import { useForm } from '@fuse/hooks';
import { Link } from 'react-router-dom';
import _ from '@lodash';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import { useDropzone } from 'react-dropzone';
import { SingS3, uploadFile, deleteFile } from '../../../../utils/aws';

const useStyles = makeStyles((theme) => ({
	root     : {
		flexGrow  : 1,
		marginTop : 10
	},
	paper    : {
		padding   : theme.spacing(2),
		textAlign : 'center',
		color     : theme.palette.text.secondary
	},
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

const Client = (props) => {
	const dispatch = useDispatch();
	const client = useSelector(({ clients: { clients } }) => clients.client);

	const classes = useStyles(props);
	const [ tabValue, setTabValue ] = useState(0);
	const [ tabInnerFormal, setTabInnerFormal ] = useState(0);
	const [ tabInnerPlanta, setTabInnerPlanta ] = useState(0);
	const { form, handleChange, setForm } = useForm(null);

	const [ formalDataFiles, setFormalDataFiles ] = useState({
		estatuto        : [],
		actaDesignacion : [],
		poderes         : [],
		extraPdfs       : [],
		planchetas      : []
	});

	const [ loadingFiles, toggleLoadingFiles ] = useState({
		estatutosLoading  : false,
		actasLoading      : false,
		poderesLoading    : false,
		extrasLoading     : false,
		planchetasLoading : false
	});

	const [ deletingFiles, toggleDeleteFiles ] = useState({
		estatutosDeleting  : false,
		actasDeleting      : false,
		poderesDeleting    : false,
		extrasDeleting     : false,
		planchetasDeleting : false
	});

	const [ disabledFiles, toggleDisabledFiles ] = useState({
		estatutosDisabled  : false,
		actasDisabled      : false,
		poderesDisabled    : false,
		extrasDisabled     : false,
		planchetasDisabled : false
	});

	const [ checkBox, toggleCheckBox ] = useState({
		opds   : false,
		ada    : false,
		ina    : false,
		acumar : false
	});

	const [ addressFormalData, setAddress ] = useState([]);
	const [ legalRepresentativeFormalData, setLegalRepresentative ] = useState([]);
	const [ dataPlanta, setPlanta ] = useState([]);
	const [ phoneContactsPlanta, setPhoneContacts ] = useState([]);
	const [ innerContactsPlanta, setInnerContacts ] = useState([]);
	const [ mobiliaryPlanta, setMobiliary ] = useState([]);

	const { opds, ada, ina, acumar } = checkBox;

	const { estatuto, actaDesignacion, poderes, extraPdfs, planchetas } = formalDataFiles;
	const { estatutosLoading, actasLoading, poderesLoading, extrasLoading, planchetasLoading } = loadingFiles;
	const { estatutosDeleting, actasDeleting, poderesDeleting, extrasDeleting, planchetasDeleting } = deletingFiles;

	useEffect(
		() => {
			function updateClientState() {
				const params = props.match.params;
				const { clientId } = params;

				if (clientId === 'new') {
					dispatch(Actions.newClient());
				} else {
					dispatch(Actions.getClient(props.match.params));
				}
			}

			updateClientState();
		},
		[ dispatch, props.match.params ]
	);

	useEffect(
		() => {
			if ((client && !form) || (client && form && client.id !== form.id)) {
				setForm(client);
			}
		},
		[ form, client, setForm ]
	);

	const handleChangeTab = (event, tabValue) => {
		setTabValue(tabValue);
	};

	const handleChangeInnerTab = (tabValue, mainTab) => {
		if (mainTab === 'Formal') {
			setTabInnerFormal(tabValue);
		} else {
			setTabInnerPlanta(tabValue);
		}
	};

	const handleChipChange = (value, name) => {
		setForm(_.set({ ...form }, name, value));
	};

	const canBeSubmitted = () => {
		return form.formalData.clientName.length > 0 && !_.isEqual(client, form);
	};

	const formalDataAddressSubmitted = () => {
		const { partido, localidad, calleRuta, nKm, piso, depto, codigo_postal, type } = form.formalData.address;
		let isSubmitted = false;
		if (
			partido.toString().length > 0 &&
			localidad.toString().length > 0 &&
			calleRuta.toString().length > 0 &&
			nKm.toString().length > 0 &&
			piso.toString().length > 0 &&
			depto.toString().length > 0 &&
			codigo_postal.toString().length > 0 &&
			type.value
		) {
			isSubmitted = true;
		}

		return isSubmitted;
	};

	const formalDataLegalRepresentativeSubmitted = () => {
		const { name, dni, position, cuil } = form.formalData.legalRepresentative;

		let isSubmitted = false;
		if (
			name.toString().length > 0 &&
			dni.toString().length > 0 &&
			position.toString().length > 0 &&
			cuil.toString().length > 0 &&
			estatuto.length > 0 &&
			actaDesignacion.length > 0 &&
			poderes.length > 0 &&
			extraPdfs.length > 0
		) {
			isSubmitted = true;
		}

		return isSubmitted;
	};

	const plantaSubmitted = () => {
		let isSubmitted = false;
		const { id_establecimiento, address, email } = form.planta;
		if (
			id_establecimiento.toString().length > 0 &&
			address.toString().length > 0 &&
			email.toString().length > 0 &&
			phoneContactsPlanta.length > 0 &&
			innerContactsPlanta.length > 0 &&
			mobiliaryPlanta.length > 0
		) {
			let isSubmitted = true;
		}

		return isSubmitted;
	};

	const plantaPhoneContactsSubmitted = () => {
		let isSubmitted = false;
		if (form.phoneContacts.length > 0) {
			isSubmitted = true;
		}

		return isSubmitted;
	};

	const plantaInnerContactsSubmitted = () => {
		const { name, lastName, phone, email, position, workArea } = form.planta.innerContact;
		let isSubmitted = false;
		if (
			name.toString().length > 0 &&
			lastName.toString().length > 0 &&
			phone.toString().length > 0 &&
			email.toString().length > 0 &&
			position.toString().length > 0 &&
			workArea.toString().length > 0
		) {
			isSubmitted = true;
		}

		return isSubmitted;
	};

	const plantaMobiliarySubmitted = () => {
		const {
			orderNum,
			partidaInmobiliaria,
			matricula,
			circunscripcion,
			seccion,
			fraccion,
			manzana,
			parcela,
			poligono,
			propietario,
			caracterUso,
			documentacion,
			observaciones
		} = form.planta.mobiliary;
		let isSubmitted = false;
		if (
			orderNum.toString().length > 0 &&
			partidaInmobiliaria.toString().length > 0 &&
			matricula.toString().length > 0 &&
			circunscripcion.toString().length > 0 &&
			seccion.toString().length > 0 &&
			fraccion.toString().length > 0 &&
			manzana.toString().length > 0 &&
			parcela.toString().length > 0 &&
			poligono.toString().length > 0 &&
			propietario.toString().length > 0 &&
			caracterUso.toString().length > 0 &&
			documentacion.toString().length > 0 &&
			observaciones.toString().length > 0 &&
			planchetas.length > 0
		) {
			isSubmitted = true;
		}

		return isSubmitted;
	};

	const EstatutoDropZone = ({
		formalDataFiles,
		files,
		setFormalDataFiles,
		callBack,
		getSignedUrl,
		loading,
		toggleLoading,
		loadingFiles,
		deleting,
		toggleDelete,
		deletingFiles,
		toggleDisabledFiles,
		disabledFiles
	}) => {
		const folder = 'estatutos';
		const onDrop = callBack(async (uploadedFiles) => {
			toggleLoading({
				...loadingFiles,
				[`${folder}Loading`]: true
			});
			toggleDisabledFiles({
				estatutosDisabled  : false,
				actasDisabled      : true,
				poderesDisabled    : true,
				extrasDisabled     : true,
				planchetasDisabled : true
			});
			getSignedUrl(uploadedFiles, folder, async (response) => {
				const arrayPromise = await response;
				const acceptedFiles = arrayPromise.filter((i) => i);
				if (acceptedFiles.length > 0) {
					setFormalDataFiles({
						...formalDataFiles,
						estatuto : [ ...files, ...acceptedFiles ]
					});
				} else {
					alert('Existio un problema subiendo el (los) documento(s), intente de nuevo');
				}
				toggleLoading({
					...loadingFiles,
					[`${folder}Loading`]: false
				});
				toggleDisabledFiles({
					estatutosDisabled  : false,
					actasDisabled      : false,
					poderesDisabled    : false,
					extrasDisabled     : false,
					planchetasDisabled : false
				});
			});
		});

		const { getRootProps, getInputProps } = useDropzone({
			accept   : 'application/pdf',
			onDrop,
			disabled : form.formalData.clientId === ''
		});

		const removeFile = async (file) => {
			toggleDelete({
				...deletingFiles,
				[`${folder}Deleting`]: true
			});
			deleteFile(file.name.replace('.pdf', ''), folder, form.formalData.clientId, (isDeleted) => {
				if (isDeleted) {
					const newFiles = files.filter((i) => i.file !== file);
					setFormalDataFiles({
						...formalDataFiles,
						estatuto : newFiles
					});
				} else {
					alert('No se pudo borrar el archivo, intente de nuevo');
				}
				toggleDelete({
					...deletingFiles,
					[`${folder}Deleting`]: false
				});
			});
		};

		const fileList = files.map((item, index) => (
			<ListItem key={index} alignItems='center'>
				<ListItemIcon onClick={() => removeFile(item.file)}>
					<DeleteIcon />
				</ListItemIcon>
				<ListItemText className='text-justify' primary={item.file.path} />
			</ListItem>
		));

		return (
			<div className='flex flex-col min-h-128 h-full justify-around cursor-pointer'>
				{loading || deleting ? (
					<div className={`flex-col justify-around items-center w-full ${classes.center}`}>
						<Typography variant='h5' component='h3'>
							{loading ? 'Cargando Archivos...' : 'Borrando Archivo'}
						</Typography>
						<CircularProgress className={classes.progress} />
					</div>
				) : (
					<React.Fragment>
						{form.formalData.clientId !== '' && !disabledFiles.estatutosDisabled ? (
							<div {...getRootProps()}>
								<input {...getInputProps()} />
								<Typography variant='h5' component='h3'>
									Estatutos
								</Typography>
								<Typography component='p'>
									Puede arrastrar, o dar click para cargar los archivos
								</Typography>
							</div>
						) : (
							<React.Fragment>
								{disabledFiles.estatutosDisabled && (
									<Typography variant='h5' component='h3'>
										Debe esperar que termine de subir los otros archivos
									</Typography>
								)}
								{form.formalData.clientId === '' && (
									<Typography variant='h5' component='h3'>
										Primero debe agregar el ID del Cliente
									</Typography>
								)}
							</React.Fragment>
						)}

						{files.length > 0 && (
							<Grid container spacing={2} className='mt-8'>
								<Grid item xs={12}>
									<Typography variant='h6' className={classes.title}>
										Archivos
									</Typography>
									<div className={classes.demo}>
										<List dense={true}>{fileList}</List>
									</div>
								</Grid>
							</Grid>
						)}
					</React.Fragment>
				)}
			</div>
		);
	};

	const ActaDesignacionDropZone = ({
		formalDataFiles,
		files,
		setFormalDataFiles,
		callBack,
		getSignedUrl,
		loading,
		toggleLoading,
		loadingFiles,
		deleting,
		toggleDelete,
		deletingFiles,
		disabledFiles,
		toggleDisabledFiles
	}) => {
		const folder = 'actas';
		const onDrop = callBack(async (uploadedFiles) => {
			toggleLoading({
				...loadingFiles,
				[`${folder}Loading`]: true
			});
			toggleDisabledFiles({
				estatutosDisabled  : true,
				actasDisabled      : false,
				poderesDisabled    : true,
				extrasDisabled     : true,
				planchetasDisabled : true
			});
			getSignedUrl(uploadedFiles, folder, async (response) => {
				const arrayPromise = await response;
				const acceptedFiles = arrayPromise.filter((i) => i);
				if (acceptedFiles.length > 0) {
					setFormalDataFiles({
						...formalDataFiles,
						actaDesignacion : [ ...files, ...acceptedFiles ]
					});
				} else {
					alert('Existio un problema subiendo el (los) documento(s), intente de nuevo');
				}
				toggleLoading({
					...loadingFiles,
					[`${folder}Loading`]: false
				});
				toggleDisabledFiles({
					estatutosDisabled  : false,
					actasDisabled      : false,
					poderesDisabled    : false,
					extrasDisabled     : false,
					planchetasDisabled : false
				});
			});
		});

		const { getRootProps, getInputProps } = useDropzone({
			accept   : 'application/pdf',
			onDrop,
			disabled : form.formalData.clientId === ''
		});

		const removeFile = async (file) => {
			toggleDelete({
				...deletingFiles,
				[`${folder}Deleting`]: true
			});
			deleteFile(file.name.replace('.pdf', ''), folder, form.formalData.clientId, (isDeleted) => {
				if (isDeleted) {
					const newFiles = files.filter((i) => i.file !== file);
					setFormalDataFiles({
						...formalDataFiles,
						actaDesignacion : newFiles
					});
				} else {
					alert('No se pudo borrar el archivo, intente de nuevo');
				}
				toggleDelete({
					...deletingFiles,
					[`${folder}Deleting`]: false
				});
			});
		};

		const fileList = files.map((item, index) => (
			<ListItem key={index} alignItems='center'>
				<ListItemIcon onClick={() => removeFile(item.file)}>
					<DeleteIcon />
				</ListItemIcon>
				<ListItemText className='text-justify' primary={item.file.path} />
			</ListItem>
		));

		return (
			<div className='flex flex-col min-h-128 h-full justify-around cursor-pointer'>
				{loading || deleting ? (
					<div className={`flex-col justify-around items-center w-full ${classes.center}`}>
						<Typography variant='h5' component='h3'>
							{loading ? 'Cargando Archivos...' : 'Borrando Archivo'}
						</Typography>
						<CircularProgress className={classes.progress} />
					</div>
				) : (
					<React.Fragment>
						{form.formalData.clientId !== '' && !disabledFiles.actasDisabled ? (
							<div {...getRootProps()}>
								<input {...getInputProps()} />
								<Typography variant='h5' component='h3'>
									Actas de Designacion
								</Typography>
								<Typography component='p'>
									Puede arrastrar, o dar click para cargar los archivos
								</Typography>
							</div>
						) : (
							<React.Fragment>
								{disabledFiles.actasDisabled && (
									<Typography variant='h5' component='h3'>
										Debe esperar que termine de subir los otros archivos
									</Typography>
								)}
								{form.formalData.clientId === '' && (
									<Typography variant='h5' component='h3'>
										Primero debe agregar el ID del Cliente
									</Typography>
								)}
							</React.Fragment>
						)}

						{files.length > 0 && (
							<Grid container spacing={2} className='mt-8'>
								<Grid item xs={12}>
									<Typography variant='h6' className={classes.title}>
										Archivos
									</Typography>
									<div className={classes.demo}>
										<List dense={true}>{fileList}</List>
									</div>
								</Grid>
							</Grid>
						)}
					</React.Fragment>
				)}
			</div>
		);
	};

	const PoderesDropZone = ({
		formalDataFiles,
		files,
		setFormalDataFiles,
		callBack,
		getSignedUrl,
		loading,
		toggleLoading,
		loadingFiles,
		deleting,
		toggleDelete,
		deletingFiles,
		disabledFiles,
		toggleDisabledFiles
	}) => {
		const folder = 'poderes';
		const onDrop = callBack(async (uploadedFiles) => {
			toggleLoading({
				...loadingFiles,
				[`${folder}Loading`]: true
			});
			toggleDisabledFiles({
				estatutosDisabled  : true,
				actasDisabled      : true,
				poderesDisabled    : false,
				extrasDisabled     : true,
				planchetasDisabled : true
			});
			getSignedUrl(uploadedFiles, folder, async (response) => {
				const arrayPromise = await response;
				const acceptedFiles = arrayPromise.filter((i) => i);
				if (acceptedFiles.length > 0) {
					setFormalDataFiles({
						...formalDataFiles,
						poderes : [ ...files, ...acceptedFiles ]
					});
				} else {
					alert('Existio un problema subiendo el (los) documento(s), intente de nuevo');
				}
				toggleLoading({
					...loadingFiles,
					[`${folder}Loading`]: false
				});
				toggleDisabledFiles({
					estatutosDisabled  : false,
					actasDisabled      : false,
					poderesDisabled    : false,
					extrasDisabled     : false,
					planchetasDisabled : false
				});
			});
		});

		const { getRootProps, getInputProps } = useDropzone({
			accept   : 'application/pdf',
			onDrop,
			disabled : form.formalData.clientId === ''
		});

		const removeFile = async (file) => {
			toggleDelete({
				...deletingFiles,
				[`${folder}Deleting`]: true
			});
			deleteFile(file.name.replace('.pdf', ''), folder, form.formalData.clientId, (isDeleted) => {
				if (isDeleted) {
					const newFiles = files.filter((i) => i.file !== file);
					setFormalDataFiles({
						...formalDataFiles,
						poderes : newFiles
					});
				} else {
					alert('No se pudo borrar el archivo, intente de nuevo');
				}
				toggleDelete({
					...deletingFiles,
					[`${folder}Deleting`]: false
				});
			});
		};

		const fileList = files.map((item, index) => (
			<ListItem key={index} alignItems='center'>
				<ListItemIcon onClick={() => removeFile(item.file)}>
					<DeleteIcon />
				</ListItemIcon>
				<ListItemText className='text-justify' primary={item.file.path} />
			</ListItem>
		));

		return (
			<div className='flex flex-col min-h-128 h-full justify-around cursor-pointer'>
				{loading || deleting ? (
					<div className={`flex-col justify-around items-center w-full ${classes.center}`}>
						<Typography variant='h5' component='h3'>
							{loading ? 'Cargando Archivos...' : 'Borrando Archivo'}
						</Typography>
						<CircularProgress className={classes.progress} />
					</div>
				) : (
					<React.Fragment>
						{form.formalData.clientId !== '' && !disabledFiles.poderesDisabled ? (
							<div {...getRootProps()}>
								<input {...getInputProps()} />
								<Typography variant='h5' component='h3'>
									Poderes
								</Typography>
								<Typography component='p'>
									Puede arrastrar, o dar click para cargar los archivos
								</Typography>
							</div>
						) : (
							<React.Fragment>
								{disabledFiles.poderesDisabled && (
									<Typography variant='h5' component='h3'>
										Debe esperar que termine de subir los otros archivos
									</Typography>
								)}
								{form.formalData.clientId === '' && (
									<Typography variant='h5' component='h3'>
										Primero debe agregar el ID del Cliente
									</Typography>
								)}
							</React.Fragment>
						)}

						{files.length > 0 && (
							<Grid container spacing={2} className='mt-8'>
								<Grid item xs={12}>
									<Typography variant='h6' className={classes.title}>
										Archivos
									</Typography>
									<div className={classes.demo}>
										<List dense={true}>{fileList}</List>
									</div>
								</Grid>
							</Grid>
						)}
					</React.Fragment>
				)}
			</div>
		);
	};

	const ExtraDropZone = ({
		formalDataFiles,
		files,
		setFormalDataFiles,
		callBack,
		getSignedUrl,
		loading,
		toggleLoading,
		loadingFiles,
		deleting,
		toggleDelete,
		deletingFiles,
		disabledFiles,
		toggleDisabledFiles
	}) => {
		const folder = 'extras';
		const onDrop = callBack(async (uploadedFiles) => {
			toggleLoading({
				...loadingFiles,
				[`${folder}Loading`]: true
			});
			toggleDisabledFiles({
				estatutosDisabled  : true,
				actasDisabled      : true,
				poderesDisabled    : true,
				extrasDisabled     : false,
				planchetasDisabled : true
			});
			getSignedUrl(uploadedFiles, folder, async (response) => {
				const arrayPromise = await response;
				const acceptedFiles = arrayPromise.filter((i) => i);
				if (acceptedFiles.length > 0) {
					setFormalDataFiles({
						...formalDataFiles,
						extraPdfs : [ ...files, ...acceptedFiles ]
					});
				} else {
					alert('Existio un problema subiendo el (los) documento(s), intente de nuevo');
				}
				toggleLoading({
					...loadingFiles,
					[`${folder}Loading`]: false
				});
				toggleDisabledFiles({
					estatutosDisabled  : false,
					actasDisabled      : false,
					poderesDisabled    : false,
					extrasDisabled     : false,
					planchetasDisabled : false
				});
			});
		});

		const { getRootProps, getInputProps } = useDropzone({
			accept   : 'application/pdf',
			onDrop,
			disabled : form.formalData.clientId === ''
		});

		const removeFile = async (file) => {
			toggleDelete({
				...deletingFiles,
				[`${folder}Deleting`]: true
			});
			deleteFile(file.name.replace('.pdf', ''), folder, form.formalData.clientId, (isDeleted) => {
				if (isDeleted) {
					const newFiles = files.filter((i) => i.file !== file);
					setFormalDataFiles({
						...formalDataFiles,
						extraPdfs : newFiles
					});
				} else {
					alert('No se pudo borrar el archivo, intente de nuevo');
				}
				toggleDelete({
					...deletingFiles,
					[`${folder}Deleting`]: false
				});
			});
		};

		const fileList = files.map((item, index) => (
			<ListItem key={index} alignItems='center'>
				<ListItemIcon onClick={() => removeFile(item.file)}>
					<DeleteIcon />
				</ListItemIcon>
				<ListItemText className='text-justify' primary={item.file.path} />
			</ListItem>
		));

		return (
			<div className='flex flex-col min-h-128 h-full justify-around cursor-pointer'>
				{loading || deleting ? (
					<div className={`flex-col justify-around items-center w-full ${classes.center}`}>
						<Typography variant='h5' component='h3'>
							{loading ? 'Cargando Archivos...' : 'Borrando Archivo'}
						</Typography>
						<CircularProgress className={classes.progress} />
					</div>
				) : (
					<React.Fragment>
						{form.formalData.clientId !== '' && !disabledFiles.extrasDisabled ? (
							<div {...getRootProps()}>
								<input {...getInputProps()} />
								<Typography variant='h5' component='h3'>
									Otros Documentos
								</Typography>
								<Typography component='p'>
									Puede arrastrar, o dar click para cargar los archivos
								</Typography>
							</div>
						) : (
							<React.Fragment>
								{disabledFiles.extrasDisabled && (
									<Typography variant='h5' component='h3'>
										Debe esperar que termine de subir los otros archivos
									</Typography>
								)}
								{form.formalData.clientId === '' && (
									<Typography variant='h5' component='h3'>
										Primero debe agregar el ID del Cliente
									</Typography>
								)}
							</React.Fragment>
						)}

						{files.length > 0 && (
							<Grid container spacing={2} className='mt-8'>
								<Grid item xs={12}>
									<Typography variant='h6' className={classes.title}>
										Archivos
									</Typography>
									<div className={classes.demo}>
										<List dense={true}>{fileList}</List>
									</div>
								</Grid>
							</Grid>
						)}
					</React.Fragment>
				)}
			</div>
		);
	};

	const PlanchetaDropZone = ({
		formalDataFiles,
		files,
		setFormalDataFiles,
		callBack,
		getSignedUrl,
		loading,
		toggleLoading,
		loadingFiles,
		deleting,
		toggleDelete,
		deletingFiles,
		disabledFiles,
		toggleDisabledFiles
	}) => {
		const folder = 'planchetas';
		const onDrop = callBack(async (uploadedFiles) => {
			toggleLoading({
				...loadingFiles,
				[`${folder}Loading`]: true
			});
			toggleDisabledFiles({
				estatutosDisabled  : true,
				actasDisabled      : true,
				poderesDisabled    : true,
				extrasDisabled     : true,
				planchetasDisabled : false
			});
			getSignedUrl(uploadedFiles, `${folder}/${form.planta.id_establecimiento}`, async (response) => {
				const arrayPromise = await response;
				const acceptedFiles = arrayPromise.filter((i) => i);

				if (acceptedFiles.length > 0) {
					setFormalDataFiles({
						...formalDataFiles,
						planchetas : [ acceptedFiles[0] ]
					});
				} else {
					alert('Existio un problema subiendo el (los) documento(s), intente de nuevo');
				}
				toggleLoading({
					...loadingFiles,
					[`${folder}Loading`]: false
				});
				toggleDisabledFiles({
					estatutosDisabled  : false,
					actasDisabled      : false,
					poderesDisabled    : false,
					extrasDisabled     : false,
					planchetasDisabled : false
				});
			});
		});

		const { getRootProps, getInputProps } = useDropzone({
			accept   : 'application/pdf',
			onDrop,
			disabled : form.formalData.clientId === '' && form.planta.id_establecimiento === ''
		});

		const removeFile = async (file) => {
			toggleDelete({
				...deletingFiles,
				[`${folder}Deleting`]: true
			});
			deleteFile(
				file.name.replace('.pdf', ''),
				`${folder}/${form.planta.id_establecimiento}`,
				form.formalData.clientId,
				(isDeleted) => {
					if (isDeleted) {
						const newFiles = files.filter((i) => i.file !== file);
						setFormalDataFiles({
							...formalDataFiles,
							planchetas : newFiles
						});
					} else {
						alert('No se pudo borrar el archivo, intente de nuevo');
					}
					toggleDelete({
						...deletingFiles,
						[`${folder}Deleting`]: false
					});
				}
			);
		};

		const fileList = files.map((item, index) => (
			<ListItem key={index} alignItems='center'>
				<ListItemIcon onClick={() => removeFile(item.file)}>
					<DeleteIcon />
				</ListItemIcon>
				<ListItemText className='text-justify' primary={item.file.path} />
			</ListItem>
		));

		return (
			<div className='flex flex-col min-h-128 h-full justify-around cursor-pointer'>
				{loading || deleting ? (
					<div className={`flex-col justify-around items-center w-full ${classes.center}`}>
						<Typography variant='h5' component='h3'>
							{loading ? 'Cargando Archivos...' : 'Borrando Archivo'}
						</Typography>
						<CircularProgress className={classes.progress} />
					</div>
				) : (
					<React.Fragment>
						{form.formalData.clientId !== '' &&
						form.planta.id_establecimiento !== '' &&
						!disabledFiles.planchetasDisabled ? (
							<div {...getRootProps()}>
								<input {...getInputProps()} />
								<Typography variant='h5' component='h3'>
									Otros Documentos
								</Typography>
								<Typography component='p'>
									Puede arrastrar, o dar click para cargar los archivos
								</Typography>
							</div>
						) : (
							<React.Fragment>
								{form.formalData.clientId === '' && (
									<Typography variant='h5' component='h3'>
										Debe agregar el ID del Cliente
									</Typography>
								)}
								{form.planta.id_establecimiento === '' && (
									<Typography variant='h5' component='h3'>
										Debe agregar el ID del establecimiento
									</Typography>
								)}
								{disabledFiles.planchetasDisabled && (
									<Typography variant='h5' component='h3'>
										Debe esperar que termine de subir los otros archivos
									</Typography>
								)}
							</React.Fragment>
						)}

						{files.length > 0 && (
							<Grid container spacing={2} className='mt-8'>
								<Grid item xs={12}>
									<Typography variant='h6' className={classes.title}>
										Archivos
									</Typography>
									<div className={classes.demo}>
										<List dense={true}>{fileList}</List>
									</div>
								</Grid>
							</Grid>
						)}
					</React.Fragment>
				)}
			</div>
		);
	};

	const getSignedUrl = async (files, folder, callBack) => {
		const signedUrls = await files.map(async (file) => {
			const fileName = file.name.replace('.pdf', '');
			const fileType = file.type;
			const data = await SingS3(fileName, fileType, folder, form.formalData.clientId);
			if (data.success) {
				const upload = await uploadFile({ fileType, signedRequest: data.data.signedRequest, file });
				if (upload) {
					return {
						uploadData : data.data,
						file
					};
				} else {
					return false;
				}
			}
		});

		return callBack(Promise.all(signedUrls));
	};

	const addFormalDataAddress = (address) => {
		const newArray = [ ...addressFormalData, address ];
		setAddress(newArray);
		setForm(
			_.set({ ...form }, 'formalData.address', {
				partido       : '',
				localidad     : '',
				calleRuta     : '',
				nKm           : '',
				piso          : '',
				depto         : '',
				codigo_postal : '',
				type          : {
					label : 'Seleccione el tipo de domicilio',
					value : null
				}
			})
		);
	};

	const addFormalDataLegalRepresentative = (legalRepresentative) => {
		const newArray = [
			...legalRepresentativeFormalData,
			{
				...legalRepresentative,
				estatuto,
				actaDesignacion,
				poderes,
				extraPdfs
			}
		];
		setLegalRepresentative(newArray);
		setForm(
			_.set({ ...form }, 'formalData.legalRepresentative', {
				name            : '',
				dni             : '',
				position        : '',
				cuil            : '',
				estatuto        : [],
				actaDesignacion : [],
				poderes         : [],
				extraPdfs       : []
			})
		);
		setFormalDataFiles({
			...formalDataFiles,
			estatuto        : [],
			actaDesignacion : [],
			poderes         : [],
			extraPdfs       : []
		});
	};

	const addDataPlanta = (planta) => {
		const newArray = [ ...dataPlanta, planta ];
		setPlanta(newArray);
		setForm(
			_.set({ ...form }, 'planta', {
				id_establecimiento : '',
				address            : {
					partido       : '',
					localidad     : '',
					calleRuta     : '',
					nKm           : '',
					piso          : '',
					depto         : '',
					codigo_postal : ''
				},
				email              : '',
				phoneContacts      : '',
				innerContact       : {
					name     : '',
					lastName : '',
					phone    : '',
					email    : '',
					position : '',
					workArea : ''
				},
				govermentUsers     : {
					opds   : {
						user : '',
						pass : ''
					},
					ada    : {
						user : '',
						pass : ''
					},
					ina    : {
						user : '',
						pass : ''
					},
					acumar : {
						user : '',
						pass : ''
					}
				},
				mobiliary          : {
					orderNum            : '',
					partidaInmobiliaria : '',
					matricula           : '',
					circunscripcion     : '',
					seccion             : '',
					fraccion            : '',
					manzana             : '',
					parcela             : '',
					poligono            : '',
					propietario         : '',
					caracterUso         : '',
					documentacion       : '',
					observaciones       : ''
				}
			})
		);
	};

	const addPlantaPhoneContacts = (phoneContact) => {
		const newArray = [ ...phoneContactsPlanta, phoneContact ];
		setPhoneContacts(newArray);
		setForm(_.set({ ...form }, 'planta.phoneContacts', ''));
	};

	const addPlantaInnerContacts = (innerContact) => {
		const newArray = [ ...innerContactsPlanta, innerContact ];
		setInnerContacts(newArray);
		setForm(
			_.set({ ...form }, 'planta.innerContact', {
				name     : '',
				lastName : '',
				phone    : '',
				email    : '',
				position : '',
				workArea : ''
			})
		);
	};

	const addPlantaMobiliary = (mobiliary) => {
		const newArray = [ ...mobiliaryPlanta, { ...mobiliary, plancheta: planchetas } ];
		setMobiliary(newArray);
		setForm(
			_.set({ ...form }, 'planta.mobiliary', {
				orderNum            : '',
				partidaInmobiliaria : '',
				matricula           : '',
				circunscripcion     : '',
				seccion             : '',
				fraccion            : '',
				manzana             : '',
				parcela             : '',
				poligono            : '',
				propietario         : '',
				caracterUso         : '',
				documentacion       : '',
				observaciones       : '',
				plancheta           : ''
			})
		);
		setFormalDataFiles({
			...formalDataFiles,
			planchetas : []
		});
	};

	// console.log('addressFormalData', addressFormalData);
	// console.log('legalRepresentativeFormalData', legalRepresentativeFormalData);
	// console.log('dataPlanta', dataPlanta);
	// console.log('phoneContactsPlanta', phoneContactsPlanta);
	// console.log('innerContactsPlanta', innerContactsPlanta);
	// console.log('mobiliaryPlanta', mobiliaryPlanta);

	return (
		<FusePageCarded
			classes={{
				toolbar : 'p-0',
				header  : 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={
				form && (
					<div className='flex flex-1 w-full items-center justify-between'>
						<div className='flex flex-col items-start max-w-full'>
							<FuseAnimate animation='transition.slideRightIn' delay={300}>
								<Typography
									className='normal-case flex items-center sm:mb-12'
									component={Link}
									role='button'
									to='/apps/clients'
									color='inherit'
								>
									<Icon className='mr-4 text-20'>arrow_back</Icon>
									Clientes
								</Typography>
							</FuseAnimate>

							<div className='flex items-center max-w-full'>
								<div className='flex flex-col min-w-0'>
									<FuseAnimate animation='transition.slideLeftIn' delay={300}>
										<Typography className='text-16 sm:text-20 truncate'>
											{form.name ? form.name : 'Cliente Nuevo'}
										</Typography>
									</FuseAnimate>
									<FuseAnimate animation='transition.slideLeftIn' delay={300}>
										<Typography variant='caption'>Detalles del cliente</Typography>
									</FuseAnimate>
								</div>
							</div>
						</div>
						<FuseAnimate animation='transition.slideRightIn' delay={300}>
							<Button
								className='whitespace-no-wrap'
								variant='contained'
								disabled={!canBeSubmitted()}
								onClick={() => dispatch(Actions.saveClient(form))}
							>
								Guardar
							</Button>
						</FuseAnimate>
					</div>
				)
			}
			contentToolbar={
				<Tabs
					value={tabValue}
					onChange={handleChangeTab}
					indicatorColor='secondary'
					textColor='secondary'
					variant='scrollable'
					scrollButtons='auto'
					classes={{ root: 'w-full h-64' }}
				>
					<Tab className='h-64 normal-case' label='Datos Formales' />
					<Tab className='h-64 normal-case' label='Plantas' />
				</Tabs>
			}
			content={
				form && (
					<div className='p-16 sm:p-24 sm:pt-2 max-w-2xl'>
						{tabValue === 0 && (
							<div>
								<Tabs
									value={tabInnerFormal}
									onChange={(e, value) => handleChangeInnerTab(value, 'Formal')}
									indicatorColor='secondary'
									textColor='secondary'
									variant='scrollable'
									scrollButtons='auto'
									classes={{ root: 'w-full mb-16 pb-8' }}
								>
									<Tab className='h-64 normal-case' label='Datos Basicos' />
									<Tab className='h-64 normal-case' label='Domicilios' />
									<Tab className='h-64 normal-case' label='Representantes Legales' />
								</Tabs>
								{tabInnerFormal === 0 && (
									<React.Fragment>
										<TextField
											className='mt-8 mb-16'
											error={form.formalData.clientId === ''}
											required
											label='ID del Cliente'
											id='formalData.clientId'
											name='formalData.clientId'
											value={form.formalData.clientId}
											onChange={handleChange}
											variant='outlined'
											fullWidth
										/>

										<TextField
											className='mt-8 mb-16'
											error={form.formalData.clientName === ''}
											required
											label='Nombre del Cliente'
											id='formalData.clientName'
											name='formalData.clientName'
											value={form.formalData.clientName}
											onChange={handleChange}
											variant='outlined'
											fullWidth
										/>

										<TextField
											className='mt-8 mb-16'
											error={form.formalData.cuit === ''}
											required
											label='CUIT'
											placeholder='00-11223344-5'
											id='formalData.cuit'
											name='formalData.cuit'
											value={form.formalData.cuit}
											onChange={handleChange}
											variant='outlined'
											fullWidth
										/>
									</React.Fragment>
								)}
								{tabInnerFormal === 1 && (
									<React.Fragment>
										{addressFormalData.length > 0 && (
											<div className='flex justify-around items-center mb-16'>
												<FuseAnimate animation='transition.slideRightIn' delay={300}>
													<Button
														className='whitespace-no-wrap '
														variant='contained'
														onClick={() => console.log('ver domicilios')}
													>
														Ver domicilios agregados
													</Button>
												</FuseAnimate>
											</div>
										)}

										<div className='flex justify-around items-center'>
											<TextField
												className='mt-8 mb-16 mr-8'
												error={form.formalData.address.partido === ''}
												required
												label='Partido'
												id='formalData.address.partido'
												name='formalData.address.partido'
												value={form.formalData.address.partido}
												onChange={handleChange}
												variant='outlined'
											/>
											<TextField
												className='mt-8 mb-16 mr-8'
												error={form.formalData.address.localidad === ''}
												required
												label='Localidad'
												id='formalData.address.localidad'
												name='formalData.address.localidad'
												value={form.formalData.address.localidad}
												onChange={handleChange}
												variant='outlined'
											/>
											<TextField
												className='mt-8 mb-16 mr-8'
												error={form.formalData.address.calleRuta === ''}
												required
												label='Calle / Ruta'
												id='formalData.address.calleRuta'
												name='formalData.address.calleRuta'
												value={form.formalData.address.calleRuta}
												onChange={handleChange}
												variant='outlined'
											/>
										</div>
										<div className='flex justify-around items-center'>
											<TextField
												className='mt-8 mb-16 mr-8'
												error={form.formalData.address.nKm === ''}
												required
												label='N° / Km'
												id='formalData.address.nKm'
												name='formalData.address.nKm'
												value={form.formalData.address.nKm}
												onChange={handleChange}
												variant='outlined'
											/>

											<TextField
												className='mt-8 mb-16 mr-8'
												error={form.formalData.address.piso === ''}
												required
												label='Piso'
												id='formalData.address.piso'
												name='formalData.address.piso'
												value={form.formalData.address.piso}
												onChange={handleChange}
												variant='outlined'
											/>
											<TextField
												className='mt-8 mb-16 mr-8'
												error={form.formalData.address.depto === ''}
												required
												label='Departamento'
												id='formalData.address.depto'
												name='formalData.address.depto'
												value={form.formalData.address.depto}
												onChange={handleChange}
												variant='outlined'
											/>
										</div>
										<div className='flex justify-around items-center'>
											<TextField
												className='mt-8 mb-16 mr-8'
												error={form.formalData.address.codigo_postal === ''}
												required
												label='Codigo Postal'
												id='formalData.address.codigo_postal'
												name='formalData.address.codigo_postal'
												value={form.formalData.address.codigo_postal}
												onChange={handleChange}
												variant='outlined'
											/>

											<FuseChipSelect
												className='mt-8 mb-16 mr-8 w-360'
												value={form.formalData.address.type}
												onChange={(value) => handleChipChange(value, 'formalData.address.type')}
												placeholder='Seleccione el tipo de domicilio'
												textFieldProps={{
													label           : 'Domicilio',
													InputLabelProps : {
														shrink : true
													},
													variant         : 'outlined'
												}}
												options={[
													{ value: 'legal', label: 'Domicilio Legal' },
													{ value: 'registered', label: 'Domicilio Constituido' },
													{ value: 'additional', label: 'Otro Domicilio' }
												]}
											/>

											<FuseAnimate animation='transition.slideRightIn' delay={300}>
												<Button
													className='whitespace-no-wrap mt-8 mb-16 mr-8 h-56'
													variant='contained'
													disabled={!formalDataAddressSubmitted()}
													onClick={() => addFormalDataAddress(form.formalData.address)}
												>
													Crear Domicilio
												</Button>
											</FuseAnimate>
										</div>
									</React.Fragment>
								)}
								{tabInnerFormal === 2 && (
									<React.Fragment>
										{legalRepresentativeFormalData.length > 0 && (
											<div className='flex justify-around items-center mb-16'>
												<FuseAnimate animation='transition.slideRightIn' delay={300}>
													<Button
														className='whitespace-no-wrap '
														variant='contained'
														onClick={() => console.log('ver representantes')}
													>
														Ver representantes agregados
													</Button>
												</FuseAnimate>
											</div>
										)}
										<div className='flex justify-center items-center'>
											<TextField
												className='mt-8 mb-16 mr-8'
												error={form.formalData.legalRepresentative.name === ''}
												required
												label='Nombre'
												id='formalData.legalRepresentative.name'
												name='formalData.legalRepresentative.name'
												value={form.formalData.legalRepresentative.name}
												onChange={handleChange}
												variant='outlined'
											/>

											<TextField
												className='mt-8 mb-16 mr-8'
												error={form.formalData.legalRepresentative.dni === ''}
												required
												label='DNI'
												id='formalData.legalRepresentative.dni'
												name='formalData.legalRepresentative.dni'
												value={form.formalData.legalRepresentative.dni}
												onChange={handleChange}
												variant='outlined'
											/>

											<TextField
												className='mt-8 mb-16 mr-8'
												error={form.formalData.legalRepresentative.position === ''}
												required
												label='Cargo'
												id='formalData.legalRepresentative.position'
												name='formalData.legalRepresentative.position'
												value={form.formalData.legalRepresentative.position}
												onChange={handleChange}
												variant='outlined'
											/>

											<TextField
												className='mt-8 mb-16 mr-8'
												error={form.formalData.legalRepresentative.cuil === ''}
												required
												label='CUIL'
												placeholder='00-11223344-5'
												id='formalData.legalRepresentative.cuil'
												name='formalData.legalRepresentative.cuil'
												value={form.formalData.legalRepresentative.cuil}
												onChange={handleChange}
												variant='outlined'
											/>
											<FuseAnimate animation='transition.slideRightIn' delay={300}>
												<Button
													className='whitespace-no-wrap mt-8 mb-16 mr-8 h-56'
													variant='contained'
													disabled={!formalDataLegalRepresentativeSubmitted()}
													onClick={() =>
														addFormalDataLegalRepresentative(
															form.formalData.legalRepresentative
														)}
												>
													Guardar
												</Button>
											</FuseAnimate>
										</div>

										{/* <input
											accept='application/pdf'
											// className='hidden'
											id='button-file'
											name='formalData.legalRepresentative.estatuto'
											multiple
											type='file'
											onChange={handleUploadChange}
										/> */}

										<div className={classes.root}>
											<Grid container spacing={3}>
												<Grid item xs={6}>
													<Paper className={classes.paper}>
														<EstatutoDropZone
															formalDataFiles={formalDataFiles}
															files={estatuto}
															setFormalDataFiles={setFormalDataFiles}
															callBack={useCallback}
															getSignedUrl={getSignedUrl}
															loading={estatutosLoading}
															toggleLoading={toggleLoadingFiles}
															loadingFiles={loadingFiles}
															deleting={estatutosDeleting}
															toggleDelete={toggleDeleteFiles}
															deletingFiles={deletingFiles}
															toggleDisabledFiles={toggleDisabledFiles}
															disabledFiles={disabledFiles}
														/>
													</Paper>
												</Grid>
												<Grid item xs={6}>
													<Paper className={classes.paper}>
														<ActaDesignacionDropZone
															formalDataFiles={formalDataFiles}
															files={actaDesignacion}
															setFormalDataFiles={setFormalDataFiles}
															callBack={useCallback}
															getSignedUrl={getSignedUrl}
															loading={actasLoading}
															toggleLoading={toggleLoadingFiles}
															loadingFiles={loadingFiles}
															deleting={actasDeleting}
															toggleDelete={toggleDeleteFiles}
															deletingFiles={deletingFiles}
															toggleDisabledFiles={toggleDisabledFiles}
															disabledFiles={disabledFiles}
														/>
													</Paper>
												</Grid>
												<Grid item xs={6}>
													<Paper className={classes.paper}>
														<PoderesDropZone
															formalDataFiles={formalDataFiles}
															files={poderes}
															setFormalDataFiles={setFormalDataFiles}
															callBack={useCallback}
															getSignedUrl={getSignedUrl}
															loading={poderesLoading}
															toggleLoading={toggleLoadingFiles}
															loadingFiles={loadingFiles}
															deleting={poderesDeleting}
															toggleDelete={toggleDeleteFiles}
															deletingFiles={deletingFiles}
															toggleDisabledFiles={toggleDisabledFiles}
															disabledFiles={disabledFiles}
														/>
													</Paper>
												</Grid>
												<Grid item xs={6}>
													<Paper className={classes.paper}>
														<ExtraDropZone
															formalDataFiles={formalDataFiles}
															files={extraPdfs}
															setFormalDataFiles={setFormalDataFiles}
															callBack={useCallback}
															getSignedUrl={getSignedUrl}
															loading={extrasLoading}
															toggleLoading={toggleLoadingFiles}
															loadingFiles={loadingFiles}
															deleting={extrasDeleting}
															toggleDelete={toggleDeleteFiles}
															deletingFiles={deletingFiles}
															toggleDisabledFiles={toggleDisabledFiles}
															disabledFiles={disabledFiles}
														/>
													</Paper>
												</Grid>
											</Grid>
										</div>
									</React.Fragment>
								)}
							</div>
						)}
						{tabValue === 1 && (
							<React.Fragment>
								<Tabs
									value={tabInnerPlanta}
									onChange={(e, value) => handleChangeInnerTab(value, 'Planta')}
									indicatorColor='secondary'
									textColor='secondary'
									variant='scrollable'
									scrollButtons='auto'
									classes={{ root: 'w-full mb-16 pb-8' }}
								>
									<Tab className='h-64 normal-case' label='Datos Basicos' />
									<Tab className='h-64 normal-case' label='Contactos' />
									<Tab className='h-64 normal-case' label='Usuarios Gubernamentales' />
									<Tab className='h-64 normal-case' label='Inmuebles' />
								</Tabs>
								{tabInnerPlanta === 0 && (
									<React.Fragment>
										<TextField
											className='mt-8 mb-16 mr-8'
											error={form.planta.id_establecimiento === ''}
											required
											label='ID del Establecimiento'
											placeholder='1'
											id='planta.id_establecimiento'
											name='planta.id_establecimiento'
											value={form.planta.id_establecimiento}
											onChange={handleChange}
											variant='outlined'
											fullWidth
											InputProps={{
												startAdornment : (
													<InputAdornment position='start'>{`${form.formalData
														.clientId}`}</InputAdornment>
												)
											}}
										/>
										<div className='flex justify-around items-center'>
											<TextField
												className='mt-8 mb-16 mr-8'
												error={form.formalData.cuit === ''}
												required
												label='Partido'
												placeholder='00-11223344-5'
												id='formalData.cuit'
												name='formalData.cuit'
												value={form.formalData.cuit}
												onChange={handleChange}
												variant='outlined'
											/>
											<TextField
												className='mt-8 mb-16 mr-8'
												error={form.formalData.cuit === ''}
												required
												label='Localidad'
												placeholder='00-11223344-5'
												id='formalData.cuit'
												name='formalData.cuit'
												value={form.formalData.cuit}
												onChange={handleChange}
												variant='outlined'
											/>
											<TextField
												className='mt-8 mb-16 mr-8'
												error={form.formalData.cuit === ''}
												required
												label='Calle / Ruta'
												placeholder='00-11223344-5'
												id='formalData.cuit'
												name='formalData.cuit'
												value={form.formalData.cuit}
												onChange={handleChange}
												variant='outlined'
											/>

											<TextField
												className='mt-8 mb-16 mr-8'
												error={form.formalData.cuit === ''}
												required
												label='N° / Km'
												placeholder='00-11223344-5'
												id='formalData.cuit'
												name='formalData.cuit'
												value={form.formalData.cuit}
												onChange={handleChange}
												variant='outlined'
											/>
										</div>
										<div className='flex justify-around items-center'>
											<TextField
												className='mt-8 mb-16 mr-8'
												error={form.formalData.cuit === ''}
												required
												label='Piso'
												placeholder='00-11223344-5'
												id='formalData.cuit'
												name='formalData.cuit'
												value={form.formalData.cuit}
												onChange={handleChange}
												variant='outlined'
											/>
											<TextField
												className='mt-8 mb-16 mr-8'
												error={form.formalData.cuit === ''}
												required
												label='Departamento'
												placeholder='00-11223344-5'
												id='formalData.cuit'
												name='formalData.cuit'
												value={form.formalData.cuit}
												onChange={handleChange}
												variant='outlined'
											/>

											<TextField
												className='mt-8 mb-16 mr-8'
												error={form.formalData.cuit === ''}
												required
												label='Codigo Postal'
												placeholder='00-11223344-5'
												id='formalData.cuit'
												name='formalData.cuit'
												value={form.formalData.cuit}
												onChange={handleChange}
												variant='outlined'
											/>
										</div>
									</React.Fragment>
								)}
								{tabInnerPlanta === 1 && (
									<div>
										<TextField
											className='mt-8 mb-16 mr-8'
											label='Email de la planta'
											id='width'
											name='width'
											value={form.planta.email}
											onChange={handleChange}
											variant='outlined'
											fullWidth
										/>
										<div className='flex'>
											<TextField
												className='mt-8 mb-16 mr-8'
												label='Telefono de Contacto'
												id='width'
												name='width'
												value={form.planta.phoneContacts}
												onChange={handleChange}
												variant='outlined'
												fullWidth
											/>

											<FuseAnimate animation='transition.slideRightIn' delay={300}>
												<Button
													className='whitespace-no-wrap mt-8 mb-16 mr-8 h-56'
													variant='contained'
													disabled={!canBeSubmitted()}
													onClick={() => dispatch(Actions.saveClient(form))}
												>
													Guardar
												</Button>
											</FuseAnimate>
										</div>
										<div className='flex'>
											<TextField
												className='mt-8 mb-16 mr-8'
												label='Nombre del contacto interno'
												id='width'
												name='width'
												value={form.planta.innerContact.name}
												onChange={handleChange}
												variant='outlined'
												fullWidth
											/>
											<TextField
												className='mt-8 mb-16 mr-8'
												label='Apellido del contacto interno'
												id='width'
												name='width'
												value={form.planta.innerContact.lastName}
												onChange={handleChange}
												variant='outlined'
												fullWidth
											/>
											<TextField
												className='mt-8 mb-16 mr-8'
												label='Telefono del Contacto interno'
												id='width'
												name='width'
												value={form.planta.innerContact.phone}
												onChange={handleChange}
												variant='outlined'
												fullWidth
											/>
										</div>
										<div className='flex'>
											<TextField
												className='mt-8 mb-16 mr-8'
												label='Email del contacto'
												id='width'
												name='width'
												value={form.planta.innerContact.email}
												onChange={handleChange}
												variant='outlined'
												fullWidth
											/>

											<FuseAnimate animation='transition.slideRightIn' delay={300}>
												<Button
													className='whitespace-no-wrap mt-8 mb-16 mr-8 h-56'
													variant='contained'
													disabled={!canBeSubmitted()}
													onClick={() => dispatch(Actions.saveClient(form))}
												>
													Guardar
												</Button>
											</FuseAnimate>
										</div>
										<div className='flex'>
											<TextField
												className='mt-8 mb-16 mr-8'
												label='Cargo'
												id='width'
												name='width'
												value={form.planta.innerContact.position}
												onChange={handleChange}
												variant='outlined'
												fullWidth
											/>
											<TextField
												className='mt-8 mb-16 mr-8'
												label='Area'
												id='width'
												name='width'
												value={form.planta.innerContact.workArea}
												onChange={handleChange}
												variant='outlined'
												fullWidth
											/>
										</div>
									</div>
								)}
								{tabInnerPlanta === 2 && (
									<div>
										<FormGroup row>
											<FormControlLabel
												control={
													<Checkbox
														checked={opds}
														onChange={() => {
															toggleCheckBox({
																...checkBox,
																opds : !opds
															});
														}}
														value='gola'
													/>
												}
												label='Tiene cuenta OPDS'
											/>

											<FormControlLabel
												control={
													<Checkbox
														checked={ada}
														onChange={() => {
															toggleCheckBox({
																...checkBox,
																ada : !ada
															});
														}}
														value='gola'
													/>
												}
												label='Tiene cuenta ADA'
											/>

											<FormControlLabel
												control={
													<Checkbox
														checked={ina}
														onChange={() => {
															toggleCheckBox({
																...checkBox,
																ina : !ina
															});
														}}
														value='gola'
													/>
												}
												label='Tiene cuenta INA'
											/>

											<FormControlLabel
												control={
													<Checkbox
														checked={acumar}
														onChange={() => {
															toggleCheckBox({
																...checkBox,
																acumar : !acumar
															});
														}}
														value='gola'
													/>
												}
												label='Tiene cuenta ACUMAR'
											/>
										</FormGroup>
										{opds && (
											<div className='flex'>
												<TextField
													className='mt-8 mb-16 mr-8'
													label='Usuario (OPDS)'
													id='width'
													name='width'
													value={form.planta.govermentUsers.opds.user}
													onChange={handleChange}
													variant='outlined'
													fullWidth
												/>

												<TextField
													className='mt-8 mb-16 mr-8'
													label='Clave (OPDS)'
													id='height'
													name='height'
													value={form.planta.govermentUsers.opds.pass}
													onChange={handleChange}
													variant='outlined'
													fullWidth
												/>
											</div>
										)}
										{ada && (
											<div className='flex'>
												<TextField
													className='mt-8 mb-16 mr-8'
													label='Usuario (ADA)'
													id='width'
													name='width'
													value={form.planta.govermentUsers.ada.user}
													onChange={handleChange}
													variant='outlined'
													fullWidth
												/>

												<TextField
													className='mt-8 mb-16 mr-8'
													label='Clave (ADA)'
													id='height'
													name='height'
													value={form.planta.govermentUsers.ada.pass}
													onChange={handleChange}
													variant='outlined'
													fullWidth
												/>
											</div>
										)}
										{ina && (
											<div className='flex'>
												<TextField
													className='mt-8 mb-16 mr-8'
													label='Usuario (INA)'
													id='width'
													name='width'
													value={form.planta.govermentUsers.ina.user}
													onChange={handleChange}
													variant='outlined'
													fullWidth
												/>

												<TextField
													className='mt-8 mb-16 mr-8'
													label='Clave (INA)'
													id='height'
													name='height'
													value={form.planta.govermentUsers.ina.pass}
													onChange={handleChange}
													variant='outlined'
													fullWidth
												/>
											</div>
										)}
										{acumar && (
											<div className='flex'>
												<TextField
													className='mt-8 mb-16 mr-8'
													label='Usuario (ACUMAR)'
													id='width'
													name='width'
													value={form.planta.govermentUsers.acumar.user}
													onChange={handleChange}
													variant='outlined'
													fullWidth
												/>

												<TextField
													className='mt-8 mb-16 mr-8'
													label='Clave (ACUMAR)'
													id='height'
													name='height'
													value={form.planta.govermentUsers.acumar.pass}
													onChange={handleChange}
													variant='outlined'
													fullWidth
												/>
											</div>
										)}
									</div>
								)}
								{tabInnerPlanta === 3 && (
									<div>
										<div className='flex flex-row justify-around items-center mb-16'>
											<FuseAnimate animation='transition.slideRightIn' delay={300}>
												<Button
													className='whitespace-no-wrap'
													variant='contained'
													disabled={!plantaMobiliarySubmitted()}
													onClick={() => addPlantaMobiliary(form.planta.mobiliary)}
												>
													Crear Inmueble
												</Button>
											</FuseAnimate>
											{mobiliaryPlanta.length > 0 && (
												<FuseAnimate animation='transition.slideRightIn' delay={300}>
													<Button
														className='whitespace-no-wrap '
														variant='contained'
														onClick={() => console.log('ver inmuebles')}
													>
														Ver inmuebles agregados
													</Button>
												</FuseAnimate>
											)}
										</div>
										<div className='flex'>
											<TextField
												className='mt-8 mb-16 mr-8'
												label='Numero de Orden'
												id='planta.mobiliary.orderNum'
												name='planta.mobiliary.orderNum'
												value={form.planta.mobiliary.orderNum}
												onChange={handleChange}
												variant='outlined'
												fullWidth
											/>

											<TextField
												className='mt-8 mb-16 mr-8'
												label='Partida Inmobiliara Provincial'
												id='planta.mobiliary.partidaInmobiliaria'
												name='planta.mobiliary.partidaInmobiliaria'
												value={form.planta.mobiliary.partidaInmobiliaria}
												onChange={handleChange}
												variant='outlined'
												fullWidth
											/>

											<TextField
												className='mt-8 mb-16 mr-8'
												label='Matricula en registro de la propiedad'
												id='planta.mobiliary.matricula'
												name='planta.mobiliary.matricula'
												value={form.planta.mobiliary.matricula}
												onChange={handleChange}
												variant='outlined'
												fullWidth
											/>
										</div>
										<div className='flex'>
											<TextField
												className='mt-8 mb-16 mr-8'
												label='CIRCUNSCRICIÓN'
												id='planta.mobiliary.circunscripcion'
												name='planta.mobiliary.circunscripcion'
												value={form.planta.mobiliary.circunscripcion}
												onChange={handleChange}
												variant='outlined'
												fullWidth
											/>

											<TextField
												className='mt-8 mb-16 mr-8'
												label='SECCION'
												id='planta.mobiliary.seccion'
												name='planta.mobiliary.seccion'
												value={form.planta.mobiliary.seccion}
												onChange={handleChange}
												variant='outlined'
												fullWidth
											/>

											<TextField
												className='mt-8 mb-16 mr-8'
												label='FRACCION'
												id='planta.mobiliary.fraccion'
												name='planta.mobiliary.fraccion'
												value={form.planta.mobiliary.fraccion}
												onChange={handleChange}
												variant='outlined'
												fullWidth
											/>
										</div>
										<div className='flex'>
											<TextField
												className='mt-8 mb-16 mr-8'
												label='MANZANA'
												id='planta.mobiliary.manzana'
												name='planta.mobiliary.manzana'
												value={form.planta.mobiliary.manzana}
												onChange={handleChange}
												variant='outlined'
												fullWidth
											/>

											<TextField
												className='mt-8 mb-16 mr-8'
												label='PARCELA'
												id='planta.mobiliary.parcela'
												name='planta.mobiliary.parcela'
												value={form.planta.mobiliary.parcela}
												onChange={handleChange}
												variant='outlined'
												fullWidth
											/>

											<TextField
												className='mt-8 mb-16 mr-8'
												label='POLIGONO'
												id='planta.mobiliary.poligono'
												name='planta.mobiliary.poligono'
												value={form.planta.mobiliary.poligono}
												onChange={handleChange}
												variant='outlined'
												fullWidth
											/>
										</div>
										<div className='flex'>
											<TextField
												className='mt-8 mb-16 mr-8'
												label='PROPIETARIO'
												id='planta.mobiliary.propietario'
												name='planta.mobiliary.propietario'
												value={form.planta.mobiliary.propietario}
												onChange={handleChange}
												variant='outlined'
												fullWidth
											/>

											<TextField
												className='mt-8 mb-16 mr-8'
												label='CARACTER USO DE SUELO'
												id='planta.mobiliary.caracterUso'
												name='planta.mobiliary.caracterUso'
												value={form.planta.mobiliary.caracterUso}
												onChange={handleChange}
												variant='outlined'
												fullWidth
											/>

											<TextField
												className='mt-8 mb-16 mr-8'
												label='TIENE DOCUMENTACIÓN'
												id='planta.mobiliary.documentacion'
												name='planta.mobiliary.documentacion'
												value={form.planta.mobiliary.documentacion}
												onChange={handleChange}
												variant='outlined'
												fullWidth
											/>
										</div>
										<div className={classes.root}>
											<Grid container spacing={3}>
												<Grid item xs={12}>
													<Paper className={classes.paper}>
														<PlanchetaDropZone
															formalDataFiles={formalDataFiles}
															files={planchetas}
															setFormalDataFiles={setFormalDataFiles}
															callBack={useCallback}
															getSignedUrl={getSignedUrl}
															loading={planchetasLoading}
															toggleLoading={toggleLoadingFiles}
															loadingFiles={loadingFiles}
															deleting={planchetasDeleting}
															toggleDelete={toggleDeleteFiles}
															deletingFiles={deletingFiles}
															toggleDisabledFiles={toggleDisabledFiles}
															disabledFiles={disabledFiles}
														/>
													</Paper>
												</Grid>
											</Grid>
										</div>

										<TextField
											className='mt-8 mb-16'
											id='planta.mobiliary.observaciones'
											name='planta.mobiliary.observaciones'
											onChange={handleChange}
											label='OBSERVACIONES'
											type='text'
											value={form.planta.mobiliary.observaciones}
											multiline
											rows={5}
											variant='outlined'
											fullWidth
										/>
									</div>
								)}
							</React.Fragment>
						)}
					</div>
				)
			}
			innerScroll
		/>
	);
};

export default withReducer('clients', reducer)(Client);
