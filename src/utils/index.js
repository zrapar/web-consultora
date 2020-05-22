import React from 'react';
import { Button } from '@material-ui/core';

export const layoutByRole = {
	root           : {
		layout           : {
			style  : 'layout1',
			config : {
				mode    : 'fullwidth',
				scroll  : 'content',
				navbar  : {
					display : true,
					folded  : true
				},
				toolbar : {
					display : false
				}
			}
		},
		customScrollbars : true,
		theme            : {
			main    : 'default',
			navbar  : 'mainThemeDark',
			toolbar : 'mainThemeLight',
			footer  : 'mainThemeDark'
		}
	},
	admin          : {
		layout           : {
			style  : 'layout1',
			config : {
				mode    : 'fullwidth',
				scroll  : 'content',
				navbar  : {
					display : true,
					folded  : true
				},
				toolbar : {
					display : false
				}
			}
		},
		customScrollbars : true,
		theme            : {
			main    : 'default',
			navbar  : 'mainThemeDark',
			toolbar : 'mainThemeLight',
			footer  : 'mainThemeDark'
		}
	},
	technician     : {
		layout           : {
			style  : 'layout3',
			config : {
				mode    : 'fullwidth',
				scroll  : 'body',
				navbar  : {
					display : true
				},
				toolbar : {
					display  : true,
					position : 'below'
				}
			}
		},
		customScrollbars : true,
		theme            : {
			main    : 'greeny',
			navbar  : 'mainThemeDark',
			toolbar : 'mainThemeDark',
			footer  : 'mainThemeDark'
		}
	},
	administrative : {
		layout           : {
			style  : 'layout2',
			config : {
				mode    : 'fullwidth',
				scroll  : 'content',
				toolbar : {
					display  : true,
					position : 'below'
				}
			}
		},
		customScrollbars : true,
		theme            : {
			main    : 'greeny',
			navbar  : 'mainThemeDark',
			toolbar : 'mainThemeDark',
			footer  : 'mainThemeDark'
		}
	},
	customer       : {
		layout           : {
			style  : 'layout3',
			config : {
				mode    : 'boxed',
				scroll  : 'content',
				navbar  : {
					display : true
				},
				toolbar : {
					display  : true,
					position : 'below'
				}
			}
		},
		customScrollbars : true,
		theme            : {
			main    : 'greeny',
			navbar  : 'mainThemeDark',
			toolbar : 'mainThemeDark',
			footer  : 'mainThemeDark'
		}
	}
};

export const getRoleNameByUserType = (userType) => {
	switch (userType) {
		case 0:
			return 'root';
		case 1:
			return 'admin';
		case 2:
			return 'technician';
		case 3:
			return 'customer';
		case 4:
		default:
			return 'administrative';
	}
};

export const rolesTranslate = (userType) => {
	const roles = [
		{ value: 0, label: 'Administrador' },
		{ value: 1, label: 'Administrador' },
		{ value: 2, label: 'Tecnico' },
		{ value: 3, label: 'Cliente' },
		{ value: 4, label: 'Administrativo' }
	];

	return roles.filter((i) => i.value === userType)[0].label;
};

