import React, { useEffect, useCallback, useState } from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	IconButton,
	Typography,
	Toolbar,
	AppBar,
	DialogTitle
	// CircularProgress
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { FuseAnimate } from '@fuse';
import { makeStyles } from '@material-ui/core/styles';
import { getTitle, getColumns, convertData } from 'utils';
import MaterialTable from 'material-table';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import _ from 'lodash';
import DropZone from './DropZone';

const options = {
	cMapUrl    : 'cmaps/',
	cMapPacked : true
};

const useStyles = makeStyles((theme) => ({
	root     : {
		width : '100%'
	},
	paper    : {
		marginTop    : theme.spacing(3),
		width        : '100%',
		overflowX    : 'auto',
		marginBottom : theme.spacing(2)
	},
	table    : {
		minWidth : 650
	},
	button   : {
		margin : theme.spacing(1)
	},
	center   : {
		display        : 'flex',
		justifyContent : 'center'
	},
	progress : {
		margin : theme.spacing(2),
		width  : '100px!important',
		height : '100px!important'
	}
}));

const ShowInfoDialog = (props) => {
	const classes = useStyles();
	const { clientId, closeModal, setDataModal, data, type, setDataEdit, isNewClient, ...modalProps } = props;
	const [ dataTable, setDataTable ] = useState([]);
	const [ typeTable, setTypeTable ] = useState('');

	useEffect(
		() => {
			setDataTable(data);
			setTypeTable(type);
		},
		[ data, type ]
	);

	const [ file, setFile ] = useState({
		url      : null,
		numPages : null
	});

	const [ filesShow, setFiles ] = useState([]);

	const [ dataDropZone, setDataDropZone ] = useState({
		folder  : '',
		varName : '',
		title   : '',
		single  : false,
		rowData : null
	});

	const [ state, setState ] = useState({
		columns : [],
		data    : []
	});

	const [ lastData, setLastData ] = useState({
		typeGrandFather : '',
		typeFather      : '',
		dataGrandFather : [],
		dataFather      : [],
		actualIndex     : null,
		lastIndex       : null
	});

	const [ open, setOpen ] = useState(false);

	const [ openViewer, setOpenViewer ] = useState(false);

	const handleClickOpen = (files) => {
		setFiles(_.isArray(files) ? files : [ files ].filter((i) => i));
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleCloseViewer = () => {
		setOpenViewer(false);
		setFile({
			url      : null,
			numPages : null
		});
	};

	const onDocumentLoadSuccess = ({ numPages }) => {
		setFile({
			...file,
			numPages
		});
	};

	const setEditableData = useCallback(
		(newType, newData, id) => {
			const lastIndex = lastData.actualIndex;
			setLastData({
				dataFather      : dataTable,
				typeFather      : typeTable,
				actualIndex     : id,
				lastIndex       : lastIndex,
				dataGrandFather : lastData.dataFather,
				typeGrandFather : lastData.typeFather
			});
			setDataTable(newData);
			setTypeTable(newType);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ typeTable, dataTable ]
	);

	const getNewData = (type, data, id) => {
		setEditableData(type, data, id);
	};

	useEffect(
		() => {
			const dataToShow = convertData(typeTable, dataTable, lastData.back);

			setState({
				data    : dataToShow,
				columns : getColumns(typeTable, handleClickOpen, getNewData, setDataDropZone)
			});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ typeTable, dataTable ]
	);

	useEffect(
		() => {
			document.oncontextmenu = () => {
				return !openViewer;
			};
		},
		[ openViewer ]
	);

	const getBackData = () => {
		const dataFather = lastData.dataGrandFather;
		const dataActual = lastData.dataFather;
		const typeFather = lastData.typeGrandFather;
		const typeActual = lastData.typeFather;

		setLastData({
			typeFather      : typeFather,
			typeGrandFather : '',
			dataFather      : dataFather,
			dataGrandFather : [],
			actualIndex     : lastData.lastIndex,
			lastIndex       : null
		});
		setDataTable(dataActual);
		setTypeTable(typeActual);
		setDataEdit({
			type : typeActual,
			data : dataActual
		});
	};

	const closeComposeDialog = () => {
		closeModal(false);

		setState({
			columns : [],
			data    : []
		});

		setDataModal({
			dataTable : [],
			typeTable : ''
		});
	};

	const showWarnings = () => {
		switch (typeTable) {
			case 'addressFormalData':
				const addressLegalValid = state.data.filter((i) => i.type === 'legal');
				const addressRegisteredValid = state.data.filter((i) => i.type === 'registered');

				return (
					<div className='flex flex-col text-center '>
						{addressLegalValid.length === 0 && (
							<FuseAnimate animation='transition.slideLeftIn' delay={300}>
								<Typography color='error' variant='h5'>
									Debe agregar un Domicilio Legal
								</Typography>
							</FuseAnimate>
						)}
						{addressRegisteredValid.length === 0 && (
							<FuseAnimate animation='transition.slideLeftIn' delay={300}>
								<Typography color='error' variant='h5'>
									Debe agregar un Domicilio Constituido
								</Typography>
							</FuseAnimate>
						)}
					</div>
				);
			case 'legalRepresentativeFormalData':
				return null;
			case 'dataPlanta':
				return null;
			case 'phoneContactsPlanta':
				return null;
			case 'innerContactsPlanta':
				return null;
			case 'innerContactsEmailPlanta':
				return null;
			case 'mobiliaryPlanta':
				return null;
			default:
				return null;
		}
	};

	const updateFiles = (files) => {
		const data = [ ...state.data ];
		const idData = dataDropZone.rowData.tableData.id;
		const formatedFiles = files.map((file) => {
			return { url: file.url, name: file.fileName };
		});
		const isUnique =
			dataDropZone.varName === 'plancheta' || dataDropZone.varName === 'documentacionUso' ? true : false;

		const newFiles = isUnique ? formatedFiles : [ ...data[idData][dataDropZone.varName], ...formatedFiles ];
		data[idData][dataDropZone.varName] = newFiles;

		setState({ ...state, data });
		const hadFather = lastData.typeFather !== '';
		if (hadFather) {
			let dataParents = [ ...lastData.dataFather ];

			switch (typeTable) {
				case 'phoneContactsPlanta':
					dataParents[lastData.actualIndex].phoneContacts = data.map((i) => i.phone);
					break;
				case 'innerContactsEmailPlanta':
					dataParents[lastData.actualIndex].email = data.map((i) => i.email);
					break;
				case 'innerContactsPlanta':
					dataParents[lastData.actualIndex].innerContact = data;
					break;
				case 'mobiliaryPlanta':
					dataParents[lastData.actualIndex].mobiliary = data;
					break;

				default:
					break;
			}

			setLastData({
				...lastData,
				dataFather : dataParents
			});
		} else {
			setDataEdit({
				type : typeTable,
				data
			});
		}
		setFiles(newFiles);
	};

	const showAdd = () => {
		if (isNewClient) {
			return {
				Add         : (props) => null,
				Search      : (props) => null,
				ResetSearch : (props) => null
			};
		} else {
			const objIcons = {
				Search      : (props) => null,
				ResetSearch : (props) => null
			};

			if (typeTable !== 'govermentUsers') {
				objIcons['Add'] = (props) => null;
			}
			return objIcons;
		}
	};

	return (
		<Dialog
			classes={{
				paper : 'm-24'
			}}
			{...modalProps}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth='lg'
			fullScreen
			disableBackdropClick
			disableEscapeKeyDown
		>
			<AppBar position='static' elevation={1}>
				<Toolbar className='flex w-full'>
					{lastData.typeFather !== '' ? (
						<IconButton edge='start' color='inherit' onClick={getBackData} aria-label='close'>
							<CloseIcon />
						</IconButton>
					) : (
						<IconButton edge='start' color='inherit' onClick={closeComposeDialog} aria-label='close'>
							<CloseIcon />
						</IconButton>
					)}
				</Toolbar>
			</AppBar>
			<div className='flex flex-col overflow-hidden'>
				<DialogContent classes={{ root: 'p-24' }}>
					<div className={classes.root}>
						{showWarnings()}
						<MaterialTable
							options={{ search: false }}
							title={getTitle(typeTable)}
							columns={state.columns}
							data={state.data}
							// icons={isNewClient ? { Add: (props) => null } : {}}
							icons={showAdd()}
							localization={{
								pagination : {
									labelDisplayedRows : '{from}-{to} de {count}',
									labelRowsSelect    : 'filas',
									labelRowsPerPage   : 'Filas por pagina',
									firstAriaLabel     : 'Primera Pagina',
									firstTooltip       : 'Primera pagina',
									previousAriaLabel  : 'Pagina anterior',
									previousTooltip    : 'Pagina anterior',
									nextAriaLabel      : 'Siguiente pagina',
									nextTooltip        : 'Siguiente pagina',
									lastAriaLabel      : 'Ultima pagina',
									lastTooltip        : 'Ultima pagina'
								},
								toolbar    : {
									nRowsSelected     : '{0} filas selecionadas',
									searchTooltip     : 'Buscar',
									searchPlaceholder : 'Buscar'
								},
								header     : {
									actions : 'Acciones'
								},
								body       : {
									emptyDataSourceMessage : 'No hay datos que mostrar',
									deleteTooltip          : 'Eliminar',
									editTooltip            : 'Editar',
									filterRow              : {
										filterTooltip : 'Filtro'
									},
									editRow                : {
										deleteText    : '¿Esta seguro que desea eliminar esta fila?',
										cancelTooltip : 'Cancelar',
										saveTooltip   : 'Guardar'
									}
								}
							}}
							editable={{
								onRowAdd    : (newData) =>
									new Promise((resolve, reject) => {
										setTimeout(() => {
											if (typeTable === 'govermentUsers') {
												const data = [ ...state.data ];
												const existType = data.filter((i) => i.type === newData.type).length;
												if (existType < 1) {
													let dataParents = [ ...lastData.dataFather ];
													data.push(newData);
													setState({ ...state, data });
													const resultObj = {};
													const map = new Map();
													for (const item of data) {
														const typeValue = item.type;
														if (!map.has(item.type)) {
															map.set(item.type, true); // set any value to Map
															resultObj[typeValue] = {
																user : item.user,
																pass : item.pass
															};
														}
													}

													dataParents[lastData.actualIndex].govermentUsers = resultObj;
													setLastData({
														...lastData,
														dataFather : dataParents
													});
												}
											}
											resolve();
										}, typeTable === 'govermentUsers' ? 600 : 0);
									}),
								onRowUpdate : (newData, oldData) =>
									new Promise((resolve) => {
										setTimeout(() => {
											resolve();
											const data = [ ...state.data ];
											data[data.indexOf(oldData)] = newData;
											setState({ ...state, data });
											const hadFather = lastData.typeFather !== '';
											if (hadFather) {
												let dataParents = [ ...lastData.dataFather ];
												switch (typeTable) {
													case 'phoneContactsPlanta':
														dataParents[lastData.actualIndex].phoneContacts = data.map(
															(i) => i.phone
														);
														break;
													case 'innerContactsEmailPlanta':
														dataParents[lastData.actualIndex].email = data.map(
															(i) => i.email
														);
														break;
													case 'innerContactsPlanta':
														dataParents[lastData.actualIndex].innerContact = data;
														break;
													case 'mobiliaryPlanta':
														dataParents[lastData.actualIndex].mobiliary = data;
														break;
													case 'govermentUsers':
														const govermentUsersObj = {};
														data.forEach((i) => {
															govermentUsersObj[i.type] = {
																user : i.user,
																pass : i.pass
															};
														});
														dataParents[
															lastData.actualIndex
														].govermentUsers = govermentUsersObj;
														break;
													default:
														break;
												}
												setLastData({
													...lastData,
													dataFather : dataParents
												});
											} else {
												setDataEdit({
													type : typeTable,
													data
												});
											}
										}, 600);
									}),
								onRowDelete : (oldData) =>
									new Promise((resolve) => {
										setTimeout(() => {
											resolve();
											const data = [ ...state.data ];
											data.splice(data.indexOf(oldData), 1);
											setState({ ...state, data });

											const hadFather = lastData.typeFather !== '';
											if (!hadFather) {
												setDataEdit({
													type : typeTable,
													data
												});
											} else {
												let dataParents = [ ...lastData.dataFather ];
												switch (typeTable) {
													case 'phoneContactsPlanta':
														dataParents[lastData.actualIndex].phoneContacts = data.map(
															(i) => i.phone
														);
														break;
													case 'innerContactsEmailPlanta':
														dataParents[lastData.actualIndex].email = data.map(
															(i) => i.email
														);
														break;
													case 'innerContactsPlanta':
														dataParents[lastData.actualIndex].innerContact = data;
														break;
													case 'mobiliaryPlanta':
														dataParents[lastData.actualIndex].mobiliary = data;
														break;
													case 'govermentUsers':
														const govermentUsersObj = {};
														data.forEach((i) => {
															govermentUsersObj[i.type] = {
																user : i.user,
																pass : i.pass
															};
														});
														dataParents[
															lastData.actualIndex
														].govermentUsers = govermentUsersObj;
														break;

													default:
														break;
												}
												setLastData({
													...lastData,
													dataFather : dataParents
												});
											}
										}, 600);
									}),
								isEditable  : () => true,
								isDeletable : () => true
							}}
						/>
					</div>
				</DialogContent>

				<DialogActions className='justify-between pl-16'>
					{lastData.typeFather !== '' ? (
						<Button variant='contained' color='primary' onClick={getBackData}>
							Regresar
						</Button>
					) : (
						<Button variant='contained' color='primary' onClick={closeComposeDialog}>
							Cerrar
						</Button>
					)}
				</DialogActions>
			</div>

			<Dialog fullWidth maxWidth='sm' onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
				<DialogTitle id='customized-dialog-title' onClose={handleClose}>
					Archivos
				</DialogTitle>
				<DialogContent dividers>
					<DropZone
						clientId={clientId}
						files={filesShow}
						folderName={dataDropZone.folder}
						setFiles={updateFiles}
						title={dataDropZone.title}
						editable={true}
						single={dataDropZone.single}
						varName={dataDropZone.varName}
						extraDta={lastData}
					/>
					{/* {filesShow.map((i, index) => (
						<Link key={index} onClick={() => handleClickOpenViewer(i.url)}>
							{i.name}
						</Link>
					))} */}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color='primary'>
						Cerrar
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				onClose={handleCloseViewer}
				fullWidth
				maxWidth='lg'
				fullScreen
				aria-labelledby='customized-dialog-title'
				open={openViewer}
				classes={{
					paper : 'm-24'
				}}
			>
				<DialogContent>
					<Document file={file.url} onLoadSuccess={onDocumentLoadSuccess} options={options}>
						{Array.from(new Array(file.numPages), (el, index) => (
							<Page key={`page_${index + 1}`} pageNumber={index + 1} />
						))}
					</Document>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseViewer} color='primary'>
						Cerrar
					</Button>
				</DialogActions>
			</Dialog>
		</Dialog>
	);
};

export default ShowInfoDialog;
