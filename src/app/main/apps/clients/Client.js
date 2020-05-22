import React, { useEffect, useState, useCallback } from 'react';
import {
	Button,
	Tab,
	Tabs,
	TextField,
	// InputAdornment,
	Icon,
	Typography,
	Checkbox,
	FormGroup,
	FormControlLabel,
	Grid,
	Paper,
	Dialog,
	DialogActions,
	DialogContent,
	Toolbar,
	AppBar,
	IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate, FusePageCarded, FuseChipSelect } from '@fuse';
import { useForm } from '@fuse/hooks';
import { Link } from 'react-router-dom';
import _ from '@lodash';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import ShowInfoDialog from './ShowInfoDialog';
import { isEmail, capitalize, isNaturalPositiveNumber, isValidDecimalNumber } from 'utils';
import NumberFormat from 'react-number-format';
import DropZone from './DropZone';

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
	const [ itsLoaded, toggleLoadedClient ] = useState(false);
	const { form, handleChange, setForm } = useForm(null);

	const params = props.match.params;
	const { clientId } = params;
	const isNew = clientId.includes('new');

	const [ formalDataFiles, setFormalDataFiles ] = useState({
		estatuto         : [],
		actaDesignacion  : [],
		poderes          : [],
		extraPdfs        : [],
		planchetas       : [],
		dniDocument      : [],
		documentacionUso : []
	});

	const [ loadingFiles, toggleLoadingFiles ] = useState({
		estatutosLoading        : false,
		actasLoading            : false,
		poderesLoading          : false,
		extrasLoading           : false,
		planchetasLoading       : false,
		dniDocumentLoading      : false,
		documentacionUsoLoading : false
	});

	const [ deletingFiles, toggleDeleteFiles ] = useState({
		estatutosDeleting        : false,
		actasDeleting            : false,
		poderesDeleting          : false,
		extrasDeleting           : false,
		planchetasDeleting       : false,
		dniDocumentDeleting      : false,
		documentacionUsoDeleting : false
	});

	const [ disabledFiles, toggleDisabledFiles ] = useState({
		estatutosDisabled        : false,
		actasDisabled            : false,
		poderesDisabled          : false,
		extrasDisabled           : false,
		planchetasDisabled       : false,
		dniDocumentDisabled      : false,
		documentacionUsoDisabled : false
	});

	const [ checkBox, toggleCheckBox ] = useState({
		opds   : false,
		ada    : false,
		ina    : false,
		acumar : false
	});

	const [ checkBoxMobiliary, toggleCheckBoxMobiliary ] = useState({
		fraccion         : false,
		manzana          : false,
		parcela          : false,
		poligono         : false,
		propietario      : false,
		matricula        : false,
		observaciones    : false,
		superficie       : false,
		documentacionUso : false
	});

	const [ addressFormalData, setAddress ] = useState([]);
	const [ legalRepresentativeFormalData, setLegalRepresentative ] = useState([]);
	const [ dataPlanta, setPlanta ] = useState([]);
	const [ phoneContactsPlanta, setPhoneContacts ] = useState([]);
	const [ innerContactsPlanta, setInnerContacts ] = useState([]);
	const [ innerContactsEmailPlanta, setInnerContactsEmail ] = useState([]);
	const [ mobiliaryPlanta, setMobiliary ] = useState([]);

	const [ showModal, closeModal ] = useState(false);
	const [ showMobiliaryModal, closeMobiliaryModal ] = useState(false);

	const [ dataModal, setDataModal ] = useState({
		dataTable : [],
		typeTable : ''
	});

	const [ dataEdit, setDataEdit ] = useState({
		type : null,
		data : null
	});

	const { opds, ada, ina, acumar } = checkBox;

	const {
		estatuto,
		actaDesignacion,
		poderes,
		extraPdfs,
		planchetas,
		dniDocument,
		documentacionUso
	} = formalDataFiles;

	const {
		estatutosLoading,
		actasLoading,
		poderesLoading,
		extrasLoading,
		planchetasLoading,
		dniDocumentLoading,
		documentacionUsoLoading
	} = loadingFiles;

	const {
		estatutosDeleting,
		actasDeleting,
		poderesDeleting,
		extrasDeleting,
		planchetasDeleting,
		dniDocumentDeleting,
		documentacionUsoDeleting
	} = deletingFiles;

	const { dataTable, typeTable } = dataModal;

	const { type, data } = dataEdit;

	useEffect(
		() => {
			function updateClientState() {
				const params = props.match.params;
				const { clientId } = params;

				if (clientId === 'new') {
					dispatch(Actions.newClient());
				} else {
					const id = params.clientId;
					dispatch(Actions.getClient(id));
				}
			}

			updateClientState();
		},
		[ dispatch, props.match.params ]
	);

	useEffect(
		() => {
			if ((client && !form) || (client && form && client.id !== form.id)) {
				if (isNew) {
					setForm(client);
				} else {
					let editedClient = client;
					setAddress(editedClient.formalData.address);
					setLegalRepresentative(editedClient.formalData.legalRepresentative);
					setPlanta(editedClient.planta);

					editedClient.formalData.address = {
						calleRuta     : '',
						nKm           : '',
						piso          : '',
						depto         : '',
						localidad     : '',
						codigo_postal : '',
						partido       : '',
						provincia     : '',
						type          : {
							label : 'Seleccione el tipo de domicilio',
							value : null
						}
					};

					editedClient.formalData.legalRepresentative = {
						first_name      : '',
						last_name       : '',
						dni             : '',
						position        : '',
						cuil            : '',
						estatuto        : [],
						actaDesignacion : [],
						poderes         : [],
						extraPdfs       : [],
						dniDocument     : []
					};

					editedClient.planta = {
						address        : {
							calleRuta     : '',
							nKm           : '',
							piso          : '',
							depto         : '',
							localidad     : '',
							codigo_postal : '',
							partido       : '',
							provincia     : ''
						},
						email          : '',
						phoneContacts  : '',
						innerContact   : {
							name     : '',
							lastName : '',
							phone    : '',
							email    : '',
							position : '',
							workArea : ''
						},
						govermentUsers : {
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
						mobiliary      : {
							partidaInmobiliaria : '',
							matricula           : '',
							circunscripcion     : '',
							seccion             : '',
							plancheta           : '',
							fraccion            : '',
							manzana             : '',
							parcela             : '',
							poligono            : '',
							propietario         : '',
							caracterUso         : '',
							documentacion       : 'NO',
							observaciones       : '',
							superficie          : '',
							documentacionUso    : ''
						}
					};

					setForm(editedClient);
				}
				toggleLoadedClient(true);
			}
		},
		[ form, client, setForm, isNew ]
	);

	useEffect(
		() => {
			if (type && data) {
				switch (type) {
					case 'addressFormalData':
						setAddress(data);
						break;
					case 'legalRepresentativeFormalData':
						setLegalRepresentative(data);
						break;
					case 'dataPlanta':
						setPlanta(data);
						break;
					case 'phoneContactsPlanta':
						const dataModifyPhone = data.map((i) => i.phone);
						setDataModal({
							dataTable : [],
							typeTable : ''
						});
						setPhoneContacts(dataModifyPhone);
						setTimeout(() => {
							setDataModal({
								dataTable : dataModifyPhone,
								typeTable : 'phoneContactsPlanta'
							});
						}, 100);
						break;
					case 'innerContactsPlanta':
						setInnerContacts(data);
						break;
					case 'innerContactsEmailPlanta':
						const dataModifyEmail = data.map((i) => i.email);
						setDataModal({
							dataTable : [],
							typeTable : ''
						});
						setInnerContactsEmail(dataModifyEmail);
						setTimeout(() => {
							setDataModal({
								dataTable : dataModifyEmail,
								typeTable : 'innerContactsEmailPlanta'
							});
						}, 100);
						break;
					case 'mobiliaryPlanta':
						setMobiliary(data);
						break;
					default:
						break;
				}

				setDataEdit({
					type : null,
					data : null
				});
			}
		},
		[ type, data ]
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
		let isSubmitted = false;
		const { clientId, clientName, cuit } = form.formalData;
		const addressLegalValid = itsLoaded ? addressFormalData.filter((i) => i.type === 'legal') : [];
		const addressRegisteredValid = itsLoaded ? addressFormalData.filter((i) => i.type === 'registered') : [];

		if (
			legalRepresentativeFormalData.length > 0 &&
			dataPlanta.length > 0 &&
			addressLegalValid.length > 0 &&
			addressRegisteredValid.length > 0 &&
			clientId.toString().length > 0 &&
			clientName.toString().length > 0 &&
			cuit.toString().length > 0
		) {
			isSubmitted = true;
		}

		return isSubmitted;
	};

	const formalDataAddressSubmitted = () => {
		const { partido, localidad, calleRuta, nKm, codigo_postal, type, provincia } = form.formalData.address;
		let isSubmitted = false;
		if (
			partido.toString().length > 0 &&
			localidad.toString().length > 0 &&
			calleRuta.toString().length > 0 &&
			nKm.toString().length > 0 &&
			codigo_postal.toString().length > 0 &&
			provincia.toString().length > 0 &&
			type.value
		) {
			isSubmitted = true;
		}

		return isSubmitted;
	};

	const formalDataLegalRepresentativeSubmitted = () => {
		const { first_name, dni, last_name, position, cuil } = form.formalData.legalRepresentative;
		let isSubmitted = false;
		if (
			first_name.length > 0 &&
			last_name.length > 0 &&
			position.length > 0 &&
			cuil.replace(' ', '').length > 12 &&
			dni.replace(' ', '').length > 9
			// estatuto.length > 0 &&
			// actaDesignacion.length > 0 &&
			// poderes.length > 0 &&
			// extraPdfs.length > 0
		) {
			isSubmitted = true;
		}

		return isSubmitted;
	};

	const plantaSubmitted = () => {
		let isSubmitted = false;
		const { address, email } = form.planta;
		if (
			address.partido.toString().length > 0 &&
			address.localidad.toString().length > 0 &&
			address.calleRuta.toString().length > 0 &&
			address.nKm.toString().length > 0 &&
			address.codigo_postal.toString().length > 0 &&
			email.toString().length > 0 &&
			phoneContactsPlanta.length > 0 &&
			innerContactsPlanta.length > 0 &&
			mobiliaryPlanta.length > 0
		) {
			let isSubmitted = true;
			return isSubmitted;
		}

		return isSubmitted;
	};

	const plantaPhoneContactsSubmitted = () => {
		let isSubmitted = false;
		if (form.planta.phoneContacts.length > 0) {
			isSubmitted = true;
		}

		return isSubmitted;
	};

	const plantaInnerContactEmailSubmitted = () => {
		let isSubmitted = false;
		if (form.planta.innerContact.email.length > 0 && isEmail(form.planta.innerContact.email)) {
			isSubmitted = true;
		}

		return isSubmitted;
	};

	const plantaInnerContactsSubmitted = () => {
		const { name, lastName, phone, position, workArea } = form.planta.innerContact;
		let isSubmitted = false;
		if (
			name.toString().length > 0 &&
			lastName.toString().length > 0 &&
			phone.toString().length > 0 &&
			innerContactsEmailPlanta.length > 0 &&
			position.toString().length > 0 &&
			workArea.toString().length > 0
		) {
			isSubmitted = true;
		}

		return isSubmitted;
	};

	const plantaMobiliarySubmitted = () => {
		const { partidaInmobiliaria, circunscripcion, seccion, caracterUso } = form.planta.mobiliary;
		let isSubmitted = false;
		if (
			partidaInmobiliaria.toString().length > 0 &&
			circunscripcion.toString().length > 0 &&
			seccion.toString().length > 0 &&
			caracterUso.toString().length > 0 &&
			planchetas.length > 0
		) {
			isSubmitted = true;
		}

		_.forEach(checkBoxMobiliary, (value, key) => {
			if (value && !form.planta.mobiliary[key] && key !== 'documentacionUso') {
				isSubmitted = false;
			}
		});

		if (checkBoxMobiliary.superficie && !isValidDecimalNumber(form.planta.mobiliary.superficie)) {
			isSubmitted = false;
		}

		if (checkBoxMobiliary.documentacionUso && documentacionUso.length === 0) {
			isSubmitted = false;
		}

		return isSubmitted;
	};

	const addFormalDataAddress = (address) => {
		const newArray = [
			...addressFormalData,
			{
				...address,
				type : address.type.value
			}
		];
		setAddress(newArray);
		setForm(
			_.set({ ...form }, 'formalData.address', {
				calleRuta     : '',
				nKm           : '',
				piso          : '',
				depto         : '',
				localidad     : '',
				codigo_postal : '',
				partido       : '',
				provincia     : '',
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
				estatuto        : estatuto.map((i) => {
					return { url: i.url, name: i.fileName, path: i.path };
				}),
				actaDesignacion : actaDesignacion.map((i) => {
					return { url: i.url, name: i.fileName, path: i.path };
				}),
				poderes         : poderes.map((i) => {
					return { url: i.url, name: i.fileName, path: i.path };
				}),
				extraPdfs       : extraPdfs.map((i) => {
					return { url: i.url, name: i.fileName, path: i.path };
				}),
				dniDocument     : dniDocument.map((i) => {
					return {
						url  : i.url,
						name : i.fileName,
						path : i.path
					};
				})
			}
		];

		setLegalRepresentative(newArray);
		setForm(
			_.set({ ...form }, 'formalData.legalRepresentative', {
				first_name      : '',
				last_name       : '',
				dni             : '',
				position        : '',
				cuil            : '',
				estatuto        : [],
				actaDesignacion : [],
				poderes         : [],
				extraPdfs       : [],
				dniDocument     : []
			})
		);
		setFormalDataFiles({
			...formalDataFiles,
			estatuto        : [],
			actaDesignacion : [],
			poderes         : [],
			extraPdfs       : [],
			dniDocument     : []
		});
	};

	const addDataPlanta = (planta) => {
		if (!opds) {
			delete planta.govermentUsers.opds;
		}
		if (!ada) {
			delete planta.govermentUsers.ada;
		}
		if (!ina) {
			delete planta.govermentUsers.ina;
		}
		if (!acumar) {
			delete planta.govermentUsers.acumar;
		}

		const newArray = [
			...dataPlanta,
			{
				...planta,
				id_establecimiento :
					dataPlanta.length > 0
						? `${form.formalData.clientId}-${dataPlanta.length + 1}`
						: form.formalData.clientId,
				innerContact       : innerContactsPlanta,
				phoneContacts      : phoneContactsPlanta,
				mobiliary          : mobiliaryPlanta
			}
		];

		if (newArray.length > 1) {
			newArray[0].id_establecimiento = `${form.formalData.clientId}-1`;
		}

		setPlanta(newArray);
		setForm(
			_.set({ ...form }, 'planta', {
				address        : {
					calleRuta     : '',
					nKm           : '',
					piso          : '',
					depto         : '',
					localidad     : '',
					codigo_postal : '',
					partido       : '',
					provincia     : ''
				},
				email          : '',
				phoneContacts  : '',
				innerContact   : {
					name     : '',
					lastName : '',
					phone    : '',
					email    : '',
					position : '',
					workArea : ''
				},
				govermentUsers : {
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
				mobiliary      : {
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
					documentacion       : 'NO',
					observaciones       : '',
					superficie          : ''
				}
			})
		);
		toggleCheckBox({
			opds   : false,
			ada    : false,
			ina    : false,
			acumar : false
		});

		setPhoneContacts([]);
		setInnerContacts([]);
		setMobiliary([]);
	};

	const addPlantaPhoneContacts = (phoneContact) => {
		const newArray = [ ...phoneContactsPlanta, phoneContact ];
		setPhoneContacts(newArray);
		setForm(_.set({ ...form }, 'planta.phoneContacts', ''));
	};

	const addPlantaInnerContacts = (innerContact) => {
		const newArray = [
			...innerContactsPlanta,
			{
				...innerContact,
				email : innerContactsEmailPlanta
			}
		];
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
		setInnerContactsEmail([]);
	};

	const addPlantaInnerContactsEmail = (email) => {
		const newArray = [ ...innerContactsEmailPlanta, email ];
		setInnerContactsEmail(newArray);
		setForm(_.set({ ...form }, 'planta.innerContact.email', ''));
	};

	const addPlantaMobiliary = (mobiliary) => {
		const newArray = [
			...mobiliaryPlanta,
			{
				...mobiliary,
				plancheta        : { url: planchetas[0].url, name: planchetas[0].fileName },
				documentacionUso : documentacionUso[0]
					? { url: documentacionUso[0].url, name: documentacionUso[0].fileName }
					: null
			}
		];
		setMobiliary(newArray);
		setForm(
			_.set({ ...form }, 'planta.mobiliary', {
				partidaInmobiliaria : '',
				matricula           : '',
				circunscripcion     : '',
				seccion             : '',
				plancheta           : '',
				fraccion            : '',
				manzana             : '',
				parcela             : '',
				poligono            : '',
				propietario         : '',
				caracterUso         : '',
				documentacion       : 'NO',
				observaciones       : '',
				superficie          : '',
				documentacionUso    : ''
			})
		);
		setFormalDataFiles({
			...formalDataFiles,
			planchetas       : [],
			documentacionUso : []
		});

		toggleCheckBoxMobiliary({
			fraccion         : false,
			manzana          : false,
			parcela          : false,
			poligono         : false,
			propietario      : false,
			matricula        : false,
			observaciones    : false,
			superficie       : false,
			documentacionUso : false
		});
	};

	const saveClientData = (form) => {
		const body = {
			...form.formalData,
			address             : addressFormalData.map((i) => {
				if (i.hasOwnProperty('tableData')) {
					delete i.tableData;
				}
				return i;
			}),
			legalRepresentative : legalRepresentativeFormalData.map((i) => {
				if (i.hasOwnProperty('tableData')) {
					delete i.tableData;
				}
				return {
					...i,
					dniDocument     : i.dniDocument.length > 0 ? i.dniDocument[0].url : null,
					estatuto        : i.estatuto.map((es) => es.url),
					actaDesignacion : i.actaDesignacion.map((ac) => ac.url),
					poderes         : i.poderes.map((power) => power.url),
					extraPdfs       : i.extraPdfs.map((extra) => extra.url)
				};
			}),
			planta              : dataPlanta.map((i) => {
				if (i.hasOwnProperty('tableData')) {
					delete i.tableData;
				}
				return {
					...i,
					phoneContacts : i.phoneContacts.map((p) => {
						if (i.hasOwnProperty('tableData')) {
							delete i.tableData;
						}
						return p;
					}),
					innerContact  : i.innerContact.map((ic) => {
						if (ic.hasOwnProperty('tableData')) {
							delete ic.tableData;
						}
						return ic;
					}),
					mobiliary     : i.mobiliary.map((m) => {
						if (m.hasOwnProperty('tableData')) {
							delete m.tableData;
						}
						return {
							...m,
							superficie       :
								m.superficie.length > 0 ? parseFloat(m.superficie.replace(',', '.')) : null,
							plancheta        : _.isArray(m.plancheta) ? m.plancheta[0].url : m.plancheta.url,
							documentacionUso : _.isArray(m.documentacionUso)
								? m.documentacionUso[0].url
								: m.documentacionUso && m.documentacionUso.hasOwnProperty('url')
									? m.documentacionUso.url
									: null,
							documentacion    : _.isArray(m.documentacionUso)
								? 'SI'
								: m.documentacionUso && m.documentacionUso.hasOwnProperty('url') ? 'SI' : 'NO'
						};
					})
				};
			})
		};
		console.log(body);
		if (isNew) {
			dispatch(Actions.saveClient(body, props.history));
		} else {
			dispatch(Actions.updateClient(body, params.clientId, props.history));
		}
	};

	const seeModalData = (data, type) => {
		setDataModal({
			dataTable : data,
			typeTable : type
		});

		closeModal(true);
	};

	const saveFieldsMobiliary = (name, value) => {
		const options = {};
		toggleCheckBoxMobiliary({
			...checkBoxMobiliary,
			[name] : value
		});

		if (value) {
			options[name] = '';
			setForm(
				_.set({ ...form }, 'planta.mobiliary', {
					...form.planta.mobiliary,
					...options
				})
			);
		}
	};

	const closeModalMobiliary = () => {
		closeMobiliaryModal(!showMobiliaryModal);
	};

	return (
		<React.Fragment>
			{itsLoaded && (
				<React.Fragment>
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
														{form.formalData.clientName ? (
															form.formalData.clientName
														) : (
															'Cliente Nuevo'
														)}
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
											onClick={() => saveClientData(form)}
										>
											{isNew ? 'Guardar' : 'Actualizar'}
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
														onChange={(e) => {
															const value = e.target.value;
															if (isNaturalPositiveNumber(value)) {
																setForm(
																	_.set({ ...form }, 'formalData.clientId', value)
																);
															}
														}}
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
														value={capitalize(form.formalData.clientName)}
														onChange={handleChange}
														variant='outlined'
														fullWidth
													/>

													<NumberFormat
														className='mt-8 mb-16'
														error={form.formalData.cuit.replace(' ', '').length <= 12}
														required
														label='CUIT'
														id='formalData.cuit'
														name='formalData.cuit'
														value={form.formalData.cuit}
														variant='outlined'
														fullWidth
														customInput={TextField}
														format='##-########-#'
														onValueChange={({ formattedValue }) => {
															setForm(
																_.set({ ...form }, 'formalData.cuit', formattedValue)
															);
														}}
													/>

													<TextField
														className='mt-8 mb-16'
														error={form.formalData.rubro === ''}
														required
														label='Rubro'
														id='formalData.rubro'
														name='formalData.rubro'
														value={capitalize(form.formalData.rubro)}
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
															<FuseAnimate
																animation='transition.slideRightIn'
																delay={300}
															>
																<Button
																	className='whitespace-no-wrap '
																	variant='contained'
																	onClick={() =>
																		seeModalData(
																			addressFormalData,
																			'addressFormalData'
																		)}
																>
																	Ver domicilios agregados
																</Button>
															</FuseAnimate>
														</div>
													)}
													<div className='flex justify-around items-center'>
														<FuseChipSelect
															className='mt-8 mb-16 mr-8 w-360'
															value={form.formalData.address.type}
															onChange={(value) =>
																handleChipChange(value, 'formalData.address.type')}
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
																{
																	value : 'registered',
																	label : 'Domicilio Constituido'
																},
																{ value: 'additional', label: 'Otro Domicilio' }
															]}
															variant='fixed'
														/>

														<FuseAnimate animation='transition.slideRightIn' delay={300}>
															<Button
																className='whitespace-no-wrap mt-8 mb-16 mr-8 h-56'
																variant='contained'
																disabled={!formalDataAddressSubmitted()}
																onClick={() =>
																	addFormalDataAddress(form.formalData.address)}
															>
																Crear Domicilio
															</Button>
														</FuseAnimate>
													</div>
													<div className='flex justify-around items-center'>
														<TextField
															className='mt-8 mb-16 mr-8'
															error={
																form.formalData.address.calleRuta === '' &&
																(addressFormalData.filter((i) => i.type === 'legal')
																	.length === 0 ||
																	addressFormalData.filter(
																		(i) => i.type === 'registered'
																	).length === 0)
															}
															required
															label='Calle / Ruta'
															id='formalData.address.calleRuta'
															name='formalData.address.calleRuta'
															value={capitalize(form.formalData.address.calleRuta)}
															onChange={handleChange}
															variant='outlined'
														/>

														<TextField
															className='mt-8 mb-16 mr-8'
															error={
																form.formalData.address.nKm === '' &&
																(addressFormalData.filter((i) => i.type === 'legal')
																	.length === 0 ||
																	addressFormalData.filter(
																		(i) => i.type === 'registered'
																	).length === 0)
															}
															required
															label='N° / Km'
															id='formalData.address.nKm'
															name='formalData.address.nKm'
															value={capitalize(form.formalData.address.nKm)}
															onChange={handleChange}
															variant='outlined'
														/>

														<TextField
															className='mt-8 mb-16 mr-8'
															label='Piso'
															id='formalData.address.piso'
															name='formalData.address.piso'
															value={capitalize(form.formalData.address.piso)}
															onChange={handleChange}
															variant='outlined'
														/>

														<TextField
															className='mt-8 mb-16 mr-8'
															label='Departamento'
															id='formalData.address.depto'
															name='formalData.address.depto'
															value={capitalize(form.formalData.address.depto)}
															onChange={handleChange}
															variant='outlined'
														/>
													</div>
													<div className='flex justify-around items-center'>
														<TextField
															className='mt-8 mb-16 mr-8'
															error={
																form.formalData.address.localidad === '' &&
																(addressFormalData.filter((i) => i.type === 'legal')
																	.length === 0 ||
																	addressFormalData.filter(
																		(i) => i.type === 'registered'
																	).length === 0)
															}
															required
															label='Localidad'
															id='formalData.address.localidad'
															name='formalData.address.localidad'
															value={capitalize(form.formalData.address.localidad)}
															onChange={handleChange}
															variant='outlined'
														/>

														<TextField
															className='mt-8 mb-16 mr-8'
															error={
																form.formalData.address.codigo_postal === '' &&
																(addressFormalData.filter((i) => i.type === 'legal')
																	.length === 0 ||
																	addressFormalData.filter(
																		(i) => i.type === 'registered'
																	).length === 0)
															}
															required
															label='Codigo Postal'
															id='formalData.address.codigo_postal'
															name='formalData.address.codigo_postal'
															value={form.formalData.address.codigo_postal}
															onChange={handleChange}
															variant='outlined'
														/>

														<TextField
															className='mt-8 mb-16 mr-8'
															error={
																form.formalData.address.partido === '' &&
																(addressFormalData.filter((i) => i.type === 'legal')
																	.length === 0 ||
																	addressFormalData.filter(
																		(i) => i.type === 'registered'
																	).length === 0)
															}
															required
															label='Partido'
															id='formalData.address.partido'
															name='formalData.address.partido'
															value={capitalize(form.formalData.address.partido)}
															onChange={handleChange}
															variant='outlined'
														/>

														<TextField
															className='mt-8 mb-16 mr-8'
															error={
																form.formalData.address.provincia === '' &&
																(addressFormalData.filter((i) => i.type === 'legal')
																	.length === 0 ||
																	addressFormalData.filter(
																		(i) => i.type === 'registered'
																	).length === 0)
															}
															required
															label='Provincia'
															id='formalData.address.provincia'
															name='formalData.address.provincia'
															value={capitalize(form.formalData.address.provincia)}
															onChange={handleChange}
															variant='outlined'
														/>
													</div>
												</React.Fragment>
											)}
											{tabInnerFormal === 2 && (
												<React.Fragment>
													{legalRepresentativeFormalData.length > 0 && (
														<div className='flex justify-around items-center mb-16'>
															<FuseAnimate
																animation='transition.slideRightIn'
																delay={300}
															>
																<Button
																	className='whitespace-no-wrap '
																	variant='contained'
																	onClick={() =>
																		seeModalData(
																			legalRepresentativeFormalData,
																			'legalRepresentativeFormalData'
																		)}
																>
																	Ver representantes agregados
																</Button>
															</FuseAnimate>
														</div>
													)}
													<div className='flex justify-center items-center'>
														<TextField
															className='mt-8 mb-16 mr-8'
															error={
																form.formalData.legalRepresentative.first_name === '' &&
																legalRepresentativeFormalData.length === 0
															}
															required
															label='Nombre'
															id='formalData.legalRepresentative.first_name'
															name='formalData.legalRepresentative.first_name'
															value={capitalize(
																form.formalData.legalRepresentative.first_name
															)}
															onChange={handleChange}
															variant='outlined'
														/>

														<TextField
															className='mt-8 mb-16 mr-8'
															error={
																form.formalData.legalRepresentative.last_name === '' &&
																legalRepresentativeFormalData.length === 0
															}
															required
															label='Apellido'
															id='formalData.legalRepresentative.last_name'
															name='formalData.legalRepresentative.last_name'
															value={capitalize(
																form.formalData.legalRepresentative.last_name
															)}
															onChange={handleChange}
															variant='outlined'
														/>

														<NumberFormat
															variant='outlined'
															className='mt-8 mb-16 mr-8'
															label='DNI'
															error={
																form.formalData.legalRepresentative.dni.replace(' ', '')
																	.length <= 9 &&
																legalRepresentativeFormalData.length === 0
															}
															required
															id='formalData.legalRepresentative.dni'
															name='formalData.legalRepresentative.dni'
															value={form.formalData.legalRepresentative.dni}
															customInput={TextField}
															format='##.###.###'
															onValueChange={({ formattedValue }) => {
																setForm(
																	_.set(
																		{ ...form },
																		'formalData.legalRepresentative.dni',
																		formattedValue
																	)
																);
															}}
														/>

														<TextField
															className='mt-8 mb-16 mr-8'
															error={
																form.formalData.legalRepresentative.position === '' &&
																legalRepresentativeFormalData.length === 0
															}
															required
															label='Cargo'
															id='formalData.legalRepresentative.position'
															name='formalData.legalRepresentative.position'
															value={capitalize(
																form.formalData.legalRepresentative.position
															)}
															onChange={handleChange}
															variant='outlined'
														/>

														<NumberFormat
															className='mt-8 mb-16 mr-8'
															error={
																legalRepresentativeFormalData.length === 0 &&
																form.formalData.legalRepresentative.cuil.replace(
																	' ',
																	''
																).length <= 12
															}
															required
															label='CUIL'
															id='formalData.legalRepresentative.cuil'
															name='formalData.legalRepresentative.cuil'
															value={form.formalData.legalRepresentative.cuil}
															variant='outlined'
															customInput={TextField}
															format='##-########-#'
															onValueChange={({ formattedValue }) => {
																setForm(
																	_.set(
																		{ ...form },
																		'formalData.legalRepresentative.cuil',
																		formattedValue
																	)
																);
															}}
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

													<div className={classes.root}>
														<Grid container spacing={3}>
															<Grid item xs={6}>
																<Paper className={classes.paper}>
																	<DropZone
																		anotherFiles={formalDataFiles}
																		files={estatuto}
																		setFiles={setFormalDataFiles}
																		loading={estatutosLoading}
																		toggleLoading={toggleLoadingFiles}
																		loadingFiles={loadingFiles}
																		deleting={estatutosDeleting}
																		toggleDelete={toggleDeleteFiles}
																		deletingFiles={deletingFiles}
																		toggleDisabledFiles={toggleDisabledFiles}
																		disabledFiles={disabledFiles}
																		clientId={form.formalData.clientId}
																		folderName='estatutos'
																		varName='estatuto'
																		title='Estatutos'
																	/>
																</Paper>
															</Grid>
															<Grid item xs={6}>
																<Paper className={classes.paper}>
																	<DropZone
																		anotherFiles={formalDataFiles}
																		files={actaDesignacion}
																		setFiles={setFormalDataFiles}
																		loading={actasLoading}
																		toggleLoading={toggleLoadingFiles}
																		loadingFiles={loadingFiles}
																		deleting={actasDeleting}
																		toggleDelete={toggleDeleteFiles}
																		deletingFiles={deletingFiles}
																		toggleDisabledFiles={toggleDisabledFiles}
																		disabledFiles={disabledFiles}
																		clientId={form.formalData.clientId}
																		folderName='actas'
																		varName='actaDesignacion'
																		title='Actas de Designacion'
																	/>
																</Paper>
															</Grid>
															<Grid item xs={6}>
																<Paper className={classes.paper}>
																	<DropZone
																		anotherFiles={formalDataFiles}
																		files={poderes}
																		setFiles={setFormalDataFiles}
																		loading={poderesLoading}
																		toggleLoading={toggleLoadingFiles}
																		loadingFiles={loadingFiles}
																		deleting={poderesDeleting}
																		toggleDelete={toggleDeleteFiles}
																		deletingFiles={deletingFiles}
																		toggleDisabledFiles={toggleDisabledFiles}
																		disabledFiles={disabledFiles}
																		clientId={form.formalData.clientId}
																		folderName='poderes'
																		varName='poderes'
																		title='Poderes'
																	/>
																</Paper>
															</Grid>
															<Grid item xs={6}>
																<Paper className={classes.paper}>
																	<DropZone
																		anotherFiles={formalDataFiles}
																		files={extraPdfs}
																		setFiles={setFormalDataFiles}
																		loading={extrasLoading}
																		toggleLoading={toggleLoadingFiles}
																		loadingFiles={loadingFiles}
																		deleting={extrasDeleting}
																		toggleDelete={toggleDeleteFiles}
																		deletingFiles={deletingFiles}
																		toggleDisabledFiles={toggleDisabledFiles}
																		disabledFiles={disabledFiles}
																		clientId={form.formalData.clientId}
																		folderName='extras'
																		varName='extraPdfs'
																		title='Otros Documentos'
																	/>
																</Paper>
															</Grid>
														</Grid>
													</div>

													<div className={classes.root}>
														<Grid container spacing={3}>
															<Grid item xs={12}>
																<Paper className={classes.paper}>
																	<DropZone
																		anotherFiles={formalDataFiles}
																		files={dniDocument}
																		setFiles={setFormalDataFiles}
																		loading={dniDocumentLoading}
																		toggleLoading={toggleLoadingFiles}
																		loadingFiles={loadingFiles}
																		deleting={dniDocumentDeleting}
																		toggleDelete={toggleDeleteFiles}
																		deletingFiles={deletingFiles}
																		toggleDisabledFiles={toggleDisabledFiles}
																		disabledFiles={disabledFiles}
																		clientId={form.formalData.clientId}
																		folderName='dniDocument'
																		varName='dniDocument'
																		title='DNI (opcional)'
																		single={true}
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
													{form.formalData.clientId !== '' && (
														<div className='flex justify-around items-center mb-16'>
															<FuseAnimate animation='transition.slideLeftIn' delay={300}>
																<Typography variant='h5'>
																	{dataPlanta.length > 0 ? (
																		`ID del establecimiento: ${form.formalData
																			.clientId}-${dataPlanta.length + 1}`
																	) : (
																		`ID del establecimiento: ${form.formalData
																			.clientId}`
																	)}
																</Typography>
															</FuseAnimate>
														</div>
													)}

													<div className='flex justify-around items-center'>
														<TextField
															className='mt-8 mb-16 mr-8'
															error={form.planta.address.calleRuta === ''}
															required
															label='Calle / Ruta'
															id='planta.address.calleRuta'
															name='planta.address.calleRuta'
															value={capitalize(form.planta.address.calleRuta)}
															onChange={handleChange}
															variant='outlined'
														/>

														<TextField
															className='mt-8 mb-16 mr-8'
															error={form.planta.address.nKm === ''}
															required
															label='N° / Km'
															id='planta.address.nKm'
															name='planta.address.nKm'
															value={capitalize(form.planta.address.nKm)}
															onChange={handleChange}
															variant='outlined'
														/>

														<TextField
															className='mt-8 mb-16 mr-8'
															label='Piso'
															id='planta.address.piso'
															name='planta.address.piso'
															value={capitalize(form.planta.address.piso)}
															onChange={handleChange}
															variant='outlined'
														/>

														<TextField
															className='mt-8 mb-16 mr-8'
															label='Departamento'
															id='planta.address.depto'
															name='planta.address.depto'
															value={capitalize(form.planta.address.depto)}
															onChange={handleChange}
															variant='outlined'
														/>
													</div>
													<div className='flex justify-around items-center'>
														<TextField
															className='mt-8 mb-16 mr-8'
															error={form.planta.address.localidad === ''}
															required
															label='Localidad'
															id='planta.address.localidad'
															name='planta.address.localidad'
															value={capitalize(form.planta.address.localidad)}
															onChange={handleChange}
															variant='outlined'
														/>

														<TextField
															className='mt-8 mb-16 mr-8'
															error={form.planta.address.codigo_postal === ''}
															required
															label='Codigo Postal'
															id='planta.address.codigo_postal'
															name='planta.address.codigo_postal'
															value={capitalize(form.planta.address.codigo_postal)}
															onChange={handleChange}
															variant='outlined'
														/>

														<TextField
															className='mt-8 mb-16 mr-8'
															error={form.planta.address.partido === ''}
															required
															label='Partido'
															id='planta.address.partido'
															name='planta.address.partido'
															value={capitalize(form.planta.address.partido)}
															onChange={handleChange}
															variant='outlined'
														/>

														<TextField
															className='mt-8 mb-16 mr-8'
															error={form.planta.address.provincia === ''}
															required
															label='Provincia'
															id='planta.address.provincia'
															name='planta.address.provincia'
															value={capitalize(form.planta.address.provincia)}
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
														id='planta.email'
														name='planta.email'
														error={!isEmail(form.planta.email)}
														value={form.planta.email}
														onChange={handleChange}
														variant='outlined'
														fullWidth
													/>

													{phoneContactsPlanta.length > 0 && (
														<div className='flex flex-row justify-around items-center mb-16'>
															<FuseAnimate
																animation='transition.slideRightIn'
																delay={300}
															>
																<Button
																	className='whitespace-no-wrap '
																	variant='contained'
																	onClick={() =>
																		seeModalData(
																			phoneContactsPlanta,
																			'phoneContactsPlanta'
																		)}
																>
																	Ver telefonos agregados
																</Button>
															</FuseAnimate>
														</div>
													)}

													<div className='flex'>
														<TextField
															className='mt-8 mb-16 mr-8'
															label='Telefono(s) de Contacto'
															id='planta.phoneContacts'
															name='planta.phoneContacts'
															value={form.planta.phoneContacts}
															onChange={handleChange}
															variant='outlined'
															fullWidth
														/>

														<FuseAnimate animation='transition.slideRightIn' delay={300}>
															<Button
																className='whitespace-no-wrap mt-8 mb-16 mr-8 h-56'
																variant='contained'
																disabled={!plantaPhoneContactsSubmitted()}
																onClick={() =>
																	addPlantaPhoneContacts(form.planta.phoneContacts)}
															>
																Guardar telefono
															</Button>
														</FuseAnimate>
													</div>

													<div className='flex flex-row justify-around items-center mb-16'>
														<FuseAnimate animation='transition.slideRightIn' delay={300}>
															<Button
																className='whitespace-no-wrap'
																variant='contained'
																disabled={!plantaInnerContactsSubmitted()}
																onClick={() =>
																	addPlantaInnerContacts(form.planta.innerContact)}
															>
																Crear contacto interno
															</Button>
														</FuseAnimate>
														{innerContactsPlanta.length > 0 && (
															<FuseAnimate
																animation='transition.slideRightIn'
																delay={300}
															>
																<Button
																	className='whitespace-no-wrap '
																	variant='contained'
																	onClick={() =>
																		seeModalData(
																			innerContactsPlanta,
																			'innerContactsPlanta'
																		)}
																>
																	Ver contactos creados
																</Button>
															</FuseAnimate>
														)}
													</div>

													<div className='flex'>
														<TextField
															className='mt-8 mb-16 mr-8'
															label='Nombre del contacto interno'
															id='planta.innerContact.name'
															name='planta.innerContact.name'
															value={capitalize(form.planta.innerContact.name)}
															onChange={handleChange}
															variant='outlined'
															fullWidth
														/>
														<TextField
															className='mt-8 mb-16 mr-8'
															label='Apellido del contacto interno'
															id='planta.innerContact.lastName'
															name='planta.innerContact.lastName'
															value={capitalize(form.planta.innerContact.lastName)}
															onChange={handleChange}
															variant='outlined'
															fullWidth
														/>
														<TextField
															className='mt-8 mb-16 mr-8'
															label='Telefono del Contacto interno'
															id='planta.innerContact.phone'
															name='planta.innerContact.phone'
															value={form.planta.innerContact.phone}
															onChange={handleChange}
															variant='outlined'
															fullWidth
														/>
													</div>
													{innerContactsEmailPlanta.length > 0 && (
														<div className='flex flex-row justify-around items-center mb-16'>
															<FuseAnimate
																animation='transition.slideRightIn'
																delay={300}
															>
																<Button
																	className='whitespace-no-wrap '
																	variant='contained'
																	onClick={() =>
																		seeModalData(
																			innerContactsEmailPlanta,
																			'innerContactsEmailPlanta'
																		)}
																>
																	Ver correos agregados
																</Button>
															</FuseAnimate>
														</div>
													)}
													<div className='flex'>
														<TextField
															className='mt-8 mb-16 mr-8'
															label='Email del contacto'
															id='planta.innerContact.email'
															name='planta.innerContact.email'
															error={!isEmail(form.planta.innerContact.email)}
															value={form.planta.innerContact.email}
															onChange={handleChange}
															variant='outlined'
															fullWidth
														/>

														<FuseAnimate animation='transition.slideRightIn' delay={300}>
															<Button
																className='whitespace-no-wrap mt-8 mb-16 mr-8 h-56'
																variant='contained'
																disabled={!plantaInnerContactEmailSubmitted()}
																onClick={() =>
																	addPlantaInnerContactsEmail(
																		form.planta.innerContact.email
																	)}
															>
																Guardar email
															</Button>
														</FuseAnimate>
													</div>
													<div className='flex'>
														<TextField
															className='mt-8 mb-16 mr-8'
															label='Cargo'
															id='planta.innerContact.position'
															name='planta.innerContact.position'
															value={capitalize(form.planta.innerContact.position)}
															onChange={handleChange}
															variant='outlined'
															fullWidth
														/>
														<TextField
															className='mt-8 mb-16 mr-8'
															label='Area'
															id='planta.innerContact.workArea'
															name='planta.innerContact.workArea'
															value={capitalize(form.planta.innerContact.workArea)}
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
																id='planta.govermentUsers.opds.user'
																name='planta.govermentUsers.opds.user'
																value={form.planta.govermentUsers.opds.user}
																error={form.planta.govermentUsers.opds.user === ''}
																onChange={handleChange}
																variant='outlined'
																fullWidth
															/>

															<TextField
																className='mt-8 mb-16 mr-8'
																label='Clave (OPDS)'
																id='planta.govermentUsers.opds.pass'
																name='planta.govermentUsers.opds.pass'
																value={form.planta.govermentUsers.opds.pass}
																error={form.planta.govermentUsers.opds.pass === ''}
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
																id='planta.govermentUsers.ada.user'
																name='planta.govermentUsers.ada.user'
																value={form.planta.govermentUsers.ada.user}
																error={form.planta.govermentUsers.ada.user === ''}
																onChange={handleChange}
																variant='outlined'
																fullWidth
															/>

															<TextField
																className='mt-8 mb-16 mr-8'
																label='Clave (ADA)'
																id='planta.govermentUsers.ada.pass'
																name='planta.govermentUsers.ada.pass'
																value={form.planta.govermentUsers.ada.pass}
																error={form.planta.govermentUsers.ada.pass === ''}
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
																id='planta.govermentUsers.ina.user'
																name='planta.govermentUsers.ina.user'
																value={form.planta.govermentUsers.ina.user}
																error={form.planta.govermentUsers.ina.user === ''}
																onChange={handleChange}
																variant='outlined'
																fullWidth
															/>

															<TextField
																className='mt-8 mb-16 mr-8'
																label='Clave (INA)'
																id='planta.govermentUsers.ina.pass'
																name='planta.govermentUsers.ina.pass'
																value={form.planta.govermentUsers.ina.pass}
																error={form.planta.govermentUsers.ina.pass === ''}
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
																id='planta.govermentUsers.acumar.user'
																name='planta.govermentUsers.acumar.user'
																value={form.planta.govermentUsers.acumar.user}
																error={form.planta.govermentUsers.acumar.user === ''}
																onChange={handleChange}
																variant='outlined'
																fullWidth
															/>

															<TextField
																className='mt-8 mb-16 mr-8'
																label='Clave (ACUMAR)'
																id='planta.govermentUsers.acumar.pass'
																name='planta.govermentUsers.acumar.pass'
																value={form.planta.govermentUsers.acumar.pass}
																error={form.planta.govermentUsers.acumar.pass === ''}
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
																onClick={() => closeMobiliaryModal(!showMobiliaryModal)}
															>
																Escoger campos a llenar
															</Button>
														</FuseAnimate>

														<FuseAnimate animation='transition.slideRightIn' delay={300}>
															<Button
																className='whitespace-no-wrap'
																variant='contained'
																disabled={!plantaMobiliarySubmitted()}
																onClick={() =>
																	addPlantaMobiliary(form.planta.mobiliary)}
															>
																Crear Inmueble
															</Button>
														</FuseAnimate>
														{mobiliaryPlanta.length > 0 && (
															<FuseAnimate
																animation='transition.slideRightIn'
																delay={300}
															>
																<Button
																	className='whitespace-no-wrap '
																	variant='contained'
																	onClick={() =>
																		seeModalData(
																			mobiliaryPlanta,
																			'mobiliaryPlanta'
																		)}
																>
																	Ver inmuebles agregados
																</Button>
															</FuseAnimate>
														)}
														<FuseAnimate animation='transition.slideRightIn' delay={300}>
															<Button
																className='whitespace-no-wrap'
																variant='contained'
																disabled={!plantaSubmitted()}
																onClick={() => addDataPlanta(form.planta)}
															>
																Crear Planta
															</Button>
														</FuseAnimate>
														{dataPlanta.length > 0 && (
															<FuseAnimate
																animation='transition.slideRightIn'
																delay={300}
															>
																<Button
																	className='whitespace-no-wrap '
																	variant='contained'
																	onClick={() =>
																		seeModalData(dataPlanta, 'dataPlanta')}
																>
																	Ver plantas agregadas
																</Button>
															</FuseAnimate>
														)}
													</div>

													<div className='flex'>
														<TextField
															className='mt-8 mb-16 mr-8'
															label='Partida Inmobiliara Provincial'
															id='planta.mobiliary.partidaInmobiliaria'
															name='planta.mobiliary.partidaInmobiliaria'
															value={form.planta.mobiliary.partidaInmobiliaria}
															onChange={handleChange}
															variant='outlined'
															fullWidth
															required
															error={form.planta.mobiliary.partidaInmobiliaria === ''}
														/>

														<TextField
															className='mt-8 mb-16 mr-8'
															label='Circunscripción'
															id='planta.mobiliary.circunscripcion'
															name='planta.mobiliary.circunscripcion'
															value={capitalize(form.planta.mobiliary.circunscripcion)}
															onChange={handleChange}
															variant='outlined'
															fullWidth
															required
															error={form.planta.mobiliary.circunscripcion === ''}
														/>

														<TextField
															className='mt-8 mb-16 mr-8'
															label='Sección'
															id='planta.mobiliary.seccion'
															name='planta.mobiliary.seccion'
															value={capitalize(form.planta.mobiliary.seccion)}
															onChange={handleChange}
															variant='outlined'
															fullWidth
															required
															error={form.planta.mobiliary.seccion === ''}
														/>

														<TextField
															className='mt-8 mb-16 mr-8'
															label='Caracter de uso de suelo'
															id='planta.mobiliary.caracterUso'
															name='planta.mobiliary.caracterUso'
															value={capitalize(form.planta.mobiliary.caracterUso)}
															onChange={handleChange}
															variant='outlined'
															fullWidth
															required
															error={form.planta.mobiliary.caracterUso === ''}
														/>
													</div>

													{(checkBoxMobiliary.fraccion ||
														checkBoxMobiliary.manzana ||
														checkBoxMobiliary.parcela ||
														checkBoxMobiliary.poligono) && (
														<FuseAnimate animation='transition.fadeIn' delay={300}>
															<div className='flex'>
																{checkBoxMobiliary.fraccion && (
																	<FuseAnimate
																		animation='transition.slideRightIn'
																		delay={300}
																	>
																		<TextField
																			className='mt-8 mb-16 mr-8'
																			label='Fracción'
																			id='planta.mobiliary.fraccion'
																			name='planta.mobiliary.fraccion'
																			value={form.planta.mobiliary.fraccion}
																			onChange={handleChange}
																			variant='outlined'
																			fullWidth
																		/>
																	</FuseAnimate>
																)}

																{checkBoxMobiliary.manzana && (
																	<FuseAnimate
																		animation='transition.slideRightIn'
																		delay={300}
																	>
																		<TextField
																			className='mt-8 mb-16 mr-8'
																			label='Manzana'
																			id='planta.mobiliary.manzana'
																			name='planta.mobiliary.manzana'
																			value={form.planta.mobiliary.manzana}
																			onChange={handleChange}
																			variant='outlined'
																			fullWidth
																		/>
																	</FuseAnimate>
																)}

																{checkBoxMobiliary.parcela && (
																	<FuseAnimate
																		animation='transition.slideRightIn'
																		delay={300}
																	>
																		<TextField
																			className='mt-8 mb-16 mr-8'
																			label='Parcela'
																			id='planta.mobiliary.parcela'
																			name='planta.mobiliary.parcela'
																			value={form.planta.mobiliary.parcela}
																			onChange={handleChange}
																			variant='outlined'
																			fullWidth
																		/>
																	</FuseAnimate>
																)}

																{checkBoxMobiliary.poligono && (
																	<FuseAnimate
																		animation='transition.slideRightIn'
																		delay={300}
																	>
																		<TextField
																			className='mt-8 mb-16 mr-8'
																			label='Poligono'
																			id='planta.mobiliary.poligono'
																			name='planta.mobiliary.poligono'
																			value={form.planta.mobiliary.poligono}
																			onChange={handleChange}
																			variant='outlined'
																			fullWidth
																		/>
																	</FuseAnimate>
																)}
															</div>
														</FuseAnimate>
													)}

													{(checkBoxMobiliary.propietario ||
														checkBoxMobiliary.matricula ||
														checkBoxMobiliary.superficie) && (
														<FuseAnimate animation='transition.fadeIn' delay={300}>
															<div className='flex'>
																{checkBoxMobiliary.propietario && (
																	<TextField
																		className='mt-8 mb-16 mr-8'
																		label='Propietario'
																		id='planta.mobiliary.propietario'
																		name='planta.mobiliary.propietario'
																		value={capitalize(
																			form.planta.mobiliary.propietario
																		)}
																		onChange={handleChange}
																		variant='outlined'
																		fullWidth
																	/>
																)}

																{checkBoxMobiliary.matricula && (
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
																)}

																{checkBoxMobiliary.superficie && (
																	<TextField
																		className='mt-8 mb-16 mr-8'
																		label='Superficie numérica'
																		id='planta.mobiliary.superficie'
																		name='planta.mobiliary.superficie'
																		placeholder='24512,52'
																		value={form.planta.mobiliary.superficie}
																		onChange={handleChange}
																		error={
																			!isValidDecimalNumber(
																				form.planta.mobiliary.superficie
																			)
																		}
																		variant='outlined'
																		fullWidth
																	/>
																)}
															</div>
														</FuseAnimate>
													)}

													<div className={classes.root}>
														<Grid container spacing={3}>
															<Grid item xs={checkBoxMobiliary.documentacionUso ? 6 : 12}>
																<Paper className={classes.paper}>
																	<DropZone
																		anotherFiles={formalDataFiles}
																		files={planchetas}
																		setFiles={setFormalDataFiles}
																		loading={planchetasLoading}
																		toggleLoading={toggleLoadingFiles}
																		loadingFiles={loadingFiles}
																		deleting={planchetasDeleting}
																		toggleDelete={toggleDeleteFiles}
																		deletingFiles={deletingFiles}
																		toggleDisabledFiles={toggleDisabledFiles}
																		disabledFiles={disabledFiles}
																		clientId={form.formalData.clientId}
																		folderName='planchetas'
																		plantaLength={`${dataPlanta.length + 1}`}
																		varName='planchetas'
																		title='Plancheta'
																		single={true}
																	/>
																</Paper>
															</Grid>
															{checkBoxMobiliary.documentacionUso && (
																<FuseAnimate animation='transition.fadeIn' delay={300}>
																	<Grid item xs={6}>
																		<Paper className={classes.paper}>
																			<DropZone
																				anotherFiles={formalDataFiles}
																				files={documentacionUso}
																				setFiles={setFormalDataFiles}
																				loading={documentacionUsoLoading}
																				toggleLoading={toggleLoadingFiles}
																				loadingFiles={loadingFiles}
																				deleting={documentacionUsoDeleting}
																				toggleDelete={toggleDeleteFiles}
																				deletingFiles={deletingFiles}
																				toggleDisabledFiles={
																					toggleDisabledFiles
																				}
																				disabledFiles={disabledFiles}
																				clientId={form.formalData.clientId}
																				folderName='documentacionUso'
																				plantaLength={`${dataPlanta.length +
																					1}`}
																				varName='documentacionUso'
																				title='Documentacion de uso'
																				single={true}
																			/>
																		</Paper>
																	</Grid>
																</FuseAnimate>
															)}
														</Grid>
													</div>

													{checkBoxMobiliary.observaciones && (
														<FuseAnimate animation='transition.fadeIn' delay={300}>
															<TextField
																className='mt-8 mb-16'
																id='planta.mobiliary.observaciones'
																name='planta.mobiliary.observaciones'
																onChange={handleChange}
																label='Observaciones'
																type='text'
																value={form.planta.mobiliary.observaciones}
																multiline
																rows={5}
																variant='outlined'
																fullWidth
															/>
														</FuseAnimate>
													)}
												</div>
											)}
										</React.Fragment>
									)}
								</div>
							)
						}
						innerScroll
					/>
					<ShowInfoDialog
						clientId={form.formalData.clientId}
						open={showModal}
						closeModal={closeModal}
						setDataModal={setDataModal}
						data={dataTable}
						type={typeTable}
						setDataEdit={setDataEdit}
						isNewClient={isNew}
						history={props.history}
					/>

					<Dialog
						classes={{
							paper : 'm-24'
						}}
						open={showMobiliaryModal}
						onClose={() => closeModalMobiliary()}
						fullWidth
						maxWidth='md'
					>
						<AppBar position='static' elevation={1}>
							<Toolbar className='flex w-full'>
								<IconButton
									edge='start'
									color='inherit'
									onClick={() => closeModalMobiliary()}
									aria-label='close'
								>
									<CloseIcon />
								</IconButton>
								<Typography>Campos opcionales del inmueble</Typography>
							</Toolbar>
						</AppBar>
						<div className='flex flex-col overflow-hidden'>
							<DialogContent classes={{ root: 'p-24' }}>
								<div className={classes.root}>
									<FormGroup row>
										<FormControlLabel
											control={
												<Checkbox
													checked={checkBoxMobiliary.fraccion}
													onChange={() => {
														saveFieldsMobiliary('fraccion', !checkBoxMobiliary.fraccion);
													}}
													value='gola'
												/>
											}
											label='Posee Fracción'
										/>
										<FormControlLabel
											control={
												<Checkbox
													checked={checkBoxMobiliary.manzana}
													onChange={() => {
														saveFieldsMobiliary('manzana', !checkBoxMobiliary.manzana);
													}}
													value='gola'
												/>
											}
											label='Posee Manzana'
										/>
										<FormControlLabel
											control={
												<Checkbox
													checked={checkBoxMobiliary.parcela}
													onChange={() => {
														saveFieldsMobiliary('parcela', !checkBoxMobiliary.parcela);
													}}
													value='gola'
												/>
											}
											label='Posee Parcela'
										/>
										<FormControlLabel
											control={
												<Checkbox
													checked={checkBoxMobiliary.poligono}
													onChange={() => {
														saveFieldsMobiliary('poligono', !checkBoxMobiliary.poligono);
													}}
													value='gola'
												/>
											}
											label='Posee Poligono'
										/>
										<FormControlLabel
											control={
												<Checkbox
													checked={checkBoxMobiliary.propietario}
													onChange={() => {
														saveFieldsMobiliary(
															'propietario',
															!checkBoxMobiliary.propietario
														);
													}}
													value='gola'
												/>
											}
											label='Posee Propietario'
										/>
										<FormControlLabel
											control={
												<Checkbox
													checked={checkBoxMobiliary.matricula}
													onChange={() => {
														saveFieldsMobiliary('matricula', !checkBoxMobiliary.matricula);
													}}
													value='gola'
												/>
											}
											label='Posee Matricula en registro de la propiedad'
										/>

										<FormControlLabel
											control={
												<Checkbox
													checked={checkBoxMobiliary.observaciones}
													onChange={() => {
														saveFieldsMobiliary(
															'observaciones',
															!checkBoxMobiliary.observaciones
														);
													}}
													value='gola'
												/>
											}
											label='Posee observaciones'
										/>
										<FormControlLabel
											control={
												<Checkbox
													checked={checkBoxMobiliary.superficie}
													onChange={() => {
														saveFieldsMobiliary(
															'superficie',
															!checkBoxMobiliary.superficie
														);
													}}
													value='gola'
												/>
											}
											label='Posee Superficie numérica'
										/>
										<FormControlLabel
											control={
												<Checkbox
													checked={checkBoxMobiliary.documentacionUso}
													onChange={() => {
														saveFieldsMobiliary(
															'documentacionUso',
															!checkBoxMobiliary.documentacionUso
														);
													}}
													value='gola'
												/>
											}
											label='Posee documentacion de uso'
										/>
									</FormGroup>
								</div>
							</DialogContent>

							<DialogActions className='justify-between pl-16'>
								<Button variant='contained' color='primary' onClick={() => closeModalMobiliary()}>
									Cerrar
								</Button>
							</DialogActions>
						</div>
					</Dialog>
				</React.Fragment>
			)}
		</React.Fragment>
	);
};

export default withReducer('clients', reducer)(Client);