export const tableTitles = (type) => {
	switch (type) {
		case 'addressFormalData':
			return [
				'Calle / Ruta',
				'N° / Km',
				'Piso',
				'Departamento',
				'Localidad',
				'Codigo Postal',
				'Partido',
				'Provincia',
				'Tipo de Direccion',
				'Acciones'
			];
		case 'legalRepresentativeFormalData':
			return [
				'Nombre',
				'Apellido',
				'DNI',
				'Cargo',
				'CUIL',
				'Estatutos',
				'Actas de Designación',
				'Poderes',
				'Otros Documentos',
				'Documento DNI',
				'Acciones'
			];
		case 'dataPlanta':
			return [
				'ID del Establecimiento',
				'Calle / Ruta',
				'N° / Km',
				'Piso',
				'Departamento',
				'Localidad',
				'Codigo Postal',
				'Partido',
				'Provincia',
				'Email de la planta',
				'Telefono(s) de Contacto',
				'Contacto(s) Interno(s)',
				'Usuarios Gubernamentales',
				'Inmueble(s)',
				'Acciones'
			];
		case 'phoneContactsPlanta':
			return [ 'Numero de Contacto', 'Acciones' ];
		case 'innerContactsPlanta':
			return [
				'Nombre del contacto interno',
				'Apellido del contacto interno',
				'Telefono del Contacto interno',
				'Cargo',
				'Area',
				'Acciones'
			];
		case 'innerContactsEmailPlanta':
			return [ 'Emails del Contacto', 'Acciones' ];
		case 'mobiliaryPlanta':
			return [
				'Partida Inmobiliara Provincial',
				'Matricula en registro de la propiedad',
				'Circunscrición',
				'Sección',
				'Fracción',
				'Manzana',
				'Parcela',
				'Poligono',
				'Propietario',
				'Caracter uso de suelo',
				'Tiene Documentación',
				'Observaciones',
				'Superficie',
				'Acciones'
			];

		default:
			return false;
	}
};

export const tableIndex = (type) => {
	switch (type) {
		case 'addressFormalData':
			return [
				'calleRuta',
				'nKm',
				'piso',
				'depto',
				'localidad',
				'codigo_postal',
				'partido',
				'provincia',
				'type',
				'actions'
			];
		case 'legalRepresentativeFormalData':
			return [
				'name',
				'dni',
				'position',
				'cuil',
				'estatuto',
				'actaDesignacion',
				'poderes',
				'extraPdfs',
				'dniDocument',
				'actions'
			];
		case 'dataPlanta':
			return [
				'id_establecimiento',
				'calleRuta',
				'nKm',
				'piso',
				'depto',
				'localidad',
				'codigo_postal',
				'partido',
				'provincia',
				'email',
				'phoneContacts',
				'innerContact',
				'govermentUsers',
				'mobiliary',
				'actions'
			];

		case 'innerContactsPlanta':
			return [ 'name', 'lastName', 'phone', 'email', 'position', 'workArea', 'actions' ];

		case 'mobiliaryPlanta':
			return [
				'partidaInmobiliaria',
				'matricula',
				'circunscripcion',
				'seccion',
				'fraccion',
				'manzana',
				'parcela',
				'poligono',
				'propietario',
				'caracterUso',
				'documentacion',
				'observaciones',
				'superficie',
				'plancheta',
				'documentacionUso',
				'actions'
			];
		case 'phoneContactsPlanta':
			return [ 'index', 'actions' ];
		case 'govermentUsers':
			return [ 'type', 'user', 'pass', 'actions' ];
		case 'innerContactsEmailPlanta':
			return [ 'index', 'actions' ];
		default:
			return false;
	}
};

export const getTitle = (type) => {
	switch (type) {
		case 'addressFormalData':
			return 'Domicilios agregados';
		case 'legalRepresentativeFormalData':
			return 'Representantes legales agregados';
		case 'dataPlanta':
			return 'Plantas agregadas';
		case 'phoneContactsPlanta':
			return 'Numeros de contacto de la planta agregados';
		case 'innerContactsPlanta':
			return 'Contactos internos de la planta agregados';
		case 'innerContactsEmailPlanta':
			return 'Emails del Contacto Interno';
		case 'mobiliaryPlanta':
			return 'Inmuebles de la planta agregados';
		case 'govermentUsers':
			return 'Usuarios Gubernamentales';
		default:
			return 'Titulo';
	}
};

