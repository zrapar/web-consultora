/**
 * Authorization Roles
 */
const authRoles = {
	root       : [ 'root' ],
	admin      : [ 'root', 'admin' ],
	employee   : [ 'root', 'admin', 'employee' ],
	technician : [ 'root', 'admin', 'employee', 'technician' ],
	customer   : [ 'root', 'admin', 'employee', 'technician', 'customer' ],
	onlyGuest  : []
};

export default authRoles;
