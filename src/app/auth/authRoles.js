/**
 * Authorization Roles
 */
const authRoles = {
	root           : [ 'root' ],
	admin          : [ 'root', 'admin' ],
	administrative : [ 'root', 'admin', 'administrative' ],
	technician     : [ 'root', 'admin', 'administrative', 'technician' ],
	customer       : [ 'root', 'admin', 'administrative', 'technician', 'customer' ],
	onlyGuest      : []
};

export default authRoles;