export const getColumns = (type, handleClickOpen, setNewEditableData, setDataDropZone) => {
	switch (type) {
		case 'addressFormalData':
			return [
				{ title: 'Calle / Ruta', field: 'calleRuta' },
				{ title: 'N° / Km', field: 'nKm' },
				{ title: 'Piso', field: 'piso' },
				{ title: 'Departamento', field: 'depto' },
				{ title: 'Localidad', field: 'localidad' },
				{ title: 'Codigo Postal', field: 'codigo_postal' },
				{ title: 'Partido', field: 'partido' },
				{ title: 'Provincia', field: 'provincia' },
				{
					title  : 'Tipo de Direccion',
					field  : 'type',
					lookup : {
						legal      : 'Domicilio Legal',
						registered : 'Domicilio Constituido',
						additional : 'Otro Domicilio'
					}
				}
			];
		case 'legalRepresentativeFormalData':
			return [
				{ title: 'Nombre', field: 'first_name' },
				{ title: 'Apellido', field: 'last_name' },
				{ title: 'DNI', field: 'dni' },
				{ title: 'Cargo', field: 'position' },
				{ title: 'CUIL', field: 'cuil' },
				{
					title    : 'Estatutos',
					field    : 'estatuto',
					render   : (rowData) => (
						<Button
							className='whitespace-no-wrap '
							variant='contained'
							onClick={() => {
								setDataDropZone({
									folder  : 'estatutos',
									varName : 'estatuto',
									title   : 'Estatutos',
									single  : false,
									rowData : rowData
								});
								handleClickOpen(rowData.estatuto);
							}}
						>
							Ver estatutos
						</Button>
					),
					editable : 'never'
				},
				{
					title    : 'Actas de Designación',
					field    : 'actaDesignacion',
					render   : (rowData) => (
						<Button
							className='whitespace-no-wrap '
							variant='contained'
							onClick={() => {
								setDataDropZone({
									folder  : 'actas',
									varName : 'actaDesignacion',
									title   : 'Actas de Designacion',
									single  : false,
									rowData : rowData
								});
								handleClickOpen(rowData.actaDesignacion);
							}}
						>
							Ver Actas de designacion
						</Button>
					),
					editable : 'never'
				},
				{
					title    : 'Poderes',
					field    : 'poderes',
					render   : (rowData) => (
						<Button
							className='whitespace-no-wrap '
							variant='contained'
							onClick={() => {
								setDataDropZone({
									folder  : 'poderes',
									varName : 'poderes',
									title   : 'Poderes',
									single  : false,
									rowData : rowData
								});
								handleClickOpen(rowData.poderes);
							}}
						>
							Ver poderes
						</Button>
					),
					editable : 'never'
				},
				{
					title    : 'Otros Documentos',
					field    : 'extraPdfs',
					render   : (rowData) => (
						<Button
							className='whitespace-no-wrap '
							variant='contained'
							onClick={() => {
								setDataDropZone({
									folder  : 'extras',
									varName : 'extraPdfs',
									title   : 'Otros Documentos',
									single  : false,
									rowData : rowData
								});
								handleClickOpen(rowData.extraPdfs);
							}}
						>
							Ver otros documentos
						</Button>
					),
					editable : 'never'
				},
				{
					title    : 'DNI',
					field    : 'dniDocument',
					render   : (rowData) => (
						<Button
							className='whitespace-no-wrap '
							variant='contained'
							onClick={() => {
								setDataDropZone({
									folder  : 'dniDocument',
									varName : 'dniDocument',
									title   : 'DNI (opcional)',
									single  : true,
									rowData : rowData
								});
								handleClickOpen(rowData.dniDocument);
							}}
						>
							Ver el documento DNI
						</Button>
					),
					editable : 'never'
				}
			];
		case 'dataPlanta':
			return [
				{ title: 'ID del Establecimiento', field: 'id_establecimiento' },
				{ title: 'Calle / Ruta', field: 'address.calleRuta' },
				{ title: 'N° / Km', field: 'address.nKm' },
				{ title: 'Piso', field: 'address.piso' },
				{ title: 'Departamento', field: 'address.depto' },
				{ title: 'Localidad', field: 'address.localidad' },
				{ title: 'Codigo Postal', field: 'address.codigo_postal' },
				{ title: 'Partido', field: 'address.partido' },
				{ title: 'Provincia', field: 'address.provincia' },
				{ title: 'Email de la planta', field: 'email' },
				{
					title    : 'Telefono(s) de Contacto',
					field    : 'phoneContacts',
					render   : (rowData) => (
						<Button
							className='whitespace-no-wrap '
							variant='contained'
							onClick={() =>
								setNewEditableData('phoneContactsPlanta', rowData.phoneContacts, rowData.tableData.id)}
						>
							Ver telefonos de contacto
						</Button>
					),
					editable : 'never'
				},
				{
					title    : 'Contacto(s) Interno(s)',
					field    : 'innerContact',
					render   : (rowData) => (
						<Button
							className='whitespace-no-wrap '
							variant='contained'
							onClick={() =>
								setNewEditableData('innerContactsPlanta', rowData.innerContact, rowData.tableData.id)}
						>
							Ver contactos internos
						</Button>
					),
					editable : 'never'
				},
				{
					title    : 'Usuarios Gubernamentales',
					field    : 'govermentUsers',
					render   : (rowData) => (
						<Button
							className='whitespace-no-wrap '
							variant='contained'
							onClick={() =>
								setNewEditableData('govermentUsers', rowData.govermentUsers, rowData.tableData.id)}
						>
							Ver Usuarios Gubernamentales
						</Button>
					),
					editable : 'never'
				},

				{
					title    : 'Inmueble(s)',
					field    : 'mobiliary',
					render   : (rowData) => (
						<Button
							className='whitespace-no-wrap '
							variant='contained'
							onClick={() => {
								setNewEditableData('mobiliaryPlanta', rowData.mobiliary, rowData.tableData.id);
							}}
						>
							Ver inmuebles
						</Button>
					),
					editable : 'never'
				}
			];
		case 'phoneContactsPlanta':
			return [ { title: 'Numero de Contacto', field: 'phone' } ];
		case 'innerContactsPlanta':
			return [
				{ title: 'Nombre del contacto interno', field: 'name' },
				{ title: 'Apellido del contacto interno', field: 'lastName' },
				{ title: 'Telefono del Contacto interno', field: 'phone' },
				{ title: 'Cargo', field: 'position' },
				{ title: 'Area', field: 'workArea' },
				{
					title    : 'Emails del contacto interno',
					field    : 'email',
					render   : (rowData) => (
						<Button
							className='whitespace-no-wrap '
							variant='contained'
							onClick={() =>
								setNewEditableData('innerContactsEmailPlanta', rowData.email, rowData.tableData.id)}
						>
							Ver emails del contacto
						</Button>
					),
					editable : 'never'
				}
			];
		case 'innerContactsEmailPlanta':
			return [ { title: 'Emails del Contacto', field: 'email' } ];
		case 'govermentUsers':
			return [
				{ title: 'Cuenta', field: 'type' },
				{ title: 'Usuario', field: 'user' },
				{ title: 'Contraseña', field: 'pass' }
			];
		case 'mobiliaryPlanta':
			return [
				{ title: 'Partida Inmobiliara Provincial', field: 'partidaInmobiliaria' },
				{ title: 'Matricula en registro de la propiedad', field: 'matricula' },
				{ title: 'Circunscrición', field: 'circunscripcion' },
				{ title: 'Sección', field: 'seccion' },
				{ title: 'Fracción', field: 'fraccion' },
				{ title: 'Manzana', field: 'manzana' },
				{ title: 'Parcela', field: 'parcela' },
				{ title: 'Poligono', field: 'poligono' },
				{ title: 'Propietario', field: 'propietario' },
				{ title: 'Caracter uso de suelo', field: 'caracterUso' },
				{ title: 'Tiene Documentación', field: 'documentacion' },
				{ title: 'Superficie Númerica', field: 'superficie' },
				{ title: 'Observaciones', field: 'observaciones' },
				{
					title    : 'Plancheta',
					field    : 'plancheta',
					render   : (rowData) => (
						<Button
							className='whitespace-no-wrap '
							variant='contained'
							onClick={() => {
								setDataDropZone({
									folder  : 'planchetas',
									varName : 'plancheta',
									title   : 'Plancheta',
									single  : true,
									rowData : rowData
								});
								handleClickOpen(rowData.plancheta);
							}}
						>
							Ver plancheta
						</Button>
					),
					editable : 'never'
				},
				{
					title    : 'Documentacion de Uso',
					field    : 'documentacionUso',
					render   : (rowData) => (
						<Button
							className='whitespace-no-wrap '
							variant='contained'
							onClick={() => {
								const data = rowData.documentacionUso ? rowData.documentacionUso : [];
								setDataDropZone({
									folder  : 'documentacionUso',
									varName : 'documentacionUso',
									title   : 'Documentacion de uso',
									single  : true,
									rowData : rowData
								});
								handleClickOpen(data);
							}}
						>
							Ver Documentacion de uso
						</Button>
					),
					editable : 'never'
				}
			];
		default:
			return [];
	}
};

