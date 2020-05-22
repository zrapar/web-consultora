import React from 'react';
import { useDropzone } from 'react-dropzone';
import { deleteFile } from 'utils/aws';
import {
	Typography,
	Grid,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	Button
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import { makeStyles } from '@material-ui/styles';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { getSignedUrl } from 'utils/aws';

const options = {
	cMapUrl    : 'cmaps/',
	cMapPacked : true
};

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

const DropZone = ({
	clientId,
	files,
	folderName,
	title,
	setFiles,
	single = false,
	editable = false,
	varName = null,
	toggleLoading = null,
	toggleDisabledFiles = null,
	loadingFiles = null,
	deletingFiles = null,
	toggleDelete = null,
	anotherFiles = null,
	disabledFiles = null,
	loading = null,
	deleting = null,
	plantaLength = null,
	extraDta = null
}) => {
	const classes = useStyles();

	const callBack = React.useCallback;

	const [ innerLoading, toggleInnerLoading ] = React.useState(false);

	const [ innerDeleting, toggleInnerDeleting ] = React.useState(false);

	const [ innerDisabled, toggleInnerDisabled ] = React.useState(false);

	const [ folder, setFolderName ] = React.useState(folderName);

	const [ idEstablecimiento, setIdEstablecimiento ] = React.useState(false);

	React.useEffect(
		() => {
			if (
				extraDta &&
				extraDta.hasOwnProperty('actualIndex') &&
				(varName === 'plancheta' || varName === 'documentacionUso')
			) {
				let idFind = extraDta['dataFather'][extraDta.actualIndex]['id_establecimiento'];
				const hadGuion = idFind.includes('-');
				if (!hadGuion && extraDta.actualIndex === 0) {
					idFind = `${idFind}-1`;
				}
				setIdEstablecimiento(idFind);
			}
		},
		[ extraDta, varName ]
	);

	React.useEffect(
		() => {
			if (editable && idEstablecimiento) {
				setFolderName(`${folderName}/${idEstablecimiento}`);
			}

			if (!editable && plantaLength) {
				setFolderName(`${folderName}/${clientId}-${plantaLength}`);
			}
		},
		[ plantaLength, editable, folderName, clientId, idEstablecimiento ]
	);

	const startOnDrop = () => {
		if (!editable) {
			toggleLoading({
				...loadingFiles,
				[`${varName}Loading`]: true
			});

			const disableObj = {};

			const nameDisabled = `${varName}Disabled`;

			Object.keys(disabledFiles).forEach((name) => {
				if (name === nameDisabled) {
					disableObj[name] = false;
				} else {
					disableObj[name] = true;
				}
			});

			toggleDisabledFiles(disableObj);
		} else {
			toggleInnerDisabled(true);
			toggleInnerLoading(true);
		}
	};

	const endOnDrop = () => {
		if (!editable) {
			toggleLoading({
				...loadingFiles,
				[`${varName}Loading`]: false
			});

			const disableObj = {};

			Object.keys(disabledFiles).forEach((name) => {
				disableObj[name] = false;
			});

			toggleDisabledFiles(disableObj);
		} else {
			toggleInnerDisabled(false);
			toggleInnerLoading(false);
		}
	};

	const startDeleting = () => {
		if (!editable) {
			toggleDelete({
				...deletingFiles,
				[`${folder}Deleting`]: true
			});
		} else {
			toggleInnerDeleting(true);
		}
	};

	const endDeleting = () => {
		if (!editable) {
			toggleDelete({
				...deletingFiles,
				[`${folder}Deleting`]: false
			});
		} else {
			toggleInnerDeleting(false);
		}
	};

	const deleteOtherFilesSingle = () => {
		if (single) {
			files.forEach((file) => {
				removeFile(file);
			});
		}
	};

	const onDrop = callBack(async (uploadedFiles) => {
		startOnDrop();

		deleteOtherFilesSingle();

		getSignedUrl(uploadedFiles, folder, clientId, async (response) => {
			const arrayPromise = await response;
			const acceptedFiles = arrayPromise.filter((i) => i);
			if (acceptedFiles.length > 0) {
				const filesToAdd = single ? [ acceptedFiles[0] ] : [ ...files, ...acceptedFiles ];
				if (editable) {
					setFiles(filesToAdd);
				} else {
					setFiles({
						...anotherFiles,
						[varName] : filesToAdd
					});
				}
			} else {
				alert('Existio un problema subiendo el (los) documento(s), intente de nuevo');
			}

			endOnDrop();
		});
	});

	const { getRootProps, getInputProps } = useDropzone({
		accept   : 'application/pdf',
		onDrop,
		disabled : clientId === '',
		multiple : !single
	});

	const removeFile = async (file) => {
		startDeleting();
		const fileToDelete = editable ? file.name : file.fileName;

		deleteFile(fileToDelete, folder, clientId, (isDeleted) => {
			if (isDeleted) {
				const newFiles = files
					.map((file) => {
						if (file.hasOwnProperty('fileName') && file.fileName !== fileToDelete) {
							return file;
						}

						if (file.hasOwnProperty('name') && file.name !== fileToDelete) {
							return file;
						}

						return false;
					})
					.filter((i) => i);

				if (editable) {
					setFiles(newFiles);
				} else {
					setFiles({
						...anotherFiles,
						[varName] : newFiles
					});
				}
			} else {
				alert('No se pudo borrar el archivo, intente de nuevo');
			}

			endDeleting();
		});
	};

	const fileList = files.map((item, index) => (
		<ListItem key={index} alignItems='center'>
			<ListItemIcon
				className='cursor-pointer'
				onClick={() => {
					removeFile(item);
				}}
			>
				<DeleteIcon />
			</ListItemIcon>
			<ListItemIcon
				className='cursor-pointer'
				onClick={() => {
					handleClickOpenViewer(item.url);
				}}
			>
				<RemoveRedEyeIcon />
			</ListItemIcon>
			<ListItemText className='text-justify' primary={editable ? item.name : item.path} />
		</ListItem>
	));

	const [ file, setFile ] = React.useState({
		url      : null,
		numPages : null
	});

	const handleClickOpenViewer = (url) => {
		setFile({
			...file,
			url
		});
		setOpenViewer(true);
	};

	const [ openViewer, setOpenViewer ] = React.useState(false);

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

	const showFiles = () => {
		return (
			files.length > 0 && (
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
			)
		);
	};

	const showTexts = () => {
		if (editable) {
			return (
				<React.Fragment>
					{innerLoading || innerDeleting ? (
						<div className={`flex-col justify-around items-center w-full ${classes.center}`}>
							<Typography variant='h5' component='h3'>
								{innerLoading ? 'Cargando Archivos...' : 'Borrando Archivo'}
							</Typography>
							<CircularProgress className={classes.progress} />
						</div>
					) : (
						<React.Fragment>
							{clientId !== '' ? (
								<div {...getRootProps()}>
									<input {...getInputProps()} />
									<Typography variant='h5' component='h3'>
										{title}
									</Typography>
									<Typography component='p'>
										Puede arrastrar, o dar click para cargar los archivos
									</Typography>
								</div>
							) : (
								<React.Fragment>
									{innerDisabled && (
										<Typography variant='h5' component='h3'>
											Debe esperar que termine de subir el archivo
										</Typography>
									)}
									{clientId === '' && (
										<Typography variant='h5' component='h3'>
											Primero debe agregar el ID del Cliente
										</Typography>
									)}
								</React.Fragment>
							)}
							{showFiles()}
						</React.Fragment>
					)}
				</React.Fragment>
			);
		} else {
			return (
				<React.Fragment>
					{loading || deleting ? (
						<div className={`flex-col justify-around items-center w-full ${classes.center}`}>
							<Typography variant='h5' component='h3'>
								{loading ? 'Cargando Archivos...' : 'Borrando Archivo'}
							</Typography>
							<CircularProgress className={classes.progress} />
						</div>
					) : (
						<React.Fragment>
							{clientId !== '' && !disabledFiles[`${varName}Disabled`] ? (
								<div {...getRootProps()}>
									<input {...getInputProps()} />
									<Typography variant='h5' component='h3'>
										{title}
									</Typography>
									<Typography component='p'>
										Puede arrastrar, o dar click para cargar los archivos
									</Typography>
								</div>
							) : (
								<React.Fragment>
									{disabledFiles[`${varName}Disabled`] && (
										<Typography variant='h5' component='h3'>
											Debe esperar que termine de subir los otros archivos
										</Typography>
									)}
									{clientId === '' && (
										<Typography variant='h5' component='h3'>
											Primero debe agregar el ID del Cliente
										</Typography>
									)}
								</React.Fragment>
							)}
							{showFiles()}
						</React.Fragment>
					)}
				</React.Fragment>
			);
		}
	};

	return (
		<React.Fragment>
			<div className='flex flex-col min-h-128 h-full justify-around cursor-pointer'>{showTexts()}</div>

			<Dialog
				onClose={handleCloseViewer}
				fullWidth
				maxWidth='lg'
				fullScreen
				aria-labelledby='show-pdf'
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
		</React.Fragment>
	);
};

export default DropZone;
