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
	DialogTitle,
	Link
	// CircularProgress
} from '@material-ui/core';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import CloseIcon from '@material-ui/icons/Close';
import { FuseAnimate } from '@fuse';
import { makeStyles } from '@material-ui/core/styles';
import {
	getTitle,
	getColumns,
	convertData
	// getTreeData
} from 'utils';
import MaterialTable from 'material-table';
import 'react-pdf/dist/Page/AnnotationLayer.css';

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
	const { closeModal, setDataModal, data, type, setDataEdit, isNewClient, ...modalProps } = props;
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
	const [ state, setState ] = useState({
		columns : [],
		data    : []
	});

	const [ lastData, setLastData ] = useState({
		typeGrandFather : '',
		typeFather      : '',
		dataGrandFather : [],
		dataFather      : [],
		back            : false,
		actualIndex     : null,
		lastIndex       : null
	});

	const [ open, setOpen ] = useState(false);

	const [ openViewer, setOpenViewer ] = useState(false);

	const handleClickOpen = (files) => {
		setFiles(typeof files === 'string' ? [ files ] : files);
		setOpen(true);
	};

	const handleClickOpenViewer = (url) => {
		setFile({
			...file,
			url
		});
		setOpenViewer(true);
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
				columns : getColumns(typeTable, handleClickOpen, getNewData)
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
							title={getTitle(typeTable)}
							columns={state.columns}
							data={state.data}
							icons={isNewClient ? { Add: (props) => null } : {}}
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
									new Promise((resolve) => {
										setTimeout(() => {
											resolve();
											const data = [ ...state.data ];
											data.push(newData);
											setState({ ...state, data });
											setDataEdit({
												type : typeTable,
												data
											});
										}, 600);
									}),
								onRowUpdate : (newData, oldData) =>
									new Promise((resolve) => {
										setTimeout(() => {
											resolve();
											const data = [ ...state.data ];
											data[data.indexOf(oldData)] = newData;
											setState({ ...state, data });
											if (!lastData.back) {
												setDataEdit({
													type : typeTable,
													data
												});
											} else {
												let dataParents = [ ...lastData.data ];
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

													default:
														break;
												}
												setLastData({
													...lastData,
													data : dataParents
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

											if (!lastData.back) {
												setDataEdit({
													type : typeTable,
													data
												});
											} else {
												let dataParents = [ ...lastData.data ];
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

													default:
														break;
												}
												setLastData({
													...lastData,
													data : dataParents
												});
											}
										}, 600);
									})
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
			<Dialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
				<DialogTitle id='customized-dialog-title' onClose={handleClose}>
					Archivos
				</DialogTitle>

				<DialogContent dividers>
					{filesShow.map((i) => (
						<Link key={i} onClick={() => handleClickOpenViewer(i)}>
							{i}
						</Link>
					))}
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