export const convertData = (type, data, getSame = false) => {
	if (getSame) {
		return data;
	} else {
		switch (type) {
			case 'phoneContactsPlanta':
				return data.map((o) => {
					return { phone: o };
				});

			case 'innerContactsEmailPlanta':
				return data.map((o) => {
					return { email: o };
				});
			case 'govermentUsers':
				return Object.keys(data).map((i) => {
					return {
						type : i.toUpperCase(),
						user : data[i].user,
						pass : data[i].pass
					};
				});

			case 'innerContactsPlanta':
			case 'addressFormalData':
			case 'legalRepresentativeFormalData':
			case 'dataPlanta':
			case 'mobiliaryPlanta':
				return data;
			default:
				return [];
		}
	}
};

export const getTreeData = (root, actual) => {
	switch (root) {
		case 'addressFormalData':
			return { hasChild: false, hasParent: false };
		case 'legalRepresentativeFormalData':
			return { hasChild: false, hasParent: false };
		case 'dataPlanta':
			if (actual === 'phoneContactsPlanta') {
				return { hasChild: false, hasParent: true };
			}
			if (actual === 'innerContactsPlanta') {
				return { hasChild: true, hasParent: true };
			}
			if (actual === 'innerContactsEmailPlanta') {
				return { hasChild: false, hasParent: true };
			}
			if (actual === 'govermentUsers') {
				return { hasChild: false, hasParent: true };
			}
			if (actual === 'mobiliaryPlanta') {
				return { hasChild: false, hasParent: true };
			}
			return { hasChild: true, hasParent: false };
		case 'phoneContactsPlanta':
			return { hasChild: false, hasParent: false };
		case 'innerContactsPlanta':
			if (actual === 'innerContactsEmailPlanta') {
				return { hasChild: false, hasParent: true };
			}
			return { hasChild: true, hasParent: false };
		case 'innerContactsEmailPlanta':
			return { hasChild: false, hasParent: false };
		case 'mobiliaryPlanta':
			return { hasChild: false, hasParent: false };
		default:
			return false;
	}
};

export const dataClientShow = {
	formalData : {
		clientId            : '',
		clientName          : '',
		cuit                : '',
		rubro               : '',
		address             : {
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
		},
		legalRepresentative : {
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
		}
	},
	planta     : {
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
	}
};

export const isEmail = (email) => {
	// eslint-disable-next-line no-useless-escape
	const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regex.test(email);
};

export const isNaturalPositiveNumber = (number) => {
	// eslint-disable-next-line no-useless-escape
	const regex = /^[0-9]*$/gm;
	return regex.test(number);
};

export const isValidDecimalNumber = (number) => {
	// eslint-disable-next-line no-useless-escape
	const regex = /^[0-9]*\,?[0-9]+$/g;
	return regex.test(number);
};

export const capitalize = (s) => {
	if (s.length === 0) return s;
	let arrString = s.split(' ');
	arrString.forEach((s, index) => {
		arrString[index] = s.charAt(0).toUpperCase() + s.slice(1);
	});
	return arrString.join(' ');
};
